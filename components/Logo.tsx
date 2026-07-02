import Link from "next/link";

/*
  로고 컴포넌트
  - 나중에 꼬까씬 로고 이미지로 바꿀 때: public/images/logo.svg (또는 .png) 파일을 넣고
    아래 USE_IMAGE 를 true 로 바꾸면 이미지 로고로 자동 교체됩니다. (코드 구조는 그대로)
  - size: "sm"(헤더용, 산뜻한 크기) | "lg"(대표용, 큰 크기)
*/

const USE_IMAGE = false; // 꼬까씬 로고 이미지 준비되면 true 로

export default function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const big = size === "lg";

  if (USE_IMAGE) {
    return (
      <Link href="/" aria-label="KKOKKA.AI STUDIO 홈">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt="KKOKKA.AI STUDIO"
          style={{ height: big ? 40 : 24, width: "auto" }}
        />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="KKOKKA.AI STUDIO 홈" className="inline-flex items-baseline gap-[9px] font-display">
      <span
        className="font-bold tracking-[-0.03em] text-offwhite"
        style={{ fontSize: big ? 44 : 21 }}
      >
        KKOKKA<span className="text-ice">.AI</span>
      </span>
      <span
        className="font-medium tracking-[0.22em]"
        style={{ fontSize: big ? 18 : 12, color: big ? "#F4F1EA" : "#A7A7A7" }}
      >
        STUDIO
      </span>
    </Link>
  );
}
