"use client";

import React, { useState, useEffect } from "react";
import { Cell, Difficulty, GameState, ScoreEntry } from "@/types/mineType";
import { DIFFICULTY_SETTINGS, generateBoard } from "@/helpers/mineHelper";
import { getMineScoresApi, postMineSaveScoreApi } from "@/services/mineApi";
import Scoreboard from "@/components/minesweeper/_sections/Scoreboard";
import Gameboard from "@/components/minesweeper/_sections/Gameboard";
import GameWinModal from "@/components/minesweeper/_modals/GameWinModal";
import GameOver from "@/components/minesweeper/_sections/GameOver";
import GameSelector from "@/components/minesweeper/_sections/GameSelector";

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [username, setUsername] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [seconds, setSeconds] = useState<number>(0);
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>([]);

  const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty];

  useEffect(() => {
    getMineScoresApi().then(setScoreboard);
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const startNewGame = () => {
    setBoard(generateBoard(rows, cols, mines));
    setSeconds(0);
    setGameState("playing");
  };

  const handleSubmitScore = () => {
    const newScore = { name: username, time: seconds, difficulty };
    postMineSaveScoreApi(newScore)
      .then(() => getMineScoresApi().then(setScoreboard))
      .catch((err) => setScoreboard((prv) => [...prv, err.data]));
    setUsername("");
    startNewGame();
  };

  return (
    <section className="p-4 flex flex-col items-center gap-7">
      <h1 className="text-2xl font-bold underline">Minesweeper 💣</h1>
      <div className={`flex gap-10`}>
        <div className={`grid place-items-center gap-4`}>
          <GameSelector
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            seconds={seconds}
            startNewGame={startNewGame}
          />
          <Gameboard
            cols={cols}
            board={board}
            setBoard={setBoard}
            gameState={gameState}
            setGameState={setGameState}
          />
        </div>
        <Scoreboard scoreboard={scoreboard} />
      </div>
      <GameOver gameState={gameState} />
      <GameWinModal
        gameState={gameState}
        username={username}
        setUsername={setUsername}
        handleSubmitScore={handleSubmitScore}
      />
    </section>
  );
}
