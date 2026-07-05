"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import DataTable, { Column } from "@/components/DataTable";

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");
  return (
    <AdminShell current={page} onNav={setPage}>
      {page === "dashboard" && <Dashboard />}
      {page === "inquiries" && <Inquiries />}
      {page === "members" && <Members />}
      {page === "home" && <HomeManage />}
      {page === "works" && <WorksManage />}
      {page === "memo" && <Memo />}
      {page === "footer" && <FooterManage />}
      {!["dashboard", "inquiries", "members", "home", "works", "memo", "footer"].includes(page) && (
        <Placeholder id={page} />
      )}
    </AdminShell>
  );
}

/* 공통 헤더 */
function Head({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="flex items-center gap-2.5 text-[22px] font-extrabold">{title}</h1>
      {desc && <p className="mt-1.5 text-[13px] text-[#6b6b63]">{desc}</p>}
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="mb-[18px] rounded-[14px] border border-[#e6e2d6] bg-white p-[22px] shadow-sm">{children}</div>;
}

/* ===== 대시보드 ===== */
function Dashboard() {
  const kpis = [["신규 문의", "0", "확인 대기"], ["진행 프로젝트", "0", "이번 달"], ["포트폴리오", "0", "공개"], ["이번 달 견적", "0", "발송"]];
  return (
    <>
      <Head title="대시보드" desc="KKOKKA.AI STUDIO 운영 현황 요약 (2단계에서 실데이터 연결)" />
      <div className="mb-[22px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {kpis.map(([label, num, sub]) => (
          <div key={label} className="rounded-[14px] border border-[#e6e2d6] bg-white p-[18px] shadow-sm">
            <div className="mb-2 text-[12px] text-[#6b6b63]">{label}</div>
            <div className="font-mono text-[28px] font-extrabold text-[#1a3a66]">{num}</div>
            <div className="mt-1 text-[11px] text-[#6b6b63]">{sub}</div>
          </div>
        ))}
      </div>
      <Card>
        <h2 className="mb-4 text-[15px] font-extrabold">환영합니다 👋</h2>
        <p className="text-[13px] leading-[1.8] text-[#444]">
          이 관리자 화면은 <b>1단계(레이아웃·구조)</b>입니다. 좌측 메뉴를 눌러 각 화면의 자리를 확인해보세요.
          다음 단계에서 Supabase를 연결하면 실제 데이터(문의·회원·영상 등)가 이 자리에 들어옵니다.
        </p>
      </Card>
    </>
  );
}

/* ===== 고객 문의 · 답변 (스레드) ===== */
type Inquiry = {
  id: number; ref_no: string | null; created_at: string; title: string; name: string; email: string;
  company_name: string | null; project_types: string[] | null;
  budget_range: string | null; timeline: string | null;
  reference_links: string | null; message: string; status: string;
};
type Reply = { id: number; is_admin: boolean; body: string; created_at: string };

const STATUS_LABEL: Record<string, string> = { new: "접수", in_progress: "진행중", closed: "상담완료" };

function Inquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState<Inquiry | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const json = await res.json();
      if (json.ok) setRows(json.rows);
      else setReason(json.reason || "불러오기 실패");
    } catch (e: any) { setReason(e?.message || "네트워크 오류"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openDetail = async (r: Inquiry) => {
    setOpen(r); setReplies([]); setReply("");
    try {
      const res = await fetch("/api/admin/inquiries?id=" + r.id);
      const j = await res.json();
      if (j.ok && j.replies) setReplies(j.replies);
    } catch {}
  };

  const sendReply = async () => {
    if (!reply.trim() || !open) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: open.id, body: reply }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setReply("");
      const rr = await fetch("/api/admin/inquiries?id=" + open.id);
      const rj = await rr.json();
      if (rj.ok) setReplies(rj.replies);
    } catch (e: any) { alert("답변 등록 실패: " + e.message); }
    setBusy(false);
  };

  const changeStatus = async (status: string) => {
    if (!open) return;
    setBusy(true);
    try {
      await fetch("/api/admin/status", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: open.id, status }),
      });
      setOpen({ ...open, status });
      load();
    } catch {}
    setBusy(false);
  };

  const cols: Column<Inquiry>[] = [
    { key: "ref_no", label: "번호", render: (r) => <b className="text-[#1a3a66]">{r.ref_no || r.id}</b> },
    { key: "created_at", label: "접수일", render: (r) => (r.created_at || "").slice(0, 10) },
    { key: "title", label: "제목", render: (r) => r.title },
    { key: "name", label: "이름" },
    { key: "company_name", label: "회사", render: (r) => r.company_name || "-" },
    { key: "status", label: "상태", render: (r) => (
      <span className="rounded-full bg-[#e3f0ff] px-2.5 py-0.5 text-[11px] font-bold text-[#1a3a66]">{STATUS_LABEL[r.status] || r.status}</span>
    )},
    { key: "message", label: "관리", sortable: false, render: (r) => (
      <button onClick={() => openDetail(r)} className="rounded-md border border-[#cfd8e6] bg-white px-2.5 py-1 text-[12px] hover:bg-[#eef4ff]">열기</button>
    )},
  ];

  return (
    <>
      <Head title="고객 문의 · 답변" desc="접수된 제작문의. 열기 → 답변 등록 / 완료 처리. 고객은 글 비밀번호로 열람합니다." />
      <Card>
        <div className="mb-3 flex items-center">
          <h2 className="text-[15px] font-extrabold">접수된 문의</h2>
          <button onClick={load} className="ml-auto rounded-lg border border-[#e6e2d6] bg-white px-3 py-1.5 text-[13px]">🔄 새로고침</button>
        </div>
        {loading ? (
          <div className="p-10 text-center text-[13px] text-[#6b6b63]">불러오는 중...</div>
        ) : reason ? (
          <div className="rounded-xl border border-dashed border-[#f0c0b8] p-8 text-center text-[13px] text-[#c0392b]">{reason}</div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e6e2d6] p-10 text-center text-[13px] text-[#6b6b63]">아직 접수된 문의가 없습니다.</div>
        ) : (
          <DataTable columns={cols} rows={rows} filename="inquiries" />
        )}
      </Card>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[88vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[13px] font-bold text-[#1a3a66]">{open.ref_no || open.id}</span>
                <span className="ml-2 rounded-full bg-[#e3f0ff] px-2 py-0.5 text-[11px] font-bold text-[#1a3a66]">{STATUS_LABEL[open.status] || open.status}</span>
              </div>
              <button onClick={() => setOpen(null)} className="text-[20px] text-[#6b6b63]">✕</button>
            </div>
            <h2 className="mb-3 text-[17px] font-extrabold">{open.title}</h2>
            <Row k="이름" v={open.name} />
            <Row k="이메일" v={open.email} />
            <Row k="회사" v={open.company_name || "-"} />
            <Row k="유형" v={open.project_types?.join(", ") || "-"} />
            <Row k="예산" v={open.budget_range || "-"} />
            <Row k="일정" v={open.timeline || "-"} />

            <div className="mt-3 border-t border-[#eee] pt-3">
              <div className="mb-1.5 text-[12px] font-bold text-[#6b6b63]">문의 내용</div>
              <div className="whitespace-pre-wrap rounded-lg bg-[#f6f6f4] p-3 text-[13px] leading-[1.7]">{open.message}</div>
            </div>

            {/* 스레드 */}
            {replies.length > 0 && (
              <div className="mt-4 space-y-2">
                {replies.map((r) => (
                  <div key={r.id} className={`rounded-lg p-3 text-[13px] leading-[1.7] ${r.is_admin ? "bg-[#eef4ff] ml-6" : "bg-[#f6f6f4] mr-6"}`}>
                    <div className="mb-1 text-[11px] font-bold text-[#6b6b63]">{r.is_admin ? "🎬 우리 답변" : "고객 재질문"} · {(r.created_at||"").slice(0,16).replace("T"," ")}</div>
                    <div className="whitespace-pre-wrap">{r.body}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 답변 작성 */}
            <div className="mt-4 border-t border-[#eee] pt-4">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="답변을 입력하세요 (등록 시 고객에게 메일 알림)"
                className="min-h-[90px] w-full rounded-lg border border-[#e6e2d6] p-3 text-[13px]" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={sendReply} disabled={busy} className="rounded-lg bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">답변 등록</button>
                {open.status === "new" && (
                  <button onClick={() => changeStatus("in_progress")} disabled={busy} className="rounded-lg border border-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-[#1a3a66]">→ 진행중으로</button>
                )}
                {open.status !== "closed" ? (
                  <button onClick={() => changeStatus("closed")} disabled={busy} className="rounded-lg border border-[#1a3a66] bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white">✓ 상담완료</button>
                ) : (
                  <button onClick={() => changeStatus("in_progress")} disabled={busy} className="rounded-lg border border-[#e6e2d6] px-4 py-2 text-[13px]">진행중으로 되돌리기</button>
                )}
                <button onClick={() => setOpen(null)} className="ml-auto rounded-lg border border-[#e6e2d6] px-4 py-2 text-[13px]">닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3 py-1.5 text-[13px]">
      <div className="w-16 flex-none text-[#888]">{k}</div>
      <div className="flex-1">{v}</div>
    </div>
  );
}

/* ===== 회원 관리 (DataTable) ===== */
type Member = { no: string; company: string; email: string; joined: string; status: string };
function Members() {
  // 데모 데이터 (2단계에서 Supabase members 테이블로 교체)
  const rows: Member[] = Array.from({ length: 23 }, (_, i) => ({
    no: `M${String(i + 1).padStart(3, "0")}`,
    company: ["가온기획", "한빛기관", "미래산업", "정도컴퍼니", "누리소통"][i % 5] + ` ${i + 1}`,
    email: `client${i + 1}@example.com`,
    joined: `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
    status: ["활성", "활성", "휴면"][i % 3],
  }));
  const cols: Column<Member>[] = [
    { key: "no", label: "번호" },
    { key: "company", label: "회사", render: (r) => <b>{r.company}</b> },
    { key: "email", label: "이메일" },
    { key: "joined", label: "가입일" },
    { key: "status", label: "상태", render: (r) => (
      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${r.status === "활성" ? "bg-[#e3f0ff] text-[#1a3a66]" : "bg-[#f0efe9] text-[#6b6b63]"}`}>{r.status}</span>
    )},
  ];
  return (
    <>
      <Head title="회원 관리" desc="가입 회원 조회 · 검색 · 페이징 · CSV 다운로드 (데모 데이터 · 2단계에서 실 DB 연결)" />
      <Card><DataTable columns={cols} rows={rows} filename="members" /></Card>
    </>
  );
}

/* ===== 홈 화면 · 영상 관리 ===== */
type SiteSettings = {
  desktop_video_url: string | null; mobile_video_url: string | null; poster_url: string | null;
  overlay_opacity: number; headline: string; subcopy: string;
};
function HomeManage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/site-settings");
      const j = await res.json();
      if (j.ok) setS(j.settings);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const upload = async (kind: "desktop_video" | "mobile_video" | "poster", file: File) => {
    setBusy(kind); setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      const key = kind === "desktop_video" ? "desktop_video_url" : kind === "mobile_video" ? "mobile_video_url" : "poster_url";
      const patch = { [key]: j.url };
      const r2 = await fetch("/api/admin/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      const j2 = await r2.json();
      if (!j2.ok) throw new Error(j2.error);
      setS((prev) => prev ? { ...prev, ...patch } : prev);
      setMsg("✓ 업로드 완료");
    } catch (e: any) { setMsg("⚠ " + e.message); }
    setBusy(null);
  };

  const saveCopy = async () => {
    if (!s) return;
    setBusy("copy"); setMsg("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: s.headline, subcopy: s.subcopy, overlay_opacity: s.overlay_opacity }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setMsg("✓ 저장되었습니다");
    } catch (e: any) { setMsg("⚠ " + e.message); }
    setBusy(null);
  };

  const slots: { key: "desktop_video" | "mobile_video" | "poster"; label: string; urlKey: keyof SiteSettings; spec: string }[] = [
    { key: "desktop_video", label: "PC용 영상 (hero.mp4)", urlKey: "desktop_video_url", spec: "가로 16:9 · mp4 · 5~12MB" },
    { key: "mobile_video", label: "모바일 영상 (hero-mobile.mp4)", urlKey: "mobile_video_url", spec: "세로 9:16 · mp4 · 5~10MB" },
    { key: "poster", label: "포스터 이미지 (hero-poster.jpg)", urlKey: "poster_url", spec: "가로 16:9 · jpg/png" },
  ];

  return (
    <>
      <Head title="홈 화면 · 영상 관리" desc="히어로 배경 영상 변경 + 메인 카피 수정 (Supabase Storage 연결됨)" />
      <Card>
        <h2 className="mb-4 text-[15px] font-extrabold">🎬 배경 영상</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {slots.map(({ key, label, urlKey, spec }) => (
            <div key={key} className="rounded-xl border border-dashed border-[#cfd8e6] bg-[#f7f9ff] p-5 text-center">
              <div className="mb-1 text-[13px] font-bold text-[#1a3a66]">{label}</div>
              <div className="mb-2 font-mono text-[10px] text-[#8a97a8]">{spec}</div>
              <div className="mb-3 truncate text-[11px] text-[#6b6b63]" title={s?.[urlKey] as string || ""}>
                {s?.[urlKey] ? "등록됨 ✓" : "미등록"}
              </div>
              <label className="inline-block cursor-pointer rounded-lg border border-[#cfd8e6] bg-white px-4 py-2 text-[12px] hover:bg-[#eef4ff]">
                {busy === key ? "업로드 중..." : "파일 선택 · 업로드"}
                <input type="file" accept={key === "poster" ? "image/*" : "video/*"} className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(key, f); }} />
              </label>
            </div>
          ))}
        </div>
        {msg && <p className="mt-3 text-[12px] text-[#1a3a66]">{msg}</p>}
        <div className="mt-4 rounded-xl border border-[#f3d9b3] bg-[#fef8ec] p-4 text-[12px] leading-[1.9] text-[#7a5a1a]">
          <b>📐 파일 사양 안내</b><br />
          <b>· PC용 영상</b> : mp4 / 가로형 16:9 (1920×1080 또는 1280×720) / 5~12초 루프 / 5~12MB 권장 / 소리 없음<br />
          <b>· 모바일 영상</b> : mp4 / 세로형 9:16 (1080×1920 또는 720×1280) / 5~12초 루프 / 5~10MB 권장 / 소리 없음<br />
          <b>· 포스터 이미지</b> : jpg 또는 png / 가로형 16:9 / 영상 로딩 전 잠깐 보이는 표지 이미지<br />
          <br />
          <b>💡 어떻게 조합되나요?</b><br />
          · 영상 + 포스터를 함께 넣으면 → <b>로딩 순간엔 포스터, 이후 영상 재생</b> (이어달리기)<br />
          · 영상 없이 포스터만 넣으면 → <b>정지 이미지가 계속 배경</b>으로 표시<br />
          · PC는 PC영상, 모바일은 모바일영상 사용. 모바일영상이 없으면 PC영상으로 대체됩니다<br />
          · 셋 다 없으면 → 기본 애니메이션 배경이 나옵니다 (레이아웃 안 깨짐)<br />
          <br />
          <b>⚠ 업로드 팁</b> : 파일이 너무 크면(20MB↑) 실패할 수 있어요. 웹용 압축본을 사용하세요.
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-[15px] font-extrabold">✍ 메인 카피</h2>
        {s ? (
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-[12px] text-[#6b6b63]">메인 헤드라인</div>
              <input className="w-full rounded-lg border border-[#e6e2d6] p-2.5 text-[13px]" value={s.headline}
                onChange={(e) => setS({ ...s, headline: e.target.value })} />
            </div>
            <div>
              <div className="mb-1 text-[12px] text-[#6b6b63]">서브 카피</div>
              <input className="w-full rounded-lg border border-[#e6e2d6] p-2.5 text-[13px]" value={s.subcopy}
                onChange={(e) => setS({ ...s, subcopy: e.target.value })} />
            </div>
            <div>
              <div className="mb-1 text-[12px] text-[#6b6b63]">오버레이 투명도 (0~1, 클수록 어두움)</div>
              <input className="w-full rounded-lg border border-[#e6e2d6] p-2.5 text-[13px]" type="number" step="0.05" min={0} max={1}
                value={s.overlay_opacity} onChange={(e) => setS({ ...s, overlay_opacity: Number(e.target.value) })} />
            </div>
          </div>
        ) : (
          <div className="text-[13px] text-[#6b6b63]">불러오는 중...</div>
        )}
        <button onClick={saveCopy} disabled={busy === "copy" || !s} className="mt-4 rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60">
          {busy === "copy" ? "저장 중..." : "저장"}
        </button>
      </Card>
    </>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-[#6b6b63]">{label}</label>
      <input defaultValue={value} className="w-full rounded-lg border border-[#e6e2d6] px-3 py-2.5 text-[13px]" />
    </div>
  );
}

/* ===== 관리자 메모 (DB 저장 · 수정 가능) ===== */
type MemoRow = { id: number; title: string; body: string; created_at: string; updated_at: string; author: string };

function Memo() {
  const [memos, setMemos] = useState<MemoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "write" | number>("list");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/memos");
      const j = await res.json();
      if (j.ok) setMemos(j.memos);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startWrite = () => { setEditId(null); setTitle(""); setBody(""); setView("write"); };
  const startEdit = (m: MemoRow) => { setEditId(m.id); setTitle(m.title); setBody(m.body); setView("write"); };

  const save = async () => {
    if (!title.trim()) { alert("제목을 입력하세요."); return; }
    setBusy(true);
    try {
      if (editId) {
        await fetch("/api/admin/memos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, title, body }) });
      } else {
        await fetch("/api/admin/memos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body }) });
      }
      await load();
      setView("list");
    } catch (e: any) { alert("저장 실패: " + e.message); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("삭제할까요?")) return;
    setBusy(true);
    try {
      await fetch("/api/admin/memos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      await load();
      setView("list");
    } catch {}
    setBusy(false);
  };

  // 작성/수정 화면
  if (view === "write") {
    return (
      <>
        <Head title={editId ? "📝 메모 수정" : "📝 새 메모 작성"} desc="DB에 저장되어 새로고침해도 사라지지 않습니다." />
        <Card>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목"
            className="mb-3 w-full rounded-lg border border-[#e6e2d6] p-2.5 text-[14px] font-semibold" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="내용 (운영 매뉴얼, 변경사항 등 자유롭게)"
            className="min-h-[280px] w-full rounded-lg border border-[#e6e2d6] p-3 text-[13px] leading-[1.8]" />
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={busy} className="rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60">
              {busy ? "저장 중..." : "저장"}
            </button>
            <button onClick={() => setView("list")} className="rounded-lg border border-[#e6e2d6] px-5 py-2.5 text-[13px]">취소</button>
          </div>
        </Card>
      </>
    );
  }

  // 상세 화면
  if (typeof view === "number") {
    const m = memos.find((x) => x.id === view);
    if (!m) { setView("list"); return null; }
    return (
      <>
        <Head title="📝 관리자 메모" />
        <Card>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-[18px] font-extrabold">{m.title}</h2>
            <div className="flex flex-none gap-2">
              <button onClick={() => startEdit(m)} className="rounded-lg border border-[#1a3a66] px-3 py-1.5 text-[12px] font-semibold text-[#1a3a66]">수정</button>
              <button onClick={() => del(m.id)} className="rounded-lg border border-[#e0b0b0] px-3 py-1.5 text-[12px] text-[#c0392b]">삭제</button>
            </div>
          </div>
          <div className="mb-4 font-mono text-[11px] text-[#6b6b63]">
            {m.author} · 작성 {(m.created_at||"").slice(0,10)}
            {m.updated_at && m.updated_at !== m.created_at && ` · 수정 ${m.updated_at.slice(0,10)}`}
          </div>
          <div className="whitespace-pre-wrap rounded-lg bg-[#f6f6f4] p-4 text-[13px] leading-[1.85]">{m.body || "(내용 없음)"}</div>
          <button onClick={() => setView("list")} className="mt-4 rounded-lg border border-[#e6e2d6] px-5 py-2.5 text-[13px]">← 목록</button>
        </Card>
      </>
    );
  }

  // 목록 화면
  return (
    <>
      <Head title="📝 관리자 메모" desc="운영 메모 (DB 저장 · 수정/삭제 가능). 중요 변경사항·매뉴얼을 기록하세요." />
      <Card>
        <div className="mb-3 flex items-center">
          <h2 className="text-[15px] font-extrabold">운영 메모 ({memos.length}개)</h2>
          <button onClick={startWrite} className="ml-auto rounded-lg bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white">+ 새 메모</button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[13px] text-[#6b6b63]">불러오는 중...</div>
        ) : memos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e6e2d6] p-10 text-center text-[13px] text-[#6b6b63]">
            아직 메모가 없습니다. "+ 새 메모"로 첫 기록을 남겨보세요.
          </div>
        ) : (
          <div className="divide-y divide-[#eee]">
            {memos.map((m) => (
              <div key={m.id} onClick={() => setView(m.id)} className="flex cursor-pointer items-center gap-3 py-3 hover:bg-[#faf9f6]">
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">{m.title}</div>
                  <div className="mt-0.5 truncate text-[12px] text-[#6b6b63]">{m.body?.slice(0, 60) || "(내용 없음)"}</div>
                </div>
                <div className="flex-none font-mono text-[11px] text-[#8a97a8]">{(m.updated_at||m.created_at||"").slice(0,10)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

/* ===== 포트폴리오(Works) 관리 ===== */
const WORK_CATS = ["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"];
type WorkRow = {
  id: number; title: string; category: string; client_type: string | null; year: string | null;
  video_url: string | null; thumbnail_url: string | null; description: string;
  is_public: boolean; is_featured: boolean; sort_order: number;
};

function WorksManage() {
  const [rows, setRows] = useState<WorkRow[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const [page, setPage] = useState(1);
  const PER = 20;
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Partial<WorkRow> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/works");
      const j = await res.json();
      if (j.ok) setRows(j.works);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const blank = (): Partial<WorkRow> => ({ title: "", category: "Brand Film", year: String(new Date().getFullYear()), video_url: "", thumbnail_url: "", description: "", is_public: true, is_featured: false, sort_order: 0 });

  const save = async () => {
    if (!edit?.title?.trim()) { alert("제목을 입력하세요."); return; }
    setBusy(true);
    try {
      const method = edit.id ? "PATCH" : "POST";
      const res = await fetch("/api/admin/works", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      await load();
      setEdit(null);
    } catch (e: any) { alert("저장 실패: " + e.message); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("삭제할까요?")) return;
    setBusy(true);
    try {
      await fetch("/api/admin/works", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      await load();
      setEdit(null);
    } catch {}
    setBusy(false);
  };

  // 편집 폼
  if (edit) {
    const f = edit;
    const set = (k: keyof WorkRow, v: any) => setEdit({ ...f, [k]: v });
    return (
      <>
        <Head title={f.id ? "포트폴리오 수정" : "새 포트폴리오 등록"} desc="영상은 유튜브/비메오 링크를 붙여넣으세요." />
        <Card>
          <div className="space-y-3">
            <FieldA label="제목 *"><input className="ii" value={f.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="예: OO시 공공 캠페인 필름" /></FieldA>
            <div className="grid grid-cols-2 gap-3">
              <FieldA label="카테고리">
                <select className="ii" value={f.category} onChange={(e) => set("category", e.target.value)}>
                  {WORK_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FieldA>
              <FieldA label="연도"><input className="ii" value={f.year || ""} onChange={(e) => set("year", e.target.value)} placeholder="2026" /></FieldA>
            </div>
            <FieldA label="클라이언트 유형 (선택)"><input className="ii" value={f.client_type || ""} onChange={(e) => set("client_type", e.target.value)} placeholder="예: 공공기관 / 브랜드 (실명 대신 유형)" /></FieldA>
            <FieldA label="영상 링크 (유튜브/비메오)"><input className="ii" value={f.video_url || ""} onChange={(e) => set("video_url", e.target.value)} placeholder="https://youtu.be/... 또는 https://vimeo.com/..." /></FieldA>
            <FieldA label="썸네일 이미지 URL (선택)"><input className="ii" value={f.thumbnail_url || ""} onChange={(e) => set("thumbnail_url", e.target.value)} placeholder="https://... (비우면 기본 그래픽)" /></FieldA>
            <FieldA label="설명"><textarea className="ii min-h-[90px]" value={f.description || ""} onChange={(e) => set("description", e.target.value)} placeholder="작업 개요, 목적 등" /></FieldA>
            <div className="grid grid-cols-3 gap-3">
              <FieldA label="공개 여부">
                <select className="ii" value={f.is_public ? "1" : "0"} onChange={(e) => set("is_public", e.target.value === "1")}>
                  <option value="1">공개</option><option value="0">비공개</option>
                </select>
              </FieldA>
              <FieldA label="메인(홈) 노출">
                <select className="ii" value={f.is_featured ? "1" : "0"} onChange={(e) => set("is_featured", e.target.value === "1")}>
                  <option value="0">일반</option><option value="1">홈에 노출</option>
                </select>
              </FieldA>
              <FieldA label="정렬(작을수록 앞)"><input className="ii" type="number" value={f.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></FieldA>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} disabled={busy} className="rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60">{busy ? "저장 중..." : "저장"}</button>
            {f.id && <button onClick={() => del(f.id!)} className="rounded-lg border border-[#e0b0b0] px-4 py-2.5 text-[13px] text-[#c0392b]">삭제</button>}
            <button onClick={() => setEdit(null)} className="ml-auto rounded-lg border border-[#e6e2d6] px-5 py-2.5 text-[13px]">취소</button>
          </div>
        </Card>
        <style>{`.ii{width:100%;border:1px solid #e6e2d6;border-radius:9px;padding:10px 12px;font-size:13px;background:#fff}.ii:focus{outline:none;border-color:#9cb8e6}`}</style>
      </>
    );
  }

  // 목록 (검색 + 카테고리 필터 + 페이징)
  const filtered = rows.filter((w) => {
    const okCat = cat === "전체" || w.category === cat;
    const okQ = !q.trim() || w.title.toLowerCase().includes(q.trim().toLowerCase());
    return okCat && okQ;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const curPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((curPage - 1) * PER, curPage * PER);
  const catCount = (c: string) => c === "전체" ? rows.length : rows.filter((w) => w.category === c).length;

  return (
    <>
      <Head title="포트폴리오 관리" desc="Works에 노출되는 포트폴리오. 영상은 유튜브/비메오 링크로 등록합니다." />
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-[15px] font-extrabold">포트폴리오 ({filtered.length}개{q || cat !== "전체" ? ` / 전체 ${rows.length}` : ""})</h2>
          <div className="ml-auto flex items-center gap-2">
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="제목 검색..."
              className="w-[200px] rounded-lg border border-[#e6e2d6] px-3 py-2 text-[13px]" />
            <button onClick={() => setEdit(blank())} className="flex-none rounded-lg bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white">+ 새 포트폴리오</button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {["전체", ...WORK_CATS].map((c) => (
            <button key={c} onClick={() => { setCat(c); setPage(1); }}
              className={`rounded-full border px-3 py-1.5 text-[12px] ${cat === c ? "border-[#1a3a66] bg-[#1a3a66] text-white" : "border-[#e6e2d6] bg-white text-[#555] hover:bg-[#f4f6fb]"}`}>
              {c} <span className="opacity-60">{catCount(c)}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-[13px] text-[#6b6b63]">불러오는 중...</div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e6e2d6] p-10 text-center text-[13px] text-[#6b6b63]">아직 등록된 포트폴리오가 없습니다. "+ 새 포트폴리오"로 추가하세요.</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e6e2d6] p-10 text-center text-[13px] text-[#6b6b63]">검색/필터 결과가 없습니다.</div>
        ) : (
          <>
            <div className="divide-y divide-[#eee]">
              {pageRows.map((w) => (
                <div key={w.id} onClick={() => setEdit(w)} className="flex cursor-pointer items-center gap-3 py-3 hover:bg-[#faf9f6]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">{w.title}</span>
                      {w.is_featured && <span className="rounded-full bg-[#e3f0ff] px-2 py-0.5 text-[10px] font-bold text-[#1a3a66]">홈노출</span>}
                      {!w.is_public && <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] text-[#888]">비공개</span>}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[#6b6b63]">{w.category} · {w.year || "-"} {w.video_url ? "· 🎬영상" : ""}</div>
                  </div>
                  <div className="flex-none font-mono text-[11px] text-[#8a97a8]">#{w.sort_order}</div>
                </div>
              ))}
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`h-8 min-w-8 rounded-lg border px-2.5 text-[12px] ${p === curPage ? "border-[#1a3a66] bg-[#1a3a66] text-white" : "border-[#e6e2d6] bg-white text-[#555]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
function FieldA({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-[12px] font-semibold text-[#6b6b63]">{label}</label>{children}</div>;
}

/* ===== 푸터 · 약관 관리 (탭) ===== */
function FooterManage() {
  const [tab, setTab] = useState("info");
  const tabs = [["info", "하단 정보"], ["terms", "이용약관"], ["privacy", "개인정보처리방침"], ["faq", "자주 묻는 질문"], ["ai", "AI 콘텐츠 정책"]];
  return (
    <>
      <Head title="📄 푸터 · 약관 관리" desc="고객 화면 하단의 정보·약관·FAQ·AI정책을 관리합니다" />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <span key={id} onClick={() => setTab(id)} className={`cursor-pointer rounded-lg border px-3.5 py-2 text-[13px] ${tab === id ? "border-[#cfe0ff] bg-[#eef4ff] font-bold text-[#1a3a66]" : "border-[#e6e2d6] bg-white"}`}>{label}</span>
        ))}
      </div>
      <Card>
        {tab === "info" ? (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {[["회사명", "SAYABOUT"], ["대표", ""], ["문의 메일", ""], ["사업자번호", ""]].map(([l, v]) => (
              <div key={l}><label className="mb-1.5 block text-[12px] font-bold text-[#6b6b63]">{l}</label>
                <input defaultValue={v} className="w-full rounded-lg border border-[#e6e2d6] px-3 py-2.5 text-[13px]" /></div>
            ))}
          </div>
        ) : (
          <div><label className="mb-1.5 block text-[12px] font-bold text-[#6b6b63]">본문</label>
            <textarea className="min-h-[200px] w-full rounded-lg border border-[#e6e2d6] px-3 py-2.5 text-[13px] leading-[1.7]" placeholder="내용을 입력하세요 (2단계에서 DB 저장)" /></div>
        )}
        <button className="mt-4 rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white">저장 (2단계)</button>
      </Card>
    </>
  );
}

/* ===== 준비중 자리 ===== */
function Placeholder({ id }: { id: string }) {
  const labels: Record<string, string> = {
    quotes: "견적 관리", projects: "프로젝트 관리", works: "포트폴리오 관리",
    pages: "페이지/문구 관리", media: "미디어 라이브러리", payments: "결제 현황",
    settings: "설정", logs: "활동 로그",
  };
  return (
    <>
      <Head title={labels[id] || id} desc="2단계에서 기능이 연결됩니다." />
      <Card>
        <div className="py-12 text-center text-[13px] text-[#6b6b63]">
          <div className="mb-3 text-[40px]">🚧</div>
          이 화면은 <b>{labels[id] || id}</b>의 자리입니다.<br />구조는 준비돼 있고, 다음 단계에서 기능이 들어갑니다.
        </div>
      </Card>
    </>
  );
}
