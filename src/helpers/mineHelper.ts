import { Cell } from "@/types/mineType";

export const MAX_SCORES_PER_DIFFICULTY = 5;

export const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 1 },
  medium: { rows: 16, cols: 16, mines: 30 },
  hard: { rows: 16, cols: 30, mines: 50 },
};

export const DIFFICULTY_TITLE = {
  easy: "쉬움",
  medium: "중간",
  hard: "어려움",
};

function generateBoard(
  rows: number,
  cols: number,
  mineCount: number,
): Cell[][] {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isOpen: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
  );

  let placedMines = 0;
  while (placedMines < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (board[r + dr]?.[c + dc]?.isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

function formatSecondsToMinutes(sec: number) {
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export { formatSecondsToMinutes, generateBoard };
