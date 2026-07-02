import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 구글 로그인 후 돌아오는 지점. 코드를 세션으로 교환하고 원래 페이지로 보냄.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/my";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  // 실패 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
