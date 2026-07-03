import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 공개 조회: 홈페이지가 히어로 영상/카피를 불러올 때 사용
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return NextResponse.json({ ok: true, settings: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
