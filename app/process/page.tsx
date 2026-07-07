import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 큰 흐름 — 4단계 (홈과 동일)
const STEPS = [
  { n: "01", en: "Brief", kr: "브리프", dur: "~ 1 week", desc: "클라이언트 미팅으로 브랜드의 톤과 메시지를 정의하고, 레퍼런스를 모으고, 결과물의 방향·일정·예산을 합의합니다.", deliv: ["Project Brief", "Reference Deck", "Timeline & Budget"] },
  { n: "02", en: "Concept", kr: "컨셉·콘티", dur: "~ 1–2 weeks", desc: "AI 무드보드와 스타일 프레임으로 비주얼 방향을 합의합니다. 스토리보드·컬러 팔레트·톤이 이 단계에서 확정됩니다.", deliv: ["Mood Board", "Style Frames", "Storyboard"] },
  { n: "03", en: "Directing", kr: "본 제작", dur: "~ 2–4 weeks", desc: "AI 생성·실사 합성·3D·후반 색보정·사운드까지 본 제작이 진행됩니다. V01 → V02 → V03 라운드로 완성도를 올립니다.", deliv: ["V01 Cut", "V02 Cut", "Final Master"] },
  { n: "04", en: "Delivery", kr: "납품", dur: "~ 1 week", desc: "최종 마스터, 다양한 비율 컷, 원본 소스, 라이선스 정리까지 한 번에 납품합니다.", deliv: ["Master Files", "Multi-Aspect Cuts", "Source Backup"] },
];

// 상세 프로세스 — 8단계 (AI × HI Direction System)
const DETAIL = [
  { n: "01", en: "Brief", kr: "브리프", desc: "목적·타깃·핵심 메시지를 정리하고 방향을 합의합니다.", deliv: ["Project Brief", "Reference Deck"] },
  { n: "02", en: "AI Direction", kr: "AI 디렉션", desc: "장면·무드·프롬프트 방향을 설계합니다.", deliv: ["Scene Plan", "Prompt Design"] },
  { n: "03", en: "Generation", kr: "제너레이션", desc: "이미지·영상·보이스를 생성합니다.", deliv: ["Key Visual", "Video", "Voice"] },
  { n: "04", en: "Selection", kr: "셀렉션", desc: "좋은 컷을 선별하고 오류 컷을 제거합니다.", deliv: ["Best Takes", "Error Filtering"] },
  { n: "05", en: "Editing", kr: "에디팅", desc: "컷 편집·자막·음악·사운드를 입힙니다.", deliv: ["Cut Edit", "Subtitles", "Sound"] },
  { n: "06", en: "Correction", kr: "커렉션", desc: "색감·움직임·표현 오류를 보정합니다.", deliv: ["Color Grade", "Motion Fix"] },
  { n: "07", en: "Review", kr: "리뷰", desc: "저작권·초상권·기관 사용 적합성을 검수합니다.", deliv: ["Rights Check", "Compliance"], hi: true },
  { n: "08", en: "Delivery", kr: "딜리버리", desc: "최종본·숏폼·자막본·썸네일을 납품합니다.", deliv: ["Master", "Short-form", "Thumbnails"] },
];

const PRINCIPLES = [
  ["Tool보다", "Direction", "버튼보다 어떤 장면을 만들지 판단하는 일이 먼저입니다."],
  ["Speed보다", "Quality", "빠른 제작 안에서도 브랜드 완성도를 지킵니다."],
  ["AI보다", "Brand", "기술보다 브랜드 메시지를 먼저 봅니다."],
  ["Image보다", "Message", "예쁜 장면보다 전달되는 메시지를 우선합니다."],
  ["Output보다", "Usability", "실제로 사용할 수 있는 납품물을 만듭니다."],
];

