import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolicyPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[60px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">Policy</div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-tight tracking-[-0.04em]">{title}</h1>
          <p className="mt-4 max-w-[600px] text-[15px] leading-[1.7] text-gray [word-break:keep-all]">{subtitle}</p>
        </div>
      </section>

      <section className="px-8 py-[80px]">
        <div className="mx-auto max-w-[820px]">
          <div className="rounded-2xl border border-white/[0.11] bg-white/[0.03] p-8">
            <p className="text-[15px] leading-[1.9] text-gray [word-break:keep-all]">
              이 페이지의 내용은 <span className="text-ice">관리자 페이지 → 정책 관리</span>에서 등록·수정할 수 있도록 준비되어 있습니다.
              현재는 자리만 잡아둔 상태이며, 실제 약관·정책 문구는 이후 단계에서 관리자 화면을 통해 채워집니다.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/" className="font-mono text-[12px] text-ice">← 홈으로 돌아가기</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
