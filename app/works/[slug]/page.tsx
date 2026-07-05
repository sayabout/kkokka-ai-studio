"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Work = {
  id: number; title: string; category: string; client_type: string | null; year: string | null;
  video_url: string | null; thumbnail_url: string | null; description: string;
};

// 유튜브/비메오 임베드 URL 변환
function getEmbed(url: string | null): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default function WorkDetail({ params }: { params: { slug: string } }) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/works");
        const j = await res.json();
        if (j.ok) {
          const found = j.works.find((w: Work) => String(w.id) === params.slug);
          if (found) setWork(found);
          else setNotFound(true);
        }
      } catch { setNotFound(true); }
      setLoading(false);
    })();
  }, [params.slug]);

  const embed = work ? getEmbed(work.video_url) : null;

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[1000px] px-8 pb-[80px] pt-[150px]">
        <Link href="/works" className="font-mono text-[12px] text-ice">← Works</Link>

        {loading ? (
          <div className="py-24 text-center text-[14px] text-gray-dark">불러오는 중...</div>
        ) : notFound || !work ? (
          <div className="py-24 text-center text-[14px] text-gray-dark">작업을 찾을 수 없습니다.</div>
        ) : (
          <>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ice">{work.category}</div>
            <h1 className="mt-3 text-[clamp(30px,4.5vw,54px)] font-bold leading-tight tracking-[-0.03em] [word-break:keep-all]">{work.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-gray">
              {work.year && <span>YEAR · {work.year}</span>}
              {work.client_type && <span>CLIENT · {work.client_type}</span>}
            </div>

            {/* 영상 */}
            {embed ? (
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-white/[0.11] bg-black">
                <iframe src={embed} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : work.video_url ? (
              <a href={work.video_url} target="_blank" rel="noreferrer" className="mt-8 block rounded-2xl border border-[rgba(143,183,255,0.34)] bg-[rgba(143,183,255,0.06)] p-6 text-center text-ice">
                ▶ 영상 보러가기 (외부 링크)
              </a>
            ) : (
              <div className="mt-8 aspect-video rounded-2xl border border-white/[0.11] bg-[radial-gradient(circle_at_60%_35%,rgba(143,183,255,0.16),transparent_40%),#0b0b0d]" />
            )}

            {work.description && (
              <p className="mt-8 whitespace-pre-wrap text-[16px] leading-[1.85] text-gray [word-break:keep-all]">{work.description}</p>
            )}

            <div className="mt-12 border-t border-white/[0.11] pt-8">
              <Link href="/contact" className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ice px-7 text-[14px] font-semibold text-black">
                이런 영상 제작 문의하기
              </Link>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
