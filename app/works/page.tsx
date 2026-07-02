import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard, { Work } from "@/components/WorkCard";

type Channel = {
  id: string;
  title: string;
  sub: string;
  desc: string;
  clients: string[];
  works: Work[];
};

const CHANNELS: Channel[] = [
  {
    id: "CH 01", title: "Public Campaign", sub: "공공 캠페인 · Institutional · Policy",
    desc: "공공기관과 지자체의 메시지를 신뢰감 있게 전달하는 캠페인 영상. 검수 기준을 고려한 안전한 제작.",
    clients: ["Public Sector", "Institution", "Campaign"],
    works: [
      { code: "PC-01", year: "2026", category: "Public Campaign", title: "공공 캠페인 프리뷰", tint: "t-blue", live: true },
      { code: "PC-02", year: "2026", category: "Public Campaign", title: "정책 안내 영상 슬롯", tint: "t-slate" },
      { code: "PC-03", year: "2026", category: "Public Campaign", title: "기관 브랜드 캠페인 슬롯", tint: "t-ink" },
    ],
  },
  {
    id: "CH 02", title: "Brand Film", sub: "Season Campaign · Brand Anthem",
    desc: "한 편의 영화처럼 만드는 브랜드 필름. 시즌 캠페인부터 브랜드의 결정적 한 컷까지.",
    clients: ["Brand", "Season", "Anthem"],
    works: [
      { code: "BF-01", year: "2026", category: "Brand Film", title: "AI 브랜드 무드 필름", tint: "t-steel", live: true },
      { code: "BF-02", year: "2026", category: "Brand Film", title: "시즌 캠페인 필름 슬롯", tint: "t-frost" },
      { code: "BF-03", year: "2025", category: "Brand Film", title: "브랜드 앤썸 슬롯", tint: "t-blue" },
      { code: "BF-04", year: "2025", category: "Brand Film", title: "제품 런칭 필름 슬롯", tint: "t-ink" },
    ],
  },
  {
    id: "CH 03", title: "Short-form Ads", sub: "Reels · Shorts · 9:16",
    desc: "릴스·쇼츠·틱톡을 위한 빠른 호흡의 숏폼. 명확한 후킹과 임팩트, 다양한 컷다운 변주.",
    clients: ["Reels", "Shorts", "Vertical 9:16"],
    works: [
      { code: "SA-01", year: "2026", category: "Short-form", title: "숏폼 변주 시스템", tint: "t-warm" },
      { code: "SA-02", year: "2026", category: "Short-form", title: "SNS 캠페인 컷다운 슬롯", tint: "t-slate" },
      { code: "SA-03", year: "2026", category: "Short-form", title: "제품 숏폼 슬롯", tint: "t-blue" },
      { code: "SA-04", year: "2025", category: "Short-form", title: "이벤트 티저 슬롯", tint: "t-frost" },
    ],
  },
  {
    id: "CH 04", title: "Product Visual", sub: "Product · Commerce · Key Visual",
    desc: "촬영 없이 완성하는 제품 비주얼과 커머스 컷. 다양한 무드와 배경을 유연하게 실험.",
    clients: ["Product", "Commerce", "Key Visual"],
    works: [
      { code: "PV-01", year: "2026", category: "Product Visual", title: "제품 키비주얼 슬롯", tint: "t-ink" },
      { code: "PV-02", year: "2026", category: "Product Visual", title: "커머스 무드컷 슬롯", tint: "t-steel" },
      { code: "PV-03", year: "2025", category: "Product Visual", title: "패키지 비주얼 슬롯", tint: "t-blue" },
    ],
  },
  {
    id: "CH 05", title: "Pre-visual", sub: "Storyboard · Concept · Colti",
    desc: "본 제작 전 방향을 확인하는 프리비주얼 콘티. 장면·컷·톤을 빠르게 시각화합니다.",
    clients: ["Storyboard", "Concept"],
    works: [
      { code: "PR-01", year: "2026", category: "Pre-visual", title: "캠페인 콘티 슬롯", tint: "t-slate" },
      { code: "PR-02", year: "2026", category: "Pre-visual", title: "스타일 프레임 슬롯", tint: "t-frost" },
    ],
  },
  {
    id: "CH 06", title: "AI World-building", sub: "Character · World · IP",
    desc: "브랜드 세계관과 캐릭터를 AI로 설계. 일관성 있는 IP 비주얼과 확장 가능한 세계관.",
    clients: ["Character", "World", "IP"],
    works: [
      { code: "WB-01", year: "2026", category: "World-building", title: "브랜드 캐릭터 슬롯", tint: "t-ink" },
      { code: "WB-02", year: "2026", category: "World-building", title: "세계관 비주얼 슬롯", tint: "t-blue" },
    ],
  },
];

export default function WorksPage() {
  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[70px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">02 / Selected Works</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">WORKS</h1>
          <p className="mt-6 max-w-[600px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">
            AI 브랜드 필름부터 숏폼 광고, 공공 캠페인, 제품 비주얼, 프리비주얼 콘티, AI 월드빌딩까지. 목적에 맞는 AI 영상 콘텐츠를 카테고리별로 설계합니다. 아래는 카테고리 구조 프리뷰이며, 실제 프로젝트가 쌓이면 순차적으로 교체됩니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-8">
        {CHANNELS.map((ch) => (
          <div key={ch.id} className="border-t border-white/[0.11] py-16">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-8">
              <div>
                <div className="mb-4 font-mono text-[12px] tracking-[0.16em] text-ice">{ch.id}</div>
                <h3 className="font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.03em]">{ch.title}</h3>
                <div className="mt-2 font-mono text-[13px] tracking-[0.06em] text-gray">{ch.sub}</div>
              </div>
              <p className="max-w-[360px] text-[14px] leading-[1.7] text-gray [word-break:keep-all]">{ch.desc}</p>
              <div className="font-mono text-[12px] text-gray">{ch.works.length} slots</div>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {ch.clients.map((c) => (
                <span key={c} className="rounded-full border border-white/[0.11] px-[11px] py-[5px] font-mono text-[11px] tracking-[0.04em] text-gray-dark">{c}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              {ch.works.map((w) => <WorkCard key={w.code} work={w} />)}
            </div>
          </div>
        ))}
      </div>

      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-8 rounded-[30px] border border-white/[0.11] p-[clamp(32px,5vw,64px)] max-md:block"
            style={{ background: "radial-gradient(circle at 82% 20%, rgba(143,183,255,0.16), transparent 30%), linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))" }}>
            <div>
              <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
                <span className="h-[7px] w-[7px] border border-ice" /> Project Inquiry
              </div>
              <h2 className="max-w-[520px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">이 자리를 채울<br />첫 프로젝트를 찾습니다.</h2>
              <p className="mt-4 max-w-[480px] leading-[1.7] text-gray [word-break:keep-all]">목적에 맞는 형식부터 함께 설계합니다. 제작 문의를 남겨주세요.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 max-md:mt-6">제작 문의하기 →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
