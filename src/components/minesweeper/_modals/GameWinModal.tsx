import React, { Dispatch } from "react";
import { GameState } from "@/types/mineType";

interface GameWinProps {
  gameState: GameState;
  username: string;
  setUsername: Dispatch<React.SetStateAction<string>>;
  handleSubmitScore: () => void;
}
export default function GameWinModal({
  gameState,
  username,
  setUsername,
  handleSubmitScore,
}: GameWinProps) {
  if (gameState !== "won") return null;

  return (
    <>
      <div className="text-green-600 text-lg font-bold">🎉 You Win!</div>
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="mb-2">이름을 입력해주세요 🙂</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={handleSubmitScore}
            className="ml-2 bg-slate-400 text-white px-4 py-2 rounded"
          >
            제출
          </button>
        </div>
      </div>
    </>
  );
}
