"use client";

import { useEffect, useRef, useState } from "react";

/*
  히어로 영상 배경 컴포넌트
  - videoSrc 가 있으면 <video> 재생, 없으면 애니메이션 fallback 표시
  - 나중에 관리자(site_settings)에서 desktop_video_url / poster_url 을 받아
    props 로 넘기면 코드 수정 없이 배경이 바뀝니다.
  - 영상 로딩 전/실패 시 poster 또는 fallback 이 보여 레이아웃이 깨지지 않습니다.
*/

export default function HeroVideo({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.55,
}: {
  videoSrc?: string;
  posterSrc?: string;
  overlayOpacity?: number;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setFailed(false);
  }, [videoSrc]);

  const showVideo = Boolean(videoSrc) && !failed;

  return (
    <>
      {/* fallback 애니메이션 배경 (영상 없거나 실패 시) */}
      {!showVideo && (
        <div className="kk-stage">
          <div className="kk-grid" />
          <div className="kk-sweep" />
        </div>
      )}

      {/* 영상 배경 */}
      {showVideo && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      )}

      {/* 어두운 오버레이 (텍스트 가독성) */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(90deg, rgba(5,5,5,0.9), rgba(5,5,5,0.6) 42%, rgba(5,5,5,0.28)), rgba(5,5,5,${overlayOpacity})`,
        }}
      />

      {/* 뷰파인더 시그니처 */}
      <div className="pointer-events-none absolute inset-x-8 inset-y-[96px] z-[3] md:inset-x-8 md:bottom-[116px] md:top-24">
        <Timecode />
        <div className="absolute right-0 top-0 flex -translate-y-[26px] items-center gap-[7px] font-mono text-[11px] tracking-[0.12em] text-[rgba(143,183,255,0.85)]">
          <span className="kk-dot" /> REC · AI DIRECTING
        </div>
        <div className="kk-vf-corner tl" />
        <div className="kk-vf-corner tr" />
        <div className="kk-vf-corner bl" />
        <div className="kk-vf-corner br" />
        <div className="kk-vf-cross" />
      </div>
    </>
  );
}

function Timecode() {
  const [tc, setTc] = useState("TC 00:00:07:12");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let f = 180;
    const p = (n: number) => String(n).padStart(2, "0");
    const id = setInterval(() => {
      f++;
      const t = Math.floor(f / 24);
      const ff = f % 24;
      const s = t % 60;
      const m = Math.floor(t / 60) % 60;
      const h = Math.floor(t / 3600);
      setTc(`TC ${p(h)}:${p(m)}:${p(s)}:${p(ff)}`);
    }, 42);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute left-0 top-0 -translate-y-[26px] font-mono text-[11px] tracking-[0.1em] text-[rgba(244,241,234,0.6)]">
      {tc}
    </div>
  );
}
