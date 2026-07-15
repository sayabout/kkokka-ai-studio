"use client";

import { useEffect, useState } from "react";

/*
  관리자 레이아웃 (라이트 톤 · aiee 참조 구조)
  - 상단바: 로고 + 바로가기 링크 + 즐겨찾기 칩 + 실시간 시계 + 종료
  - 좌측바: 그룹별 드롭다운(접기/펼치기) 메뉴
  - 지금은 화면(레이아웃)만. 실제 DB 연결·로그인은 2단계에서.
  - 각 메뉴 클릭 시 currentPage 가 바뀌고, page.tsx 가 해당 화면을 렌더합니다.
*/

export type MenuItem = { id: string; label: string; badge?: string; badgeWarn?: boolean };
export type MenuGroup = { group: string; items: MenuItem[] };

export const MENU: MenuGroup[] = [
  { group: "운영", items: [
    { id: "dashboard", label: "대시보드" },
    { id: "inquiries", label: "고객 문의 · 답변", badge: "N" },
    { id: "quotes", label: "견적 관리" },
    { id: "projects", label: "프로젝트 관리" },
  ]},
  { group: "콘텐츠", items: [
    { id: "works", label: "포트폴리오 관리" },
    { id: "home", label: "홈 화면 · 영상 관리" },
    { id: "capabilities", label: "홈 엔진·도구" },
    { id: "pages", label: "페이지/문구 관리" },
    { id: "media", label: "미디어 라이브러리" },
  ]},
  { group: "회원 · 정산", items: [
    { id: "members", label: "회원 관리" },
    { id: "payments", label: "결제 현황" },
  ]},
  { group: "기록 · 설정", items: [
    { id: "memo", label: "관리자 메모" },
    { id: "footer", label: "푸터 · 약관 관리" },
    { id: "settings", label: "설정" },
    { id: "logs", label: "활동 로그" },
  ]},
];

const LABELS: Record<string, string> = Object.fromEntries(
  MENU.flatMap((g) => g.items.map((it) => [it.id, it.label]))
);

const SHORTCUTS = [
  { label: "홈페이지", url: "https://kkokka.ai" },
  { label: "GitHub", url: "https://github.com/sayabout/kkokka-ai-studio" },
];

export default function AdminShell({
  current,
  onNav,
  children,
}: {
  current: string;
  onNav: (id: string) => void;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [favs, setFavs] = useState<string[]>(["inquiries", "home"]);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const tick = () => {
      const n = new Date();
      const p = (x: number) => String(x).padStart(2, "0");
      setClock(`${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} (${days[n.getDay()]}) ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleGroup = (g: string) => setCollapsed((c) => ({ ...c, [g]: !c[g] }));
  const addFav = () => setFavs((f) => (f.includes(current) ? f : [...f, current]));
  const removeFav = (id: string) => setFavs((f) => f.filter((x) => x !== id));

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-[#222]">
      {/* 상단바 */}
      <div className="sticky top-0 z-50 flex h-[58px] items-center gap-4 border-b-2 border-[#8FB7FF] bg-gradient-to-b from-[#0A0A0C] to-[#050505] px-[22px]">
        <div className="flex cursor-pointer items-baseline gap-2 font-display text-white" onClick={() => onNav("dashboard")}>
          <b className="text-[16px] font-semibold opacity-85">KKOKKA.AI</b>
          <span className="rounded bg-[#8FB7FF] px-[7px] py-[2px] text-[11px] font-bold tracking-wider text-[#050505]">ADMIN</span>
        </div>

        {/* 바로가기 링크 */}
        <div className="ml-2 hidden gap-1.5 lg:flex">
          {SHORTCUTS.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
              className="rounded-md border border-[rgba(143,183,255,0.5)] bg-[rgba(143,183,255,0.15)] px-2 py-[5px] text-[10px] font-semibold text-white hover:bg-[rgba(143,183,255,0.28)]">
              {s.label}
            </a>
          ))}
        </div>

        {/* 즐겨찾기 칩 */}
        <div className="hidden flex-wrap items-center gap-1.5 md:flex">
          {favs.map((id) => (
            <span key={id} className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/20 bg-white/[0.13] px-2 py-1 text-[10px] text-white hover:bg-white/20" onClick={() => onNav(id)}>
              {LABELS[id] || id}
              <span className="opacity-60" onClick={(e) => { e.stopPropagation(); removeFav(id); }}>✕</span>
            </span>
          ))}
          <button onClick={addFav} className="rounded-md border border-white/20 bg-white/[0.13] px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/20">★ 즐겨찾기 추가</button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right font-mono text-[12px] text-[#cfd8ff] sm:block">{clock}</div>
          <span className="hidden font-mono text-[11px] text-white/60 md:inline">sayabout.corp@gmail.com</span>
          <button className="rounded-md border border-white/25 bg-[rgba(192,57,43,0.35)] px-3 py-1.5 text-[11px] font-semibold text-white" onClick={() => onNav("dashboard")}>종료</button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-58px)]">
        {/* 좌측바 */}
        <aside className="sticky top-[58px] h-[calc(100vh-58px)] w-[248px] flex-none overflow-y-auto border-r border-[#e6e2d6] bg-white py-3.5">
          {MENU.map((g) => (
            <div key={g.group} className="mb-1">
              <div className="flex cursor-pointer select-none items-center justify-between px-5 pb-2 pt-3.5 text-[14px] font-extrabold tracking-wide text-[#0A0A0C]" onClick={() => toggleGroup(g.group)}>
                {g.group}
                <span className={`text-[11px] text-[#8FB7FF] transition-transform ${collapsed[g.group] ? "-rotate-90" : ""}`}>▼</span>
              </div>
              {!collapsed[g.group] && (
                <div>
                  {g.items.map((it) => {
                    const active = it.id === current;
                    return (
                      <div key={it.id} onClick={() => onNav(it.id)}
                        className={`flex cursor-pointer items-center gap-3 border-l-[3px] px-5 py-2.5 text-[14px] ${active ? "border-[#1a3a66] bg-[#eef4ff] font-bold text-[#1a3a66]" : "border-transparent text-[#222] hover:bg-[#f6f9ff]"}`}>
                        {it.label}
                        {it.badge && <span className={`ml-auto rounded-full px-[7px] py-px text-[10px] font-extrabold text-white ${it.badgeWarn ? "bg-[#8FB7FF] text-[#0A0A0C]" : "bg-[#c0392b]"}`}>{it.badge}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* 메인 */}
        <main className="min-w-0 flex-1 px-8 py-7 pb-16">{children}</main>
      </div>
    </div>
  );
}
