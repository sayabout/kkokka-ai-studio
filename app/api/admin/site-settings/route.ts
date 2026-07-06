import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const supabase = createAdminClient();
    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    for (const k of ["desktop_video_url","mobile_video_url","poster_url","overlay_opacity","whyai_video_main","whyai_video_sub1","whyai_video_sub2","headline","subcopy"]) {
      if (b[k] !== undefined) patch[k] = b[k];
    }
    const { error } = await supabase.from("site_settings").update(patch).eq("id", 1);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}