const FAQ = [
  ["Q01", "제작 기간은 얼마나 걸리나요?", "프로젝트 규모에 따라 다르지만, 일반적으로 브리프부터 납품까지 약 4–6주를 기준으로 합니다. 숏폼이나 단일 컷은 더 짧고, 시즌 캠페인·브랜드 필름은 더 길어질 수 있습니다."],
  ["Q02", "어떤 형식의 영상을 만들 수 있나요?", "공공 캠페인, 브랜드 필름, 숏폼 광고, 제품 비주얼, 프리비주얼 콘티, AI 캐릭터·세계관까지. 목적에 맞는 형식을 함께 설계합니다."],
  ["Q03", "수정은 몇 회까지 가능한가요?", "V01 → V02 → 파이널로 이어지는 라운드 안에서 검수와 피드백을 반영합니다. 세부 조건은 견적 단계에서 합의합니다."],
  ["Q04", "저작권과 사용 권리는 어떻게 되나요?", "납품 시 사용 범위와 라이선스를 함께 정리해 전달합니다. AI 콘텐츠 제작 정책에 따라 안전하게 사용할 수 있는 결과물을 제공합니다."],
  ["Q05", "AI 영상 제작이 처음인데 괜찮을까요?", "괜찮습니다. 목적에 맞는 형식부터 함께 설계합니다. 미팅 한 번이면 방향을 잡는 데 가장 빠릅니다."],
];

