"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV = [
  { n: "01", label: "Works", href: "/works" },
  { n: "02", label: "Process", href: "/process" },
  { n: "03", label: "About", href: "/about" },
  { n: "04", label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-white/[0.07] bg-black/[0.62] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-7 py-4">
        <Logo size="sm" />

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-baseline gap-[7px] font-mono text-[15px] transition-colors ${
                  active ? "text-offwhite" : "text-gray hover:text-offwhite"
                }`}
              >
                <span className="text-[11px] text-ice opacity-85">{item.n}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3.5">
          <span className="hidden items-center gap-2 rounded-full border border-white/[0.11] px-3 py-2 font-mono text-[12.5px] tracking-[0.08em] text-gray sm:flex">
            SEARCH <kbd className="rounded border border-white/[0.11] px-[5px] text-[11px]">⌘K</kbd>
          </span>
          <Link href="/login" className="hidden font-mono text-[12.5px] text-gray transition hover:text-offwhite sm:inline">
            로그인
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full border border-[rgba(143,183,255,0.34)] px-[15px] py-[9px] font-mono text-[12.5px] tracking-[0.06em] text-offwhite transition hover:shadow-[0_0_26px_rgba(143,183,255,0.18)]"
          >
            <span className="kk-dot" />
            <span className="hidden sm:inline">Available 2026</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
