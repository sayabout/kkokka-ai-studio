import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type PolicySection = { h?: string; body: string[] };

export default function PolicyPage({
  title, subtitle, updated, sections,
}: {
  title: string;
  subtitle: string;
  updated?: string;
  sections?: PolicySection[];
}) {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[60px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">Policy</div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-tight tracking-[-0.04em]">{title}</h1>
          <p className="mt-4 max-w-[600px] text-[15px] leading-[1.7] text-gray [word-break:keep-all]">{subtitle}</p>
          {updated && <p className="mt-3 font-mono text-[12px] text-gray-dark">최종 업데이트 · {updated}</p>}
        </div>
      </section>

      <section className="px-8 py-[70px]">
        <div className="mx-auto max-w-[820px]">
          {sections ? (
            <div className="space-y-8">
              {sections.map((s, i) => (
                <div key={i}>
                  {s.h && <h2 className="mb-3 text-[18px] font-bold text-offwhite">{s.h}</h2>}
                  {s.body.map((p, j) => (
                    <p key={j} className="mb-3 text-[14px] leading-[1.9] text-gray [word-break:keep-all]">{p}</p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.11] bg-white/[0.03] p-8">
              <p className="text-[15px] leading-[1.9] text-gray">준비 중입니다.</p>
            </div>
          )}

          <div className="mt-10 rounded-xl border border-[rgba(143,183,255,0.28)] bg-[rgba(143,183,255,0.05)] p-4 text-[13px] leading-[1.7] text-gray [word-break:keep-all]">
            ※ 본 문서는 표준 양식 기반의 <span className="text-offwhite">임시 문안</span>입니다. 실제 사업자 정보와 세부 조항은 관리자 페이지에서 최종 검토·수정 후 확정됩니다.
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
