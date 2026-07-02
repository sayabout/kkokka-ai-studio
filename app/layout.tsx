import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KKOKKA.AI STUDIO — AI Directing Studio by SAYABOUT",
  description:
    "누구나 AI로 영상을 만듭니다. 문제는 누가 디렉팅하느냐입니다. KKOKKA.AI STUDIO는 공공·기업이 실제로 쓸 수 있는 영상을 기획·연출·편집·검수·납품까지 디렉팅합니다.",
  metadataBase: new URL("https://kkokka.ai"),
  openGraph: {
    title: "KKOKKA.AI STUDIO",
    description: "AI 영상 디렉팅 스튜디오 · by SAYABOUT",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${space.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
