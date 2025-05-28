type Difficulty = "easy" | "medium" | "hard";

type GameState = "playing" | "won" | "over";

type Cell = {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type ScoreEntry = {
  name: string;
  time: number;
  difficulty: Difficulty;
};

export type { Difficulty, GameState, Cell, ScoreEntry };
