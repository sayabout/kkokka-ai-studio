import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import WorkCard, { Work } from "@/components/WorkCard";

const PREVIEW_WORKS: Work[] = [
  { code: "PC-01", year: "2026", category: "Public Campaign", title: "공공 캠페인 프리뷰", tint: "t-blue", live: true },
  { code: "BF-01", year: "2026", category: "Brand Film", title: "AI 브랜드 무드 필름", tint: "t-steel" },
  { code: "SA-01", year: "2026", category: "Short-form Ads", title: "숏폼 광고 변주 시스템", tint: "t-warm" },
];

const PROCESS = [
  { n: "01", en: "Brief", kr: "브리프", dur: "~ 1 week", desc: "목적, 타깃, 활용 채널을 확인합니다." },
  { n: "02", en: "Concept", kr: "컨셉·콘티", dur: "~ 1–2 weeks", desc: "브랜드에 맞는 영상 방향을 설계합니다." },
  { n: "03", en: "Directing", kr: "본 제작", dur: "~ 2–4 weeks", desc: "AI 결과물을 장면별로 생성·조율합니다." },
  { n: "04", en: "Delivery", kr: "납품", dur: "~ 1 week", desc: "플랫폼별 형식으로 납품합니다." },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
        <HeroVideo videoSrc="/videos/hero.mp4" />
        <div className="relative z-[4] mx-auto w-full max-w-[1240px] px-8">
          <div className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-ice before:h-px before:w-[34px] before:bg-ice before:opacity-70">
            AI Directing Studio by SAYABOUT
          </div>
          <h1 className="max-w-[920px] text-[clamp(38px,6.5vw,80px)] font-bold leading-[1.06] tracking-[-0.04em] text-offwhite [word-break:keep-all]">
            누구나 AI로 영상을 만듭니다.<br />
            문제는 누가 <span className="text-ice [text-shadow:0_0_40px_rgba(143,183,255,0.3)]">디렉팅</span>하느냐입니다.
          </h1>
          <p className="mt-8 max-w-[600px] text-[clamp(15px,1.5vw,20px)] leading-[1.75] text-[rgba(244,241,234,0.74)] [word-break:keep-all]">
            도구는 평준화됐습니다. 남는 건 판단입니다. KKOKKA.AI STUDIO는 공공·기업이 실제로 쓸 수 있는 영상을 기획·연출·편집·검수·납품까지 디렉팅합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-offwhite px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_14px_42px_rgba(244,241,234,0.14)]">
              제작 문의하기
            </Link>
            <Link href="/works" className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/[0.11] px-[26px] text-[14px] font-semibold text-offwhite transition hover:-translate-y-0.5 hover:border-[rgba(143,183,255,0.34)] hover:text-ice">
              포트폴리오 보기 →
            </Link>
          </div>
        </div>

        {/* 타임라인 스크러버 */}
        <div className="absolute inset-x-0 bottom-0 z-[4] border-t border-white/[0.11] bg-black/50 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-gray">
            <span>KKOKKA.AI</span>
            <div className="kk-track h-[3px] flex-1"><i /></div>
            <div className="hidden gap-4 text-[rgba(244,241,234,0.5)] md:flex">
              <b className="font-medium text-ice">Brief</b><span>·</span>Concept<span>·</span>Directing<span>·</span>Delivery
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY AI (꼬까씬 연결) ===== */}
      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <SectionTag n="01" label="Why AI Video" />
          <h2 className="max-w-[780px] text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.2] tracking-[-0.03em] [word-break:keep-all]">
            이제 AI 영상은 누구나 만들 수 있습니다.<br />
            하지만 <span className="text-ice">좋은 영상</span>은 다릅니다.
          </h2>
          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.8] text-[rgba(244,241,234,0.72)] [word-break:keep-all]">
            같은 도구로도 결과는 완전히 달라집니다. 그 차이를 만드는 것이 <span className="text-offwhite">디렉팅</span>입니다.
            무엇을 담을지 기획하고, 장면을 연출하고, 다듬고, 검수하고, 실제로 쓸 수 있게 완성하는 과정. 좋은 AI 영상에는 좋은 디렉팅 회사가 필요합니다.
          </p>
          <div className="my-8 h-px w-full bg-white/[0.1]" />
          <p className="max-w-[620px] text-[17px] font-medium leading-[1.7] text-offwhite [word-break:keep-all]">
            영상 제작사 <span className="text-ice">꼬까씬</span>이 쌓아온 연출력, 그 위에 AI를 얹었습니다.
          </p>
          <p className="mt-3 max-w-[620px] text-[15px] leading-[1.8] text-gray [word-break:keep-all]">
            KKOKKA.AI STUDIO는 그렇게 이어진, 한발 앞서가는 AI 영상 디렉팅 스튜디오입니다.
          </p>
        </div>
      </section>

      {/* ===== WORKS PREVIEW ===== */}
      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex items-end justify-between gap-10 max-md:block">
            <div>
              <SectionTag n="02" label="Selected Works" />
              <h2 className="font-display text-[clamp(32px,4.4vw,58px)] font-bold tracking-[-0.05em]">WORKS</h2>
            </div>
            <p className="max-w-[420px] text-[15px] leading-[1.75] text-gray max-md:mt-4 [word-break:keep-all]">
              공공 캠페인, 브랜드 필름, 숏폼 광고, 제품 비주얼까지. 목적에 맞는 AI 영상 콘텐츠를 카테고리별로 설계합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {PREVIEW_WORKS.map((w) => <WorkCard key={w.code} work={w} />)}
          </div>
          <div className="mt-8">
            <Link href="/works" className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/[0.11] px-[26px] text-[14px] font-semibold text-offwhite transition hover:border-[rgba(143,183,255,0.34)] hover:text-ice">
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex items-end justify-between gap-10 max-md:block">
            <div>
              <SectionTag n="03" label="Process" />
              <h2 className="font-display text-[clamp(32px,4.4vw,58px)] font-bold tracking-[-0.05em]">HOW WE WORK.</h2>
            </div>
            <p className="max-w-[420px] text-[15px] leading-[1.75] text-gray max-md:mt-4 [word-break:keep-all]">
              브리프부터 납품까지 하나의 프로세스로 운영합니다. 모든 단계에 클라이언트 검수와 피드백이 들어갑니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.n} className="flex flex-col rounded-2xl border border-white/[0.11] bg-white/[0.045] p-7 transition hover:border-[rgba(143,183,255,0.34)] hover:bg-[rgba(143,183,255,0.05)]">
                <div className="font-mono text-[12px] text-ice">{p.n}</div>
                <h3 className="mt-5 font-display text-[22px] font-semibold">{p.en}</h3>
                <div className="mb-3.5 text-[13px] text-gray">{p.kr}</div>
                <div className="mb-4 w-max rounded-full border border-[rgba(143,183,255,0.34)] px-2.5 py-1 font-mono text-[11px] text-ice">{p.dur}</div>
                <p className="text-[13.5px] leading-[1.7] text-gray [word-break:keep-all]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FIELDS MARQUEE ===== */}
      <section className="py-[92px]">
        <div className="mx-auto max-w-[1240px] px-8">
          <SectionTag n="04" label="Fields" />
          <h2 className="mb-8 text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">
            기업·기관이 신뢰할 수 있는<br />제작 프로세스.
          </h2>
        </div>
        <div className="kk-marquee border-y border-white/[0.11] py-[26px]">
          <div className="kk-marquee-in font-display text-[22px] tracking-[-0.02em] text-gray-dark">
            {["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"].concat(
              ["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"]
            ).map((f, i) => <span key={i} className="whitespace-nowrap">{f}</span>)}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-8 py-[92px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-8 rounded-[30px] border border-white/[0.11] p-[clamp(32px,5vw,64px)] max-md:block"
            style={{ background: "radial-gradient(circle at 82% 20%, rgba(143,183,255,0.16), transparent 30%), linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))" }}>
            <div>
              <SectionTag n="05" label="Project Inquiry" />
              <h2 className="max-w-[520px] text-[clamp(28px,3.6vw,46px)] font-bold leading-tight tracking-[-0.03em]">
                AI 영상 제작이<br />처음이어도 괜찮습니다.
              </h2>
              <p className="mt-4 max-w-[480px] leading-[1.7] text-gray [word-break:keep-all]">
                목적에 맞는 형식부터 함께 설계합니다. 문의 후 Google 로그인으로 답변과 견적을 확인할 수 있습니다.
              </p>
            </div>
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_14px_42px_rgba(143,183,255,0.24)] max-md:mt-6">
              제작 문의 시작하기 →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-[22px] flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
      <span className="h-[7px] w-[7px] border border-ice" /> {n} <span className="text-gray">／ {label}</span>
    </div>
  );
}
