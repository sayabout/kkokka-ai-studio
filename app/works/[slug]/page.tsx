import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard, { Work } from "@/components/WorkCard";

const MORE: Work[] = [
  { code: "BF-01", year: "2026", category: "Brand Film", title: "AI 브랜드 무드 필름", tint: "t-steel" },
  { code: "SA-01", year: "2026", category: "Short-form", title: "숏폼 변주 시스템", tint: "t-warm" },
  { code: "PV-01", year: "2026", category: "Product Visual", title: "제품 키비주얼 슬롯", tint: "t-ink" },
  { code: "WB-01", year: "2026", category: "World-building", title: "브랜드 캐릭터 슬롯", tint: "t-frost" },
];

export default function WorkDetail({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />

      <section className="relative px-8 pb-[60px] pt-[150px]">
        <div className="mx-auto max-w-[1240px]">
          <Link href="/works" className="font-mono text-[12px] tracking-[0.08em] text-ice">← BACK TO WORKS</Link>
          <div className="mt-6 font-mono text-[12px] tracking-[0.16em] text-ice">PC-01 · PUBLIC CAMPAIGN · 2026</div>
          <h1 className="mt-4 max-w-[900px] text-[clamp(38px,5.5vw,72px)] font-bold leading-[1.02] tracking-[-0.04em]">공공 캠페인<br />프리뷰</h1>

          <div className="relative mt-8 aspect-video overflow-hidden rounded-[22px] border border-white/[0.11]">
            <div className="absolute inset-0 t-blue" />
            <div className="kk-fx-grid absolute inset-0 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            <div className="absolute left-[18px] top-[18px] h-[30px] w-[30px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.6)]" />
            <div className="absolute bottom-[18px] right-[18px] h-[30px] w-[30px] border-b-[1.5px] border-r-[1.5px] border-[rgba(143,183,255,0.6)]" />
            <div className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(143,183,255,0.34)] bg-black/45 backdrop-blur-md">
              <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-offwhite" />
            </div>
          </div>

          <div className="mt-[22px] flex flex-wrap gap-7 font-mono text-[12px] tracking-[0.06em] text-gray">
            <span>CATEGORY · <b className="font-medium text-ice">Public Campaign</b></span>
            <span>YEAR · <b className="font-medium text-ice">2026</b></span>
            <span>ASPECT · <b className="font-medium text-ice">16:9 / 9:16</b></span>
            <span>STATUS · <b className="font-medium text-ice">Preview</b></span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-8">
        <div className="mt-[70px] grid grid-cols-1 gap-14 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-5 font-display text-[clamp(26px,3vw,38px)] font-bold">Overview</h2>
            <p className="mb-5 text-[16px] leading-[1.85] text-[rgba(244,241,234,0.78)] [word-break:keep-all]">
              이 페이지는 포트폴리오 상세 페이지의 구조 템플릿입니다. 실제 프로젝트가 확정되면 이 자리에 영상, 프로젝트 배경, 제작 의도, 접근 방식이 들어갑니다.
            </p>
            <p className="mb-5 text-[16px] leading-[1.85] text-[rgba(244,241,234,0.78)] [word-break:keep-all]">
              KKOKKA.AI STUDIO는 공공 캠페인 영상을 제작할 때 메시지의 정확성과 검수 기준을 최우선으로 둡니다. 화려한 연출보다 전달되는 메시지를 우선하며, 기관이 안심하고 사용할 수 있는 결과물을 완성합니다.
            </p>
            <p className="text-[13px] text-gray-dark [word-break:keep-all]">※ 공공 프로젝트는 계약상 기관명을 공개하지 않으며, 분야 라벨로만 표기합니다.</p>
          </div>
          <aside className="border-t border-white/[0.11] pt-4 md:border-l md:border-t-0 md:pl-8">
            {[["Client Type", "공공기관 / 기관"], ["Services", "기획 · 연출 · 편집 · 검수 · 납품"], ["Deliverables", "Master · Multi-Aspect Cuts"], ["Timeline", "약 4–6주"], ["Studio", "KKOKKA.AI STUDIO"]].map(([k, v], i, arr) => (
              <div key={k} className={`py-4 ${i < arr.length - 1 ? "border-b border-white/[0.11]" : ""}`}>
                <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-gray">{k}</div>
                <div className="text-[15px]">{v}</div>
              </div>
            ))}
            <Link href="/contact" className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5">비슷한 프로젝트 문의 →</Link>
          </aside>
        </div>
      </section>

      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12">
            <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
              <span className="h-[7px] w-[7px] border border-ice" /> Next
            </div>
            <h2 className="font-display text-[clamp(32px,4.4vw,58px)] font-bold tracking-[-0.05em]">MORE WORKS</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {MORE.map((w) => <WorkCard key={w.code} work={w} />)}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
