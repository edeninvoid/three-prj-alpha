import { ScoreEntry } from "@/types/mineType";
import { formatSecondsToMinutes } from "@/helpers/mineHelper";
import { ApiError } from "@/libs/errors/ApiError";

export async function getMineScoresApi(): Promise<ScoreEntry[]> {
  const res = await fetch("/api/minesweeper/getScores");

  if (!res.ok) {
    throw new Error("Failed to Fetch Scores");
  }

  const json = await res.json();

  return json.data;
}

export async function postMineSaveScoreApi(
  score: ScoreEntry,
): Promise<ScoreEntry> {
  const res = await fetch("/api/minesweeper/saveScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(score),
  });

  const json = await res.json();

  if (!res.ok) {
    alert(
      `${json.data.name}님, ${json.message} (${formatSecondsToMinutes(json.data.time)})`,
    );
    throw new ApiError(json.message, json.data);
  }

  return json.data;
}
