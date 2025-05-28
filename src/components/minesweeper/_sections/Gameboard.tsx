import { Cell, GameState } from "@/types/mineType";
import clsx from "clsx";
import React, { MouseEvent } from "react";

interface GameboardProps {
  cols: number;
  board: Cell[][];
  setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function Gameboard({
  cols,
  board,
  setBoard,
  gameState,
  setGameState,
}: GameboardProps) {
  const openCell = (r: number, c: number) => {
    if (gameState !== "playing") return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    const floodFill = (r: number, c: number) => {
      const cell = newBoard[r]?.[c];
      if (!cell || cell.isOpen || cell.isFlagged) return;
      cell.isOpen = true;
      if (cell.adjacentMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(r + dr, c + dc);
          }
        }
      }
    };

    const clicked = newBoard[r][c];
    if (clicked.isMine) {
      clicked.isOpen = true;
      setGameState("over");
    } else {
      floodFill(r, c);
    }

    const allSafeOpened = newBoard
      .flat()
      .filter((cell) => !cell.isMine)
      .every((cell) => cell.isOpen);
    if (allSafeOpened) {
      setGameState("won");
    }

    setBoard(newBoard);
  };

  const toggleFlag = (e: MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;
    setBoard((prev) => {
      const newBoard = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = newBoard[r][c];
      if (!cell.isOpen) cell.isFlagged = !cell.isFlagged;
      return newBoard;
    });
  };

  return (
    <div
      className="grid place-items-center"
      style={{
        gridTemplateColumns: `repeat(${cols}, 24px)`,
        gridAutoRows: "24px",
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            onClick={() => openCell(rIdx, cIdx)}
            onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
            className={clsx(
              "w-6 h-6 border text-xs text-center leading-6 cursor-pointer select-none",
              cell.isOpen ? "bg-slate-200" : "bg-slate-400",
              cell.isFlagged &&
                !cell.isOpen &&
                "text-red-500 border-red-500 border-[1.4px]",
            )}
          >
            {cell.isOpen
              ? cell.isMine
                ? "💣"
                : cell.adjacentMines || ""
              : cell.isFlagged
                ? "🚩"
                : ""}
          </div>
        )),
      )}
    </div>
  );
}
