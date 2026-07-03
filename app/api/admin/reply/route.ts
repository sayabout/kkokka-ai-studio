import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { id, body } = await req.json();
    if (!id || !body) return NextResponse.json({ ok: false, error: "정보 부족" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from("inquiry_replies").insert({
      inquiry_id: id, is_admin: true, body,
    });
    if (error) throw error;
    await supabase.from("inquiries").update({ updated_at: new Date().toISOString() }).eq("id", id);

    // 고객에게 답변 알림 메일
    const { data: inq } = await supabase.from("inquiries").select("email, ref_no, title").eq("id", id).single();
    if (inq?.email) {
      try {
        const origin = new URL(req.url).origin;
        await fetch(`${origin}/api/notify-reply`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: inq.email, ref_no: inq.ref_no, title: inq.title }),
        });
      } catch {}
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
