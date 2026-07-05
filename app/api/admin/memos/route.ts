import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 목록
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("admin_memos").select("*").order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ ok: true, memos: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message, memos: [] }, { status: 500 });
  }
}

// 작성
export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();
    if (!title?.trim()) return NextResponse.json({ ok: false, error: "제목을 입력하세요." }, { status: 400 });
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("admin_memos")
      .insert({ title, body: body || "" }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ ok: true, memo: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

// 수정
export async function PATCH(req: Request) {
  try {
    const { id, title, body } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "id 없음" }, { status: 400 });
    const supabase = createAdminClient();
    const { error } = await supabase.from("admin_memos")
      .update({ title, body, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

// 삭제
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const supabase = createAdminClient();
    const { error } = await supabase.from("admin_memos").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}