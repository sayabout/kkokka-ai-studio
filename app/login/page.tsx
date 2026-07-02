"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const signIn = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/my`,
      },
    });
    if (error) alert("로그인 시작 중 오류: " + error.message);
  };

  return (
    <>
      <Header />
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-8">
        <div className="kk-stage"><div className="kk-grid" /><div className="kk-sweep" /></div>
        <div className="relative z-[4] w-full max-w-[420px] rounded-[24px] border border-white/[0.11] bg-black/60 p-10 backdrop-blur-xl">
          <div className="mb-2 text-center font-display text-[22px] font-bold tracking-[-0.02em]">
            KKOKKA<span className="text-ice">.AI</span> STUDIO
          </div>
          <p className="mb-8 text-center text-[14px] text-gray">로그인하고 내 문의·답변·견적을 확인하세요.</p>

          <button type="button" onClick={signIn}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/[0.11] bg-white/[0.04] px-6 py-3.5 text-[14px] font-semibold text-offwhite transition hover:border-[rgba(143,183,255,0.34)] hover:bg-white/[0.08]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-offwhite text-[12px] font-bold text-black">G</span>
            Google로 계속하기
          </button>
          <p className="mt-4 text-center font-mono text-[11px] text-gray-dark">문의 작성은 로그인 없이 가능합니다. 답변 확인 시에만 로그인이 필요합니다.</p>

          <div className="mt-8 border-t border-white/[0.11] pt-6 text-center">
            <Link href="/" className="font-mono text-[12px] text-ice">← 홈으로 돌아가기</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
