import { DIFFICULTY_TITLE, formatSecondsToMinutes } from "@/helpers/mineHelper";
import React from "react";
import { ScoreEntry } from "@/types/mineType";

interface ScoreboardProps {
  scoreboard: ScoreEntry[];
}

export default function Scoreboard({ scoreboard }: ScoreboardProps) {
  const difficulties = [
    ...new Set(scoreboard.map((entry) => entry.difficulty)),
  ];

  if (scoreboard.length === 0) return null;

  return (
    <div className="mt-8">
      <h3>🏆 RANK</h3>
      {difficulties.map((difficulty) => {
        const filtered = scoreboard
          .filter((entry) => entry.difficulty === difficulty)
          .sort((a, b) => a.time - b.time);

        if (filtered.length === 0) return null;

        return (
          <div key={difficulty} className="mb-4">
            <h4 className="font-bold capitalize">
              🎯 {DIFFICULTY_TITLE[difficulty]} 난이도
            </h4>
            <ul>
              {filtered.map((entry, idx) => (
                <li key={idx}>
                  {idx + 1}등 - {entry.name} (
                  {formatSecondsToMinutes(entry.time)})
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
