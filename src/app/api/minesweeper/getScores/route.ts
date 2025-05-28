import { supabase } from "@/libs/clients/supabase";
import { NextResponse } from "next/server";
import { MAX_SCORES_PER_DIFFICULTY } from "@/helpers/mineHelper";

export async function GET(_req: Request) {
  const { data, error } = await supabase
    .from("minesweeper")
    .select("*")
    .order("time", { ascending: true })
    .limit(MAX_SCORES_PER_DIFFICULTY);

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, data }, { status: 200 });
}
