import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 관리자: 파일(영상/이미지)을 Supabase Storage(site-media 버킷)에 업로드하고 공개 URL 반환
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const kind = String(form.get("kind") || "file"); // desktop_video | mobile_video | poster
    if (!file) return NextResponse.json({ ok: false, error: "파일이 없습니다." }, { status: 400 });

    const supabase = createAdminClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "bin";
    const path = `${kind}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("site-media").upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from("site-media").getPublicUrl(path);
    return NextResponse.json({ ok: true, url: pub.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "업로드 실패" }, { status: 500 });
  }
}
