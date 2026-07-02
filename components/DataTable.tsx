"use client";

import { useMemo, useState } from "react";

/*
  범용 데이터 테이블 (aiee dataTable 이식)
  - 검색(전 컬럼) + 컬럼 정렬 + 페이지 크기(50/100/200) + 페이징 + CSV 다운로드(BOM 포함)
  - 회원관리·결제현황 등 목록 화면에서 재사용
*/

export type Column<T> = {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  filename = "export",
}: {
  columns: Column<T>[];
  rows: T[];
  filename?: string;
}) {
  const [q, setQ] = useState("");
  const [size, setSize] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string | null>(null);
  const [dir, setDir] = useState(1);

  const filtered = useMemo(() => {
    let r = rows;
    if (q) {
      const s = q.toLowerCase();
      r = r.filter((row) => columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(s)));
    }
    if (sort) {
      r = [...r].sort((a, b) => {
        const x = a[sort], y = b[sort];
        if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
        return String(x).localeCompare(String(y), "ko") * dir;
      });
    }
    return r;
  }, [rows, columns, q, sort, dir]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const cur = Math.min(page, pages);
  const pageRows = filtered.slice((cur - 1) * size, (cur - 1) * size + size);

  const doSort = (key: string) => {
    if (sort === key) setDir((d) => -d);
    else { setSort(key); setDir(1); }
  };

  const downloadCsv = () => {
    const head = columns.map((c) => c.label).join(",");
    const body = filtered.map((r) => columns.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const csv = "\uFEFF" + head + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const win = 2;
  const pnums: number[] = [];
  for (let p = Math.max(1, cur - win); p <= Math.min(pages, cur + win); p++) pnums.push(p);

  return (
    <div>
      {/* 도구바 */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="🔍 검색"
          className="w-[240px] rounded-lg border border-[#e6e2d6] px-3 py-2 text-[13px] focus:border-[#1a3a66] focus:outline-none" />
        <span className="text-[13px] text-[#6b6b63]">총 <b className="text-[#1a3a66]">{total.toLocaleString()}</b>건</span>
        <div className="ml-auto flex items-center gap-2">
          <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
            className="rounded-lg border border-[#e6e2d6] px-2.5 py-2 text-[13px]">
            <option value={50}>50개씩</option>
            <option value={100}>100개씩</option>
            <option value={200}>200개씩</option>
          </select>
          <button onClick={downloadCsv} className="rounded-lg border border-[#e6e2d6] bg-white px-3 py-2 text-[13px] hover:bg-[#f6f9ff]">⬇ CSV 다운로드</button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-[#e6e2d6] bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} onClick={() => c.sortable !== false && doSort(c.key)}
                  className={`whitespace-nowrap bg-[#1a3a66] px-3.5 py-2.5 text-left font-bold text-white ${c.sortable !== false ? "cursor-pointer select-none" : ""}`}>
                  {c.label}{sort === c.key ? (dir > 0 ? " ▲" : " ▼") : (c.sortable !== false ? " ⇅" : "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length ? pageRows.map((r, i) => (
              <tr key={i} className="hover:bg-[#f9fbff]">
                {columns.map((c) => (
                  <td key={c.key} className="border-b border-r border-[#e6e2d6] px-3.5 py-2.5 last:border-r-0">
                    {c.render ? c.render(r) : String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            )) : (
              <tr><td colSpan={columns.length} className="px-3.5 py-6 text-center text-[#6b6b63]">결과 없음</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1">
        <PgBtn disabled={cur <= 1} onClick={() => setPage(1)}>«</PgBtn>
        <PgBtn disabled={cur <= 1} onClick={() => setPage(cur - 1)}>‹</PgBtn>
        {pnums.map((p) => (
          <PgBtn key={p} active={p === cur} onClick={() => setPage(p)}>{p}</PgBtn>
        ))}
        <PgBtn disabled={cur >= pages} onClick={() => setPage(cur + 1)}>›</PgBtn>
        <PgBtn disabled={cur >= pages} onClick={() => setPage(pages)}>»</PgBtn>
        <span className="ml-2.5 text-[12px] text-[#6b6b63]">{cur} / {pages} 페이지</span>
      </div>
    </div>
  );
}

function PgBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`h-8 min-w-8 rounded-md border px-2 text-[13px] ${active ? "border-[#1a3a66] bg-[#1a3a66] font-bold text-white" : "border-[#e6e2d6] bg-white text-[#222] hover:bg-[#eef4ff]"} disabled:cursor-default disabled:opacity-30`}>
      {children}
    </button>
  );
}
