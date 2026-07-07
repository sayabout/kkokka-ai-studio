"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 8개 카테고리 정의
const SECTIONS = [
  { key: "AI Brand Film", title: "AI Brand Film", en: "Cinematic brand films — from season campaigns to the one defining cut.", ko: "영화처럼 완성하는 브랜드 필름", portrait: false },
  { key: "AI Public Campaign", title: "AI Public Campaign", en: "Public messages, delivered with trust and precision.", ko: "신뢰감 있게 전하는 공공·기관 캠페인", portrait: false },
  { key: "AI Short-form Ads", title: "AI Short-form Ads", en: "Fast, sharp vertical content for Reels, Shorts & TikTok.", ko: "릴스·쇼츠·틱톡을 위한 숏폼", portrait: true },
  { key: "AI Product Visual", title: "AI Product Visual", en: "Product films without a shoot — texture, package, mood.", ko: "촬영 없이 완성하는 제품 비주얼", portrait: false },
  { key: "AI Avatar & Explainer", title: "AI Avatar & Explainer", en: "Clear explainer & presenter videos, no camera needed.", ko: "사람 없이 전달하는 설명·아바타 영상", portrait: false },
  { key: "AI Animation & Character", title: "AI Animation & Character", en: "Bringing brand characters and worlds to life.", ko: "움직이는 브랜드 캐릭터와 세계관", portrait: false },
  { key: "AI Pre-visualization", title: "AI Pre-visualization", en: "Concepts and storyboards, visualized before the shoot.", ko: "촬영 전 미리 그리는 콘셉트·콘티", portrait: true },
  { key: "AI Content Package", title: "AI Content Package", en: "One campaign, every format — cut down and ready.", ko: "하나의 캠페인, 여러 버전으로", portrait: false },
];

// 가로형 매거진 패턴 (12칸 그리드 기준, 각 슬롯: 시작열/너비/높이비율/역할)
// role: "big"=큰카드, "small"=작은카드
type Slot = { col: string; row?: string; aspect: string; role: "big" | "small" };
const LAND_PATTERNS: Slot[][] = [
  // 패턴 A: 왼쪽 큰거 + 오른쪽 작은거 2개 흩어짐
  [
    { col: "col-span-7", aspect: "aspect-[16/10]", role: "big" },
    { col: "col-span-4 col-start-9", aspect: "aspect-[4/3]", role: "small" },
    { col: "col-span-4 col-start-9", aspect: "aspect-[4/3]", role: "small" },
  ],
  // 패턴 B: 오른쪽 큰거 + 왼쪽 작은거들 (반대)
  [
    { col: "col-span-4 col-start-1", aspect: "aspect-[4/3]", role: "small" },
    { col: "col-span-4 col-start-1", aspect: "aspect-[4/3]", role: "small" },
    { col: "col-span-6 col-start-7 row-span-2 row-start-1", aspect: "", role: "big" },
  ],
  // 패턴 C: 큰거 가로 와이드 위 + 작은거 아래 흩어짐
  [
    { col: "col-span-8 col-start-3", aspect: "aspect-[16/9]", role: "big" },
    { col: "col-span-3 col-start-1", aspect: "aspect-[3/4]", role: "small" },
    { col: "col-span-4 col-start-5", aspect: "aspect-[4/3]", role: "small" },
  ],
  // 패턴 D: 가운데 큰거 + 양옆 작은거
  [
    { col: "col-span-3 col-start-1", aspect: "aspect-[3/4]", role: "small" },
    { col: "col-span-5 col-start-4", aspect: "aspect-[16/11]", role: "big" },
    { col: "col-span-3 col-start-10", aspect: "aspect-[3/4]", role: "small" },
  ],
];

type Work = {
  id: number; title: string; category: string;
  year: string | null; video_url: string | null; thumbnail_url: string | null;
  client_type: string | null; home_size?: string;
};

function getThumb(w: Work): string | null {
  if (w.thumbnail_url) return w.thumbnail_url;
  const u = w.video_url || "";
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}

export default function HomeWorks() {
  const [rows, setRows] = useState<Work[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/works");
        const j = await res.json();
        if (j.ok) setRows(j.works);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-[120px]">
      {SECTIONS.map((sec, i) => {
        const items = rows.filter((w) => w.category === sec.key && (w.home_size === "big" || w.home_size === "small"));
        return (
          <CategorySection key={sec.key} sec={sec} num={String(i + 1).padStart(2, "0")} items={items} patternIdx={i} />
        );
      })}
    </div>
  );
}

