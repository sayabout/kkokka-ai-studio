"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CATS = ["전체", "Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"];
const PER = 12;

type Work = {
  id: number; title: string; category: string; client_type: string | null; year: string | null;
  video_url: string | null; thumbnail_url: string | null; description: string;
};

// 유튜브/비메오 링크에서 썸네일 추출
function getThumb(w: Work): string | null {
  if (w.thumbnail_url) return w.thumbnail_url;
  const u = w.video_url || "";
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

export default function WorksPage() {
  const [rows, setRows] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("전체");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/works");
        const j = await res.json();
        if (j.ok) setRows(j.works);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const filtered = cat === "전체" ? rows : rows.filter((w) => w.category === cat);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const curPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((curPage - 1) * PER, curPage * PER);
  const catCount = (c: string) => c === "전체" ? rows.length : rows.filter((w) => w.category === c).length;

  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[54px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">02 / Works</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">Selected Works</h1>
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">
            공공 캠페인, 브랜드 필름, 숏폼 광고, 제품 비주얼까지. 목적에 맞게 디렉팅한 AI 영상 콘텐츠입니다.
          </p>
        </div>
      </section>

      <section className="px-8 py-[60px]">
        <div className="mx-auto max-w-[1240px]">
          {/* 카테고리 필터 */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => { setCat(c); setPage(1); }}
                className={`rounded-full border px-4 py-2 text-[13px] transition ${cat === c ? "border-ice bg-ice text-black" : "border-white/[0.14] text-gray hover:text-offwhite"}`}>
                {c} <span className="opacity-60">{catCount(c)}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-24 text-center text-[14px] text-gray-dark">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.14] py-24 text-center text-[14px] text-gray-dark">
              {rows.length === 0 ? "포트폴리오가 곧 공개됩니다." : "해당 카테고리의 작업이 없습니다."}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pageRows.map((w) => {
                  const thumb = getThumb(w);
                  return (
                    <Link key={w.id} href={`/works/${w.id}`}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.11] bg-char2 transition hover:-translate-y-1 hover:border-[rgba(143,183,255,0.34)]">
                      {thumb ? (
                        <img src={thumb} alt={w.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,183,255,0.22),transparent_40%),linear-gradient(145deg,#0b0b0d,#111113)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/85" />
                      <div className="absolute left-3.5 top-3.5 h-[22px] w-[22px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.5)]" />
                      <div className="absolute inset-x-4 top-4 font-mono text-[11px] tracking-[0.08em] text-[rgba(244,241,234,0.7)]">
                        {w.year || ""} {w.video_url ? "· ▶" : ""}
                      </div>
                      <div className="absolute inset-x-[18px] bottom-[18px]">
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ice">{w.category}</div>
                        <h4 className="text-[18px] font-semibold leading-tight tracking-[-0.02em] text-offwhite">{w.title}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`h-9 min-w-9 rounded-lg border px-3 font-mono text-[13px] ${p === curPage ? "border-ice bg-ice text-black" : "border-white/[0.14] text-gray hover:text-offwhite"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
