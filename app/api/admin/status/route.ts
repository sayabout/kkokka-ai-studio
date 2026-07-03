import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();
    const allowed = ["new", "in_progress", "closed"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ ok: false, error: "잘못된 요청" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { error } = await supabase.from("inquiries")
      .update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
