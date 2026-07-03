import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const { id, password, body } = await req.json();
    if (!id || !password || !body) {
      return NextResponse.json({ ok: false, error: "정보가 부족합니다." }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data: inq } = await supabase.from("inquiries").select("id, password_hash").eq("id", id).single();
    if (!inq || !verifyPassword(String(password), inq.password_hash || "")) {
      return NextResponse.json({ ok: false, error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }
    const { error } = await supabase.from("inquiry_replies").insert({
      inquiry_id: id, is_admin: false, body,
    });
    if (error) throw error;
    await supabase.from("inquiries").update({ updated_at: new Date().toISOString() }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "서버 오류" }, { status: 500 });
  }
}
