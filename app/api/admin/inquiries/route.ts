import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/*
  관리자용 문의 조회 API (서버 전용)
  - service_role 키로 전체 문의를 읽음 (RLS 우회 = 관리자 권한)
  - service_role 키는 서버에서만 쓰이고 브라우저에 노출되지 않음
  - 환경변수 필요: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
  - ⚠ 지금은 임시로 인증 없이 열려 있음. Google 로그인(관리자 확인) 붙일 때 보호 추가 예정.
*/

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, rows: [], reason: "Supabase 서버 키가 설정되지 않았습니다." }, { status: 200 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, rows: [], reason: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true, rows: data ?? [] });
}
