import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-5 border-t border-white/[0.11] px-7 pb-11 pt-[70px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.11] pb-11 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 font-display text-[22px] font-bold tracking-[-0.02em]">
              KKOKKA<span className="text-ice">.AI</span> STUDIO
            </div>
            <p className="max-w-[300px] text-[14px] leading-relaxed text-gray [word-break:keep-all]">
              AI Directing Studio by SAYABOUT. 브랜드의 장면을 디렉팅하는 AI 영상 스튜디오.
            </p>
          </div>

          <FootCol title="Site" links={[["Works", "/works"], ["Process", "/process"], ["About", "/about"], ["Contact", "/contact"]]} />

          <div>
            <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ice">Services</h5>
            {["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual"].map((s) => (
              <p key={s} className="py-[5px] text-[14px] leading-relaxed text-gray">{s}</p>
            ))}
          </div>

          <div>
            <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ice">Inquiry</h5>
            <p className="py-[5px] text-[14px] text-gray">Seoul · KR</p>
            <Link href="/contact" className="block py-[5px] text-[14px] text-gray hover:text-offwhite">제작 문의하기</Link>
            <p className="mt-2 py-[5px] text-[14px] text-gray">Available 2026</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-5 pt-7 font-mono text-[12px] text-gray-dark">
          <div className="max-w-[620px] leading-[1.9] [word-break:keep-all]">
            <div className="text-gray">KKOKKA.AI STUDIO by 주식회사 세이어바웃</div>
            <div>상호: 주식회사 세이어바웃 · 대표: 이재연 · 사업자등록번호: 335-88-02111</div>
            <div>주소: 서울특별시 구로구 디지털로26길 43, 알동 1506호 (구로동, 대륭포스트8차)</div>
            <div>전화: 1577-5384 · 팩스: 070-8666-7010 · 이메일: sayabout.corp@gmail.com</div>
            <div className="mt-1.5">© 2026 KKOKKA.AI STUDIO · SAYABOUT. All rights reserved.</div>
          </div>
          <div className="flex flex-wrap gap-[18px]">
            <Link href="/privacy" className="hover:text-offwhite">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-offwhite">이용약관</Link>
            <Link href="/no-email" className="hover:text-offwhite">이메일무단수집거부</Link>
            <Link href="/ai-policy" className="hover:text-offwhite">AI 콘텐츠 제작 정책</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ice">{title}</h5>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="block py-[5px] text-[14px] leading-relaxed text-gray hover:text-offwhite">
          {label}
        </Link>
      ))}
    </div>
  );
}
