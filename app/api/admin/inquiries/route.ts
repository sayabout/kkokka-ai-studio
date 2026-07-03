import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 목록: GET /api/admin/inquiries
// 상세(답변 포함): GET /api/admin/inquiries?id=123
export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, rows: [], reason: "Supabase 서버 키가 설정되지 않았습니다." });
  }

  const supabase = createAdminClient();
  const id = new URL(req.url).searchParams.get("id");

  if (id) {
    const { data: replies, error } = await supabase
      .from("inquiry_replies").select("*").eq("inquiry_id", id).order("created_at", { ascending: true });
    if (error) return NextResponse.json({ ok: false, replies: [], reason: error.message });
    return NextResponse.json({ ok: true, replies: replies ?? [] });
  }

  const { data, error } = await supabase
    .from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, rows: [], reason: error.message });
  return NextResponse.json({ ok: true, rows: data ?? [] });
}
