import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.message || !b.password) {
      return NextResponse.json({ ok: false, error: "필수 항목이 비었습니다." }, { status: 400 });
    }
    if (String(b.password).length < 4) {
      return NextResponse.json({ ok: false, error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("inquiries").insert({
      title: b.title || "AI 제작 문의 드립니다",
      name: b.name,
      email: b.email,
      company_name: b.company || null,
      budget_range: b.budget || null,
      timeline: b.timeline || null,
      reference_links: b.refs || null,
      message: b.message,
      project_types: Array.isArray(b.project_types) && b.project_types.length ? b.project_types : null,
      password_hash: hashPassword(String(b.password)),
      agree_privacy: true,
      status: "new",
    }).select("id, ref_no").single();

    if (error) throw error;

    // 관리자에게 메일 알림 (실패해도 접수는 성공)
    try {
      const origin = new URL(req.url).origin;
      await fetch(`${origin}/api/notify-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, ref_no: data?.ref_no }),
      });
    } catch {}

    return NextResponse.json({ ok: true, ref_no: data?.ref_no });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "서버 오류" }, { status: 500 });
  }
}
