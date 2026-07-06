import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 0;

const PROCESS = [
  { n: "01", en: "Brief", kr: "브리프", dur: "~ 1 week", desc: "목적, 타깃, 활용 채널을 확인합니다." },
  { n: "02", en: "Concept", kr: "컨셉·콘티", dur: "~ 1–2 weeks", desc: "브랜드에 맞는 영상 방향을 설계합니다." },
  { n: "03", en: "Directing", kr: "본 제작", dur: "~ 2–4 weeks", desc: "AI 결과물을 장면별로 생성·조율합니다." },
  { n: "04", en: "Delivery", kr: "납품", dur: "~ 1 week", desc: "플랫폼별 형식으로 납품합니다." },
];

async function getSiteSettings() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    return data;
  } catch {
    return null;
  }
}

async function getFeaturedWorks() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("works").select("*")
      .eq("is_public", true).eq("is_featured", true)
      .order("sort_order", { ascending: true }).order("id", { ascending: false }).limit(6);
    return data || [];
  } catch {
    return [];
  }
}

// 유튜브 썸네일 추출
function homeThumb(w: any): string | null {
  if (w.thumbnail_url) return w.thumbnail_url;
  const u = w.video_url || "";
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}

// Why AI 섹션 영상 썸네일 카드
function getYtId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function WhyAiThumb({ url, large }: { url: string; large?: boolean }) {
  const ytId = getYtId(url);
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  return (
    <Link href={url} target="_blank" rel="noreferrer"
      className={`group relative block overflow-hidden rounded-xl border border-white/[0.11] bg-char2 transition hover:border-[rgba(143,183,255,0.34)] ${large ? "aspect-video" : "aspect-video"}`}>
      {thumb && <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition group-hover:opacity-100" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
          <div className="text-white text-[20px]">▶</div>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const settings = await getSiteSettings();
  const featuredWorks = await getFeaturedWorks();
  const videoSrc = settings?.desktop_video_url || "/videos/hero.mp4";
  const posterSrc = settings?.poster_url || undefined;
  const overlayOpacity = settings?.overlay_opacity ?? 0.55;

  return (
    <>
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
        <HeroVideo videoSrc={videoSrc} posterSrc={posterSrc} overlayOpacity={overlayOpacity} />
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

      {/* ===== WHY AI ===== */}
      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* 왼쪽 텍스트 */}
            <div>
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
            {/* 오른쪽 영상 자리 */}
            {settings?.whyai_video_main && (
              <div className="flex flex-col gap-3">
                <WhyAiThumb url={settings.whyai_video_main} large />
                {(settings?.whyai_video_sub1 || settings?.whyai_video_sub2) && (
                  <div className="grid grid-cols-2 gap-3">
                    {settings?.whyai_video_sub1 && <WhyAiThumb url={settings.whyai_video_sub1} />}
                    {settings?.whyai_video_sub2 && <WhyAiThumb url={settings.whyai_video_sub2} />}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== AI-DIRECTED WORKS ===== */}
      <section className="px-8 py-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex items-end justify-between gap-10 max-md:block">
            <div>
              <SectionTag n="02" label="Works" />
              <h2 className="font-display text-[clamp(32px,4.4vw,58px)] font-bold tracking-[-0.05em]">AI-Directed Works</h2>
              <p className="mt-3 max-w-[540px] text-[14px] leading-[1.75] text-gray [word-break:keep-all]">
                AI로 생성한 결과물이 아니라, 디렉팅으로 완성한 작업들.
              </p>
            </div>
            <Link href="/works" className="flex-none max-md:mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/[0.11] px-[26px] text-[14px] font-semibold text-offwhite transition hover:border-[rgba(143,183,255,0.34)] hover:text-ice">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredWorks.length > 0 ? (
              featuredWorks.map((w: any) => {
                const thumb = homeThumb(w);
                const portrait = ["AI Short-form Ads", "AI Pre-visualization"].includes(w.category);
                return (
                  <Link key={w.id} href={`/works/${w.id}`}
                    className={`group relative block overflow-hidden rounded-2xl border border-white/[0.11] bg-char2 transition hover:-translate-y-1 hover:border-[rgba(143,183,255,0.34)] ${portrait ? "aspect-[9/14]" : "aspect-[4/3]"}`}>
                    {thumb ? (
                      <img src={thumb} alt={w.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,183,255,0.22),transparent_40%),linear-gradient(145deg,#0b0b0d,#111113)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/85" />
                    <div className="absolute left-3.5 top-3.5 h-[22px] w-[22px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.5)]" />
                    <div className="absolute inset-x-4 top-4 font-mono text-[11px] tracking-[0.08em] text-[rgba(244,241,234,0.7)]">{w.year || ""} {w.video_url ? "· ▶" : ""}</div>
                    <div className="absolute inset-x-[18px] bottom-[18px]">
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ice">{w.category}</div>
                      <h4 className="text-[18px] font-semibold leading-tight tracking-[-0.02em] text-offwhite">{w.title}</h4>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-white/[0.14] py-20 text-center text-[14px] text-gray-dark">
                포트폴리오가 곧 공개됩니다.
              </div>
            )}
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
