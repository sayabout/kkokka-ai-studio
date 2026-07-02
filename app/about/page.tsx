import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PRINCIPLES = [
  ["01", "AI Native", "최신 AI 영상·이미지 모델을 일상적으로 다룹니다. 새 도구가 나오면 빠르게 워크플로우에 통합합니다."],
  ["02", "Brand Obsessed", "기술 자랑이 아닌 브랜드의 메시지에서 모든 결정이 시작됩니다."],
  ["03", "Speed × Craft", "AI의 속도로 작업하되, 결과물의 결은 영화 수준으로 다듬습니다."],
];
const TOOLS = [
  ["01", "Video Generation", "시네마틱 영상 생성 · 브랜드 필름 · 캐릭터 일관성 · 고품질 모션."],
  ["02", "Image / Concept", "실사 합성 · 룩북 · 무드보드 · 스타일링 · 커스텀 워크플로우."],
  ["03", "Post / Sound", "합성 · 모션그래픽 · 시네마틱 컬러 · 나레이션 · 오리지널 트랙."],
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[70px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">03 / About</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">ABOUT</h1>
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">
            서울 기반의 AI 영상 디렉팅 스튜디오. KKOKKA.AI STUDIO는 SAYABOUT이 운영하며, 영상 제작사 꼬까씬이 쌓아온 연출력 위에 AI를 얹어, 브랜드와 기관이 실제로 사용할 수 있는 영상 콘텐츠를 기획·연출·편집·검수·납품까지 완성합니다.
          </p>
        </div>
      </section>

      {/* Statement */}
      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-[26px] border border-white/[0.11] p-[clamp(30px,5vw,60px)]"
            style={{ background: "radial-gradient(circle at 12% 18%, rgba(143,183,255,0.1), transparent 30%), rgba(255,255,255,0.028)" }}>
            <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice"><span className="h-[7px] w-[7px] border border-ice" /> Statement</div>
            <h2 className="max-w-[820px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">AI는 누구나 쓸 수 있습니다.<br />차이는 디렉팅에서 만들어집니다.</h2>
            <p className="mt-6 max-w-[660px] text-[17px] leading-[1.75] text-[rgba(244,241,234,0.72)] [word-break:keep-all]">이끌어내고, 선택하고, 다듬는 손길이 결과를 만듭니다. 우리는 기술을 앞세우지 않습니다. 브랜드의 메시지에서 시작해, 장면을 설계하고, 실제로 사용할 수 있는 콘텐츠로 완성합니다. 공공기관을 포함한 다양한 기관·기업과의 협업 경험을 바탕으로, 검수와 납품 기준을 아는 팀이 AI 영상을 만듭니다.</p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <Trio tag="Principles" heading="우리가 일하는 원칙." items={PRINCIPLES} />

      {/* Tools */}
      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice"><span className="h-[7px] w-[7px] border border-ice" /> Tools</div>
          <h2 className="mb-8 text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">최신 AI 모델을<br />일상적으로 다룹니다.</h2>
          <div className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl border border-white/[0.11] md:grid-cols-3">
            {TOOLS.map(([n, t, d]) => (
              <div key={n} className="bg-char p-[34px]">
                <div className="mb-10 font-mono text-[12px] text-ice">{n}</div>
                <h3 className="mb-3.5 font-display text-[21px]">{t}</h3>
                <p className="text-[14px] leading-[1.7] text-gray [word-break:keep-all]">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[760px] text-[14px] leading-[1.7] text-gray [word-break:keep-all]">도구는 빠르게 바뀝니다. 우리는 새 모델을 테스트하고, 매 프로젝트에 가장 적합한 도구 조합을 큐레이션합니다.</p>
        </div>
      </section>

      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-8 rounded-[30px] border border-white/[0.11] p-[clamp(32px,5vw,64px)] max-md:block"
            style={{ background: "radial-gradient(circle at 82% 20%, rgba(143,183,255,0.16), transparent 30%), linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))" }}>
            <div>
              <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice"><span className="h-[7px] w-[7px] border border-ice" /> Contact</div>
              <h2 className="max-w-[520px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">함께할 프로젝트가<br />있으신가요?</h2>
              <p className="mt-4 max-w-[480px] leading-[1.7] text-gray [word-break:keep-all]">상상만 가져와 주세요. 장면은 우리가 디렉팅합니다.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 max-md:mt-6">제작 문의하기 →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Trio({ tag, heading, items }: { tag: string; heading: string; items: string[][] }) {
  return (
    <section className="px-8 py-[92px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice"><span className="h-[7px] w-[7px] border border-ice" /> {tag}</div>
        <h2 className="mb-8 text-[clamp(28px,3.6vw,46px)] font-bold tracking-[-0.03em]">{heading}</h2>
        <div className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl border border-white/[0.11] md:grid-cols-3">
          {items.map(([n, t, d]) => (
            <div key={n} className="bg-char p-[34px]">
              <div className="mb-10 font-mono text-[12px] text-ice">{n}</div>
              <h3 className="mb-3.5 font-display text-[21px]">{t}</h3>
              <p className="text-[14px] leading-[1.7] text-gray [word-break:keep-all]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
