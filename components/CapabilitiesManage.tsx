// components/admin/CapabilitiesManage.tsx
"use client";

import { useEffect, useState } from "react";

type Cap = { id: number; category: string; name: string; sort_order: number; is_active: boolean };

const CATS: { id: string; label: string }[] = [
  { id: "engine_video", label: "영상 엔진" },
  { id: "engine_image", label: "이미지 엔진" },
  { id: "tool", label: "제작 도구" },
  { id: "effect", label: "효과" },
];

export default function CapabilitiesManage() {
  const [rows, setRows] = useState<Cap[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [draft, setDraft] = useState<Record<number, string>>({});
  const [newName, setNewName] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/admin/capabilities");
      const j = await res.json();
      if (j.ok) setRows(j.capabilities);
      else setErr(j.error || "불러오기 실패");
    } catch (e: any) { setErr(e?.message || "네트워크 오류"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const inCat = (c: string) => rows.filter((r) => r.category === c).sort((a, b) => a.sort_order - b.sort_order);

  const add = async (category: string) => {
    const name = (newName[category] || "").trim();
    if (!name) return;
    setBusy(true);
    const maxOrder = Math.max(0, ...inCat(category).map((r) => r.sort_order));
    try {
      const res = await fetch("/api/admin/capabilities", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, sort_order: maxOrder + 10, is_active: true }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setNewName((s) => ({ ...s, [category]: "" }));
      await load();
    } catch (e: any) { alert("추가 실패: " + e.message); }
    setBusy(false);
  };

  const saveName = async (row: Cap) => {
    const name = (draft[row.id] ?? row.name).trim();
    if (!name || name === row.name) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/capabilities", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, name }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, name } : r)));
      setDraft((d) => { const n = { ...d }; delete n[row.id]; return n; });
    } catch (e: any) { alert("저장 실패: " + e.message); }
    setBusy(false);
  };

  const toggle = async (row: Cap) => {
    const next = !row.is_active;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_active: next } : r))); // 낙관적 반영
    try {
      await fetch("/api/admin/capabilities", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, is_active: next }),
      });
    } catch { load(); }
  };

  const del = async (row: Cap) => {
    if (!confirm(`"${row.name}" 삭제할까요?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/capabilities", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
    } catch (e: any) { alert("삭제 실패: " + e.message); }
    setBusy(false);
  };

  const move = async (row: Cap, dir: -1 | 1) => {
    const list = inCat(row.category);
    const idx = list.findIndex((r) => r.id === row.id);
    const swap = list[idx + dir];
    if (!swap) return;
    const a = row.sort_order, b = swap.sort_order;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, sort_order: b } : r.id === swap.id ? { ...r, sort_order: a } : r)));
    try {
      await Promise.all([
        fetch("/api/admin/capabilities", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, sort_order: b }) }),
        fetch("/api/admin/capabilities", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: swap.id, sort_order: a }) }),
      ]);
    } catch { load(); }
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="flex items-center gap-2.5 text-[22px] font-extrabold">홈 엔진 · 도구 관리</h1>
        <p className="mt-1.5 text-[13px] text-[#6b6b63]">
          홈 맨 아래 "Studio Capabilities" 섹션에 노출되는 목록. 추가·수정·삭제·순서·on/off를 관리합니다. 끈 항목은 홈에서 숨겨집니다.
        </p>
      </div>

      {err && <div className="mb-4 rounded-xl border border-dashed border-[#f0c0b8] p-4 text-[13px] text-[#c0392b]">{err}</div>}
      {loading && <div className="p-10 text-center text-[13px] text-[#6b6b63]">불러오는 중...</div>}

      {!loading && CATS.map((cat) => {
        const list = inCat(cat.id);
        return (
          <div key={cat.id} className="mb-[18px] rounded-[14px] border border-[#e6e2d6] bg-white p-[22px] shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[15px] font-extrabold">{cat.label}</h2>
              <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-bold text-[#1a3a66]">{list.length}</span>
            </div>

            {/* 목록 */}
            <div className="divide-y divide-[#f0efe9]">
              {list.map((row, i) => (
                <div key={row.id} className="flex items-center gap-2 py-2">
                  {/* 순서 */}
                  <div className="flex flex-none flex-col">
                    <button onClick={() => move(row, -1)} disabled={i === 0}
                      className="h-4 text-[10px] leading-none text-[#8a97a8] disabled:opacity-25">▲</button>
                    <button onClick={() => move(row, 1)} disabled={i === list.length - 1}
                      className="h-4 text-[10px] leading-none text-[#8a97a8] disabled:opacity-25">▼</button>
                  </div>
                  {/* 이름 */}
                  <input
                    value={draft[row.id] ?? row.name}
                    onChange={(e) => setDraft((d) => ({ ...d, [row.id]: e.target.value }))}
                    onBlur={() => saveName(row)}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    className={`flex-1 rounded-lg border px-3 py-2 text-[13px] ${row.is_active ? "border-[#e6e2d6] bg-white" : "border-[#eee] bg-[#f7f7f4] text-[#aaa] line-through"}`}
                  />
                  {/* on/off */}
                  <button onClick={() => toggle(row)}
                    className={`flex-none rounded-full px-3 py-1.5 text-[11px] font-bold ${row.is_active ? "bg-[#e3f0ff] text-[#1a3a66]" : "bg-[#f0f0f0] text-[#999]"}`}>
                    {row.is_active ? "노출" : "숨김"}
                  </button>
                  {/* 삭제 */}
                  <button onClick={() => del(row)}
                    className="flex-none rounded-md border border-[#e0b0b0] px-2.5 py-1.5 text-[12px] text-[#c0392b] hover:bg-[#fdf0ee]">삭제</button>
                </div>
              ))}
              {list.length === 0 && <div className="py-3 text-[13px] text-[#6b6b63]">아직 없습니다. 아래에서 추가하세요.</div>}
            </div>

            {/* 추가 */}
            <div className="mt-3 flex gap-2">
              <input
                value={newName[cat.id] || ""}
                onChange={(e) => setNewName((s) => ({ ...s, [cat.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") add(cat.id); }}
                placeholder={`새 ${cat.label} 이름 (예: ${cat.id === "tool" || cat.id === "effect" ? "새 항목" : "Veo 4"})`}
                className="flex-1 rounded-lg border border-[#e6e2d6] px-3 py-2 text-[13px]"
              />
              <button onClick={() => add(cat.id)} disabled={busy}
                className="flex-none rounded-lg bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">+ 추가</button>
            </div>
          </div>
        );
      })}
    </>
  );
}
