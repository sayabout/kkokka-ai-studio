import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();
    if (!id || !password) {
      return NextResponse.json({ ok: false, error: "정보가 부족합니다." }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data: inq, error } = await supabase
      .from("inquiries").select("*").eq("id", id).single();
    if (error || !inq) {
      return NextResponse.json({ ok: false, error: "문의를 찾을 수 없습니다." }, { status: 404 });
    }
    if (!verifyPassword(String(password), inq.password_hash || "")) {
      return NextResponse.json({ ok: false, error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    const { data: replies } = await supabase
      .from("inquiry_replies").select("*").eq("inquiry_id", id).order("created_at", { ascending: true });

    // 비번 해시는 응답에서 제외
    const { password_hash, ...safe } = inq;
    return NextResponse.json({ ok: true, inquiry: safe, replies: replies ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "서버 오류" }, { status: 500 });
  }
}
