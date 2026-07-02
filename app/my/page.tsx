import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function MyPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[60px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">My Page</div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-tight tracking-[-0.04em]">내 문의함</h1>
          <p className="mt-4 text-[15px] text-gray">{user.email} 님, 환영합니다.</p>
        </div>
      </section>

      <section className="px-8 py-[70px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-2xl border border-white/[0.11] bg-white/[0.03] p-8">
            <p className="text-[15px] leading-[1.8] text-gray [word-break:keep-all]">
              로그인이 완료되었습니다. 여기에 내가 남긴 <span className="text-offwhite">제작문의와 답변(스레드)</span>이 표시됩니다.
              게시판형 1:1 문의 스레드는 다음 단계에서 연결됩니다.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/contact" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-ice px-6 text-[14px] font-semibold text-black">새 문의하기</Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
