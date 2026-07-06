import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("works").select("*")
      .order("sort_order", { ascending: true }).order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ ok: true, works: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message, works: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.title?.trim()) return NextResponse.json({ ok: false, error: "제목을 입력하세요." }, { status: 400 });
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("works").insert({
      title: b.title, category: b.category || "AI Brand Film",
      client_type: b.client_type || null, year: b.year || null,
      video_url: b.video_url || null, thumbnail_url: b.thumbnail_url || null,
      description: b.description || "", is_public: b.is_public ?? true,
      is_featured: b.is_featured ?? false, sort_order: b.sort_order ?? 0,
      orientation: b.orientation || "landscape",
      tags: b.tags || "",
    }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ ok: true, work: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const b = await req.json();
    if (!b.id) return NextResponse.json({ ok: false, error: "id 없음" }, { status: 400 });
    const supabase = createAdminClient();
    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    for (const k of ["title","category","client_type","year","video_url","thumbnail_url","description","is_public","is_featured","sort_order","orientation","tags"]) {
      if (b[k] !== undefined) patch[k] = b[k];
    }
    const { error } = await supabase.from("works").update(patch).eq("id", b.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const supabase = createAdminClient();
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}