function CategorySection({ sec, num, items, patternIdx }: { sec: typeof SECTIONS[0]; num: string; items: Work[]; patternIdx: number }) {
  const slug = encodeURIComponent(sec.key);
  return (
    <div>
      <div className="mb-9">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">{num} / {sec.title}</div>
        <Link href={`/works?cat=${slug}`} className="group inline-block">
          <h3 className="font-display text-[clamp(30px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.04em] transition group-hover:text-ice">{sec.title}</h3>
        </Link>
        <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-[rgba(244,241,234,0.72)]">{sec.en}</p>
        <p className="mt-1 text-[13px] text-gray [word-break:keep-all]">{sec.ko}</p>
      </div>

      {sec.portrait ? (
        <PortraitFree items={items} patternIdx={patternIdx} />
      ) : (
        <LandscapeFree items={items} patternIdx={patternIdx} />
      )}

      <div className="mt-8">
        <Link href={`/works?cat=${slug}`} className="font-mono text-[13px] text-gray transition hover:text-ice">
          View all {sec.title} →
        </Link>
      </div>
    </div>
  );
}

/* 가로형: 패턴별 자유 배치 (12칸 그리드) */
function LandscapeFree({ items, patternIdx }: { items: Work[]; patternIdx: number }) {
  const pattern = LAND_PATTERNS[patternIdx % LAND_PATTERNS.length];
  const bigItems = items.filter((w) => w.home_size === "big");
  const smallItems = items.filter((w) => w.home_size === "small");
  let bi = 0, si = 0;

  return (
    <div className="grid auto-rows-min grid-cols-12 gap-4">
      {pattern.map((slot, idx) => {
        const work = slot.role === "big" ? (bigItems[bi++] || null) : (smallItems[si++] || null);
        // 빈 슬롯은 여백 (렌더 안 함)
        if (!work) return <div key={idx} className={`${slot.col} ${slot.row || ""}`} />;
        return (
          <div key={idx} className={`${slot.col} ${slot.row || ""}`}>
            <WorkCard work={work} aspect={slot.aspect} big={slot.role === "big"} />
          </div>
        );
      })}
    </div>
  );
}

/* 세로형: 계단식 엇갈림 배치 */
function PortraitFree({ items, patternIdx }: { items: Work[]; patternIdx: number }) {
  const list = items.slice(0, 4);
  // 4개 자리, 위아래 엇갈리게 (계단식)
  const offsets = ["mt-0", "mt-10", "mt-4", "mt-14"];
  const slots = Array.from({ length: 4 }, (_, i) => list[i] || null);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {slots.map((work, i) => (
        <div key={i} className={offsets[i]}>
          {work ? <WorkCard work={work} aspect="aspect-[9/14]" portrait /> : <div className="aspect-[9/14]" />}
        </div>
      ))}
    </div>
  );
}

/* 카드 */
function WorkCard({ work, aspect, big, portrait }: { work: Work; aspect: string; big?: boolean; portrait?: boolean }) {
  const thumb = getThumb(work);
  return (
    <Link href={`/works/${work.id}`}
      className={`group relative block h-full overflow-hidden rounded-2xl border border-white/[0.11] bg-char2 transition hover:-translate-y-1 hover:border-[rgba(143,183,255,0.34)] ${aspect}`}>
      {thumb ? (
        <img src={thumb} alt={work.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,183,255,0.18),transparent_42%),linear-gradient(145deg,#0b0b0d,#111113)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/8 to-black/85" />
      <div className="absolute left-3.5 top-3.5 h-[20px] w-[20px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.5)]" />
      <div className="absolute inset-x-4 top-4 font-mono text-[11px] tracking-[0.08em] text-[rgba(244,241,234,0.7)]">
        {work.year || ""} {work.video_url ? "· ▶" : ""}
      </div>
      <div className={`absolute inset-x-[18px] bottom-[18px]`}>
        {work.client_type && big && <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ice">{work.client_type}</div>}
        <h4 className={`font-semibold leading-tight tracking-[-0.02em] text-offwhite ${big ? "text-[24px] font-bold" : "text-[15px]"}`}>{work.title}</h4>
      </div>
    </Link>
  );
}
