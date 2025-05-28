import { NextResponse } from "next/server";
import { supabase } from "@/libs/clients/supabase";
import { MAX_SCORES_PER_DIFFICULTY } from "@/helpers/mineHelper";
import { PostgrestError } from "@supabase/supabase-js";

const insertErrorResponse = (error: PostgrestError) => {
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      message: "데이터 저장에 실패했습니다.",
    },
    {
      status: 500,
    },
  );
};

export async function POST(req: Request) {
  const body = await req.json();
  const name = body.name?.toString();
  const time = Number(body.time);
  const difficulty = body.difficulty?.toString();

  if (!name || !time || !difficulty) {
    return NextResponse.json(
      { success: false, message: "입력 파라미터가 누락되었습니다." },
      { status: 400 },
    );
  }

  const { data: topScores, error: selectError } = await supabase
    .from("minesweeper")
    .select("*")
    .eq("difficulty", difficulty)
    .order("time", { ascending: true })
    .limit(MAX_SCORES_PER_DIFFICULTY);

  if (selectError)
    return NextResponse.json(
      {
        success: false,
        message: "조회에 실패했습니다.",
      },
      { status: 500 },
    );

  if (topScores?.length < MAX_SCORES_PER_DIFFICULTY) {
    const { error: insertError } = await supabase
      .from("minesweeper")
      .insert([{ name, time, difficulty }]);

    if (insertError) return insertErrorResponse(insertError);

    return NextResponse.json(
      { success: true, message: "성공적으로 저장되었습니다." },
      { status: 201 },
    );
  }

  if (time < topScores[topScores.length - 1].time) {
    const { error: insertError } = await supabase
      .from("minesweeper")
      .insert([{ name, time, difficulty }]);

    if (insertError) return insertErrorResponse(insertError);

    const { data: allScores } = await supabase
      .from("minesweeper")
      .select("*")
      .eq("difficulty", difficulty)
      .order("time", { ascending: true });

    if (allScores && allScores.length > MAX_SCORES_PER_DIFFICULTY) {
      const worst = allScores[allScores.length - 1];

      await supabase.from("minesweeper").delete().eq("id", worst.id);
    }

    return NextResponse.json(
      { success: true, message: "성공적으로 저장되었습니다." },
      { status: 201 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "아쉽게도 순위권에 들지 못했습니다.",
      data: {
        name,
        time,
        difficulty,
      },
    },
    { status: 409 },
  );
}
