import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const featured = new URL(req.url).searchParams.get("featured");
    const supabase = createAdminClient();
    let q = supabase.from("works").select("*").eq("is_public", true);
    if (featured === "1") q = q.eq("is_featured", true);
    const { data, error } = await q.order("sort_order", { ascending: true }).order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ ok: true, works: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message, works: [] }, { status: 500 });
  }
}