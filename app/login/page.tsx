import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <>
      <Header />
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-8">
        <div className="kk-stage"><div className="kk-grid" /><div className="kk-sweep" /></div>
        <div className="relative z-[4] w-full max-w-[420px] rounded-[24px] border border-white/[0.11] bg-black/60 p-10 backdrop-blur-xl">
          <div className="mb-2 text-center font-display text-[22px] font-bold tracking-[-0.02em]">
            KKOKKA<span className="text-ice">.AI</span> STUDIO
          </div>
          <p className="mb-8 text-center text-[14px] text-gray">로그인하고 내 문의·견적·프로젝트를 확인하세요.</p>

          <button type="button" disabled
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/[0.11] bg-white/[0.03] px-6 py-3.5 text-[14px] font-semibold text-offwhite opacity-60">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-offwhite text-[12px] font-bold text-black">G</span>
            Google로 계속하기
          </button>
          <p className="mt-4 text-center font-mono text-[11px] text-gray-dark">※ Google 로그인은 2단계(Supabase 연결)에서 활성화됩니다.</p>

          <div className="mt-8 border-t border-white/[0.11] pt-6 text-center">
            <Link href="/" className="font-mono text-[12px] text-ice">← 홈으로 돌아가기</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
