// app/api/admin/capabilities/route.ts
// works 라우트와 동일한 구조 · service-role 클라이언트가 RLS 우회하여 CRUD 처리
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CATS = ["engine_video", "engine_image", "tool", "effect"];

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("capabilities").select("*")
      .order("category", { ascending: true }).order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, capabilities: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message, capabilities: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name?.trim()) return NextResponse.json({ ok: false, error: "이름을 입력하세요." }, { status: 400 });
    if (!CATS.includes(b.category)) return NextResponse.json({ ok: false, error: "카테고리가 올바르지 않습니다." }, { status: 400 });
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("capabilities").insert({
      category: b.category,
      name: b.name.trim(),
      sort_order: b.sort_order ?? 0,
      is_active: b.is_active ?? true,
    }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ ok: true, capability: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const b = await req.json();
    if (!b.id) return NextResponse.json({ ok: false, error: "id 없음" }, { status: 400 });
    const supabase = createAdminClient();
    const patch: Record<string, any> = {};
    for (const k of ["category", "name", "sort_order", "is_active"]) {
      if (b[k] !== undefined) patch[k] = k === "name" ? String(b[k]).trim() : b[k];
    }
    const { error } = await supabase.from("capabilities").update(patch).eq("id", b.id);
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
    const { error } = await supabase.from("capabilities").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}