export default function ProcessPage() {
  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[70px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">02 / Process</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">HOW WE<br />WORK.</h1>
          <p className="mt-6 max-w-[600px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">브리프부터 납품까지, 하나의 프로세스로 운영합니다. 모든 단계마다 클라이언트 검수와 피드백이 들어갑니다.</p>
        </div>
      </section>

      {/* ===== OVERVIEW — 큰 흐름 4단계 ===== */}
      <section className="px-8 pb-[60px] pt-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-9 flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
            <span className="h-[7px] w-[7px] border border-ice" /> Overview · 큰 흐름
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col rounded-2xl border border-white/[0.11] bg-white/[0.045] p-7 transition hover:border-[rgba(143,183,255,0.34)] hover:bg-[rgba(143,183,255,0.05)]">
                <div className="font-mono text-[12px] text-ice">{s.n}</div>
                <h3 className="mt-5 font-display text-[22px] font-semibold">{s.en}</h3>
                <div className="mb-3.5 text-[13px] text-gray">{s.kr}</div>
                <div className="mb-4 w-max rounded-full border border-[rgba(143,183,255,0.34)] px-2.5 py-1 font-mono text-[11px] text-ice">{s.dur}</div>
                <p className="mb-4 text-[13.5px] leading-[1.7] text-gray [word-break:keep-all]">{s.desc}</p>
                <div className="mt-auto border-t border-white/[0.11] pt-3.5">
                  {s.deliv.map((d) => <span key={d} className="block py-1 font-mono text-[11px] text-gray before:text-ice before:content-['—_']">{d}</span>)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[900px] text-[14px] leading-[1.8] text-gray [word-break:keep-all]">
            ※ 후반 색보정·사운드 디자인·고난도 모션그래픽 등 마무리 작업은 AI 기반 워크플로우로 진행할지, 전문 후반 스튜디오 협업으로 갈지에 따라 비용이 달라집니다. 결과물의 결과 예산을 함께 보고 견적 단계에서 합의합니다.
          </p>
        </div>
      </section>

      {/* ===== IN DETAIL — 상세 프로세스 8단계 ===== */}
      <section className="px-8 pb-[100px] pt-[40px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-3 flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
            <span className="h-[7px] w-[7px] border border-ice" /> In Detail · 상세 프로세스
          </div>
          <h2 className="mb-2.5 text-[clamp(24px,3vw,38px)] font-bold tracking-[-0.03em]">AI <span className="text-ice">×</span> HI Direction System</h2>
          <p className="mb-9 max-w-[680px] text-[15px] leading-[1.75] text-gray [word-break:keep-all]">각 단계를 열어보면, 실제로는 여덟 단계로 진행됩니다. AI가 만들고, AI가 검토하고, 사람이 방향과 기준을 더해 완성합니다.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {DETAIL.map((s) => (
              <div
                key={s.n}
                className={
                  "flex flex-col rounded-2xl border p-6 transition " +
                  (s.hi
                    ? "border-[rgba(143,183,255,0.5)] bg-[rgba(143,183,255,0.07)] hover:bg-[rgba(143,183,255,0.1)]"
                    : "border-white/[0.11] bg-white/[0.045] hover:border-[rgba(143,183,255,0.34)] hover:bg-[rgba(143,183,255,0.05)]")
                }
              >
                <div className="font-mono text-[12px] text-ice">{s.n}</div>
                <h3 className="mt-4 font-display text-[19px] font-semibold">{s.en}</h3>
                <div className="mb-3 text-[12.5px] text-gray">{s.kr}</div>
                <p className="mb-4 text-[13px] leading-[1.65] text-gray [word-break:keep-all]">{s.desc}</p>
                <div className="mt-auto border-t border-white/[0.11] pt-3">
                  {s.deliv.map((d) => <span key={d} className="block py-0.5 font-mono text-[10.5px] text-gray before:text-ice before:content-['—_']">{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-[26px] border border-white/[0.11] p-[clamp(30px,5vw,60px)]"
            style={{ background: "radial-gradient(circle at 12% 18%, rgba(143,183,255,0.1), transparent 30%), rgba(255,255,255,0.028)" }}>
            <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
              <span className="h-[7px] w-[7px] border border-ice" /> Philosophy
            </div>
            <h2 className="max-w-[760px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">우리는 AI 영상을 생성하지 않습니다.<br />브랜드의 장면을 디렉팅합니다.</h2>
            <p className="mt-6 max-w-[660px] text-[17px] leading-[1.75] text-[rgba(244,241,234,0.72)] [word-break:keep-all]">누구나 AI 툴을 사용할 수 있습니다. 하지만 모두가 브랜드에 맞는 영상을 만들 수 있는 것은 아닙니다. KKOKKA.AI STUDIO는 메시지, 장면, 톤, 편집, 검수, 납품 기준까지 고려해 실제로 사용할 수 있는 콘텐츠를 완성합니다.</p>
            <div className="mt-11 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl border border-white/[0.11] md:grid-cols-5">
              {PRINCIPLES.map(([a, b, c]) => (
                <div key={b} className="bg-char p-[22px]">
                  <strong className="mb-2.5 block text-[15px] tracking-[-0.01em]">{a} <span className="text-ice">{b}</span></strong>
                  <span className="text-[12.5px] leading-[1.6] text-gray [word-break:keep-all]">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
            <span className="h-[7px] w-[7px] border border-ice" /> FAQ
          </div>
          <h2 className="mb-9 text-[clamp(28px,3.6vw,46px)] font-bold tracking-[-0.03em]">자주 묻는 질문.</h2>
          <div className="border-t border-white/[0.11]">
            {FAQ.map(([q, question, answer], i) => (
              <details key={q} className="group border-b border-white/[0.11]" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[26px] text-[18px] tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  <span><span className="mr-3.5 font-mono text-[12px] text-ice">{q}</span>{question}</span>
                  <span className="text-[22px] text-ice transition group-open:rotate-45">+</span>
                </summary>
                <div className="max-w-[820px] pb-[26px] text-[15px] leading-[1.8] text-gray [word-break:keep-all]">{answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-8 rounded-[30px] border border-white/[0.11] p-[clamp(32px,5vw,64px)] max-md:block"
            style={{ background: "radial-gradient(circle at 82% 20%, rgba(143,183,255,0.16), transparent 30%), linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))" }}>
            <div>
              <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice"><span className="h-[7px] w-[7px] border border-ice" /> Get Started</div>
              <h2 className="max-w-[520px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">프로세스가 더 궁금하시다면,<br />미팅 한 번이 가장 빠릅니다.</h2>
              <p className="mt-4 max-w-[480px] leading-[1.7] text-gray [word-break:keep-all]">목적에 맞는 형식과 일정, 예산을 함께 설계합니다.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 max-md:mt-6">미팅 요청하기 →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
