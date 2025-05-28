import React from "react";
import { GameState } from "@/types/mineType";

interface GameOverProps {
  gameState: GameState;
}

export default function GameOver({ gameState }: GameOverProps) {
  if (gameState !== "over") return null;
  return (
    <div className="text-fuchsia-600 text-lg font-bold">💥 Game Over!</div>
  );
}
