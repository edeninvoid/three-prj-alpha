import { Difficulty } from "@/types/mineType";
import clsx from "clsx";
import { DIFFICULTY_TITLE, formatSecondsToMinutes } from "@/helpers/mineHelper";
import React from "react";

interface GameSelectorProps {
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  seconds: number;
  startNewGame: () => void;
}

export default function GameSelector({
  difficulty,
  setDifficulty,
  seconds,
  startNewGame,
}: GameSelectorProps) {
  return (
    <section>
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
          <button
            key={level}
            className={clsx(
              "px-4 py-1 rounded font-semibold",
              level === difficulty ? "bg-slate-300" : "bg-gray-100",
            )}
            onClick={() => setDifficulty(level)}
          >
            {DIFFICULTY_TITLE[level]}
          </button>
        ))}
        <button
          className="px-4 py-1 bg-neutral-500 text-white rounded font-semibold"
          onClick={startNewGame}
        >
          Restart
        </button>
      </div>
      <div>{formatSecondsToMinutes(seconds)}</div>
    </section>
  );
}
