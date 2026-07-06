"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 8개 카테고리 정의 (영문 타이틀 / 영문 설명 / 한글)
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
    <div className="space-y-[110px]">
      {SECTIONS.map((sec, i) => {
        const items = rows.filter((w) => w.category === sec.key && (w.home_size === "big" || w.home_size === "small"));
        return (
          <CategorySection key={sec.key} sec={sec} num={String(i + 1).padStart(2, "0")} items={items} />
        );
      })}
    </div>
  );
}

function CategorySection({ sec, num, items }: { sec: typeof SECTIONS[0]; num: string; items: Work[] }) {
  const slug = encodeURIComponent(sec.key);

  return (
    <div>
      {/* 섹션 헤더 */}
      <div className="mb-8">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">{num} / {sec.title}</div>
        <Link href={`/works?cat=${slug}`} className="group inline-block">
          <h3 className="font-display text-[clamp(30px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.04em] transition group-hover:text-ice">
            {sec.title}
          </h3>
        </Link>
        <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-[rgba(244,241,234,0.72)]">{sec.en}</p>
        <p className="mt-1 text-[13px] text-gray [word-break:keep-all]">{sec.ko}</p>
      </div>

      {/* 영상 카드 */}
      {sec.portrait ? (
        <PortraitRow items={items} />
      ) : (
        <LandscapeMagazine items={items} />
      )}

      {/* View all */}
      <div className="mt-7">
        <Link href={`/works?cat=${slug}`} className="font-mono text-[13px] text-gray transition hover:text-ice">
          View all {sec.title} →
        </Link>
      </div>
    </div>
  );
}

/* 가로형: 큰 카드(big) 1개 + 작은 카드(small)들 (매거진) */
function LandscapeMagazine({ items }: { items: Work[] }) {
  const bigWork = items.find((w) => w.home_size === "big") || null;
  const smallWorks = items.filter((w) => w.home_size === "small");
  // 작은 카드 자리는 최소 2개 (플레이스홀더로 채움)
  const smallSlots = Math.max(smallWorks.length, 2);
  const smalls = Array.from({ length: Math.min(smallSlots, 4) }, (_, i) => smallWorks[i] || null);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <WorkCardBig work={bigWork} />
      <div className="grid grid-cols-2 gap-4">
        {smalls.map((w, i) => <WorkCardSmall key={i} work={w} />)}
      </div>
    </div>
  );
}

/* 세로형: 한 줄에 4개 */
function PortraitRow({ items }: { items: Work[] }) {
  const slots = Math.max(items.length, 4);
  const cards = Array.from({ length: Math.min(slots, 4) }, (_, i) => items[i] || null);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((w, i) => <WorkCardPortrait key={i} work={w} />)}
    </div>
  );
}

/* ===== 카드 컴포넌트들 ===== */
function CardShell({ work, className, children }: { work: Work | null; className: string; children?: React.ReactNode }) {
  const thumb = work ? getThumb(work) : null;
  const inner = (
    <>
      {thumb ? (
        <img src={thumb} alt={work?.title || ""} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,183,255,0.18),transparent_42%),linear-gradient(145deg,#0b0b0d,#111113)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/8 to-black/85" />
      {!work && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.28)]">Coming Soon</div>
        </div>
      )}
      <div className="absolute left-3.5 top-3.5 h-[20px] w-[20px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.5)]" />
      {work && (
        <>
          <div className="absolute inset-x-4 top-4 font-mono text-[11px] tracking-[0.08em] text-[rgba(244,241,234,0.7)]">
            {work.year || ""} {work.video_url ? "· ▶" : ""}
          </div>
          {children}
        </>
      )}
    </>
  );
  const cls = `group relative block overflow-hidden rounded-2xl border border-white/[0.11] bg-char2 transition hover:-translate-y-1 hover:border-[rgba(143,183,255,0.34)] ${className}`;
  return work ? <Link href={`/works/${work.id}`} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>;
}

function WorkCardBig({ work }: { work: Work | null }) {
  return (
    <CardShell work={work} className="aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
      <div className="absolute inset-x-[22px] bottom-[22px]">
        {work?.client_type && <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ice">{work.client_type}</div>}
        <h4 className="text-[24px] font-bold leading-tight tracking-[-0.03em] text-offwhite">{work?.title}</h4>
      </div>
    </CardShell>
  );
}

function WorkCardSmall({ work }: { work: Work | null }) {
  return (
    <CardShell work={work} className="aspect-[4/3]">
      <div className="absolute inset-x-[16px] bottom-[16px]">
        <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-offwhite">{work?.title}</h4>
      </div>
    </CardShell>
  );
}

function WorkCardPortrait({ work }: { work: Work | null }) {
  return (
    <CardShell work={work} className="aspect-[9/14]">
      <div className="absolute inset-x-[16px] bottom-[16px]">
        <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-offwhite">{work?.title}</h4>
      </div>
    </CardShell>
  );
}
