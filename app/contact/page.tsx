"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const TYPES = ["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"];
const PAGE_SIZE = 10;

type ListRow = { id: number; ref_no: string | null; title: string; status: string; created_at: string };

// 접수 후 24시간 지나면 '진행중'으로 표시 (완료는 서버 상태 우선)
function displayStatus(status: string, created_at: string): { label: string; cls: string } {
  if (status === "closed") return { label: "완료", cls: "border-white/20 text-gray" };
  const over24h = Date.now() - new Date(created_at).getTime() > 24 * 3600 * 1000;
  if (status === "new" && !over24h) return { label: "접수", cls: "border-[rgba(143,183,255,0.5)] text-ice" };
  return { label: "진행중", cls: "border-[rgba(143,183,255,0.34)] text-ice" };
}

export default function ContactPage() {
  const [rows, setRows] = useState<ListRow[]>([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const load = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("inquiries_public")
        .select("id, ref_no, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setRows(data as any);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[60px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">04 / Contact</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">Got an idea?</h1>
          <p className="mt-6 max-w-[600px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">
            상상만 가져와 주세요. 장면은 우리가 디렉팅합니다. 아래에서 바로 제작 문의를 남길 수 있습니다.
          </p>
        </div>
      </section>

      <section className="px-8 py-[70px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[14px] text-gray [word-break:keep-all]">
              🔒 제작문의 글과 답변은 <span className="text-offwhite">작성 시 정한 비밀번호</span>로만 열람됩니다. 목록에는 제목만 표시됩니다.
            </p>
            <button onClick={() => setShowForm(true)}
              className="flex-none inline-flex min-h-[46px] items-center justify-center rounded-full bg-ice px-6 text-[14px] font-semibold text-black transition hover:-translate-y-0.5">
              + 문의하기
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.11]">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="bg-white/[0.04] text-left font-mono text-[12px] uppercase tracking-[0.08em] text-gray">
                  <th className="w-[110px] px-5 py-3.5">번호</th>
                  <th className="px-5 py-3.5">제목</th>
                  <th className="w-[110px] px-5 py-3.5">상태</th>
                  <th className="w-[130px] px-5 py-3.5">작성일</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length ? pageRows.map((r) => {
                  const st = displayStatus(r.status, r.created_at);
                  return (
                    <tr key={r.id} onClick={() => setViewId(r.id)} className="cursor-pointer border-t border-white/[0.07] hover:bg-white/[0.03]">
                      <td className="px-5 py-3.5 font-mono text-ice">{r.ref_no || "-"}</td>
                      <td className="px-5 py-3.5 text-offwhite">🔒 {r.title}</td>
                      <td className="px-5 py-3.5"><span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${st.cls}`}>{st.label}</span></td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-gray">{(r.created_at || "").slice(0, 10)}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-[13px] text-gray-dark">아직 등록된 문의가 없습니다. 첫 문의를 남겨보세요.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="mt-5 flex justify-center gap-1.5">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-9 min-w-9 rounded-lg border px-3 font-mono text-[13px] ${p === page ? "border-ice bg-ice text-black" : "border-white/[0.11] text-gray hover:text-offwhite"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {showForm && <InquiryFormModal onClose={() => setShowForm(false)} onDone={() => { setShowForm(false); load(); }} />}
      {viewId !== null && <InquiryViewModal id={viewId} onClose={() => setViewId(null)} />}
    </>
  );
}

/* ===== 문의 작성 모달 ===== */
function InquiryFormModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [f, setF] = useState({ title: "AI 제작 문의 드립니다", name: "", email: "", company: "", budget: "", timeline: "", refs: "", message: "", password: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [refNo, setRefNo] = useState("");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (t: string) => setPicked((p) => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.message.trim() || !f.password.trim()) {
      setMsg("이름, 이메일, 내용, 비밀번호는 필수입니다."); setStatus("error"); return;
    }
    if (f.password.length < 4) { setMsg("비밀번호는 4자 이상이어야 합니다."); setStatus("error"); return; }
    setStatus("sending"); setMsg("");
    try {
      const res = await fetch("/api/inquiry/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, project_types: picked }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "전송 실패");
      setRefNo(j.ref_no || ""); setStatus("done");
    } catch (e: any) { setMsg(e.message); setStatus("error"); }
  };

  return (
    <Modal onClose={onClose}>
      {status === "done" ? (
        <div className="text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(143,183,255,0.5)] text-[24px] text-ice">✓</div>
          <h2 className="text-[22px] font-bold">문의가 접수되었습니다.</h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-gray">
            문의번호 <b className="text-ice">{refNo}</b><br />
            답변이 등록되면 이메일로 알려드립니다. 확인 시 <b className="text-offwhite">작성한 비밀번호</b>가 필요하니 기억해주세요.
          </p>
          <button onClick={onDone} className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ice px-6 text-[14px] font-semibold text-black">확인</button>
        </div>
      ) : (
        <>
          <h2 className="mb-1 text-[20px] font-bold">제작 문의하기</h2>
          <p className="mb-5 text-[13px] text-gray">답변 확인 시 필요한 비밀번호를 꼭 기억해주세요.</p>
          <div className="max-h-[60vh] space-y-3.5 overflow-y-auto pr-1">
            <FF label="제목"><input className="kkm" value={f.title} onChange={e => set("title", e.target.value)} /></FF>
            <div className="grid grid-cols-2 gap-3">
              <FF label="이름 *"><input className="kkm" value={f.name} onChange={e => set("name", e.target.value)} placeholder="담당자명" /></FF>
              <FF label="이메일 *"><input className="kkm" type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" /></FF>
            </div>
            <FF label="회사 / 브랜드"><input className="kkm" value={f.company} onChange={e => set("company", e.target.value)} /></FF>
            <FF label="프로젝트 유형">
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map(t => (
                  <button key={t} type="button" onClick={() => toggle(t)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] ${picked.includes(t) ? "border-ice bg-ice text-black" : "border-white/15 text-gray"}`}>{t}</button>
                ))}
              </div>
            </FF>
            <div className="grid grid-cols-2 gap-3">
              <FF label="예산"><input className="kkm" value={f.budget} onChange={e => set("budget", e.target.value)} placeholder="예: 500~1,000만원" /></FF>
              <FF label="일정"><input className="kkm" value={f.timeline} onChange={e => set("timeline", e.target.value)} placeholder="예: 3월 중" /></FF>
            </div>
            <FF label="참고 링크"><input className="kkm" value={f.refs} onChange={e => set("refs", e.target.value)} /></FF>
            <FF label="내용 *"><textarea className="kkm min-h-[110px] resize-y" value={f.message} onChange={e => set("message", e.target.value)} placeholder="목적, 타깃, 활용 채널 등" /></FF>
            <FF label="글 비밀번호 * (답변 확인 시 필요)"><input className="kkm" type="password" value={f.password} onChange={e => set("password", e.target.value)} placeholder="4자 이상" /></FF>
          </div>
          {status === "error" && <p className="mt-3 text-[13px] text-[#ff9b9b]">⚠ {msg}</p>}
          <div className="mt-5 flex gap-2">
            <button onClick={submit} disabled={status === "sending"} className="flex-1 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ice px-6 text-[14px] font-semibold text-black disabled:opacity-60">
              {status === "sending" ? "보내는 중..." : "문의 보내기"}
            </button>
            <button onClick={onClose} className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-6 text-[14px] text-offwhite">취소</button>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ===== 문의 열람 모달 (비번 → 스레드) ===== */
function InquiryViewModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  const unlock = async () => {
    if (!password) return;
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/inquiry/view", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setData(j.inquiry); setReplies(j.replies); setUnlocked(true);
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/inquiry/reply", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, body: reply }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error);
      setReply("");
      // 새로고침
      const v = await fetch("/api/inquiry/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, password }) });
      const vj = await v.json();
      if (vj.ok) setReplies(vj.replies);
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      {!unlocked ? (
        <>
          <h2 className="mb-1 text-[20px] font-bold">🔒 비밀글</h2>
          <p className="mb-5 text-[13px] text-gray">작성 시 정한 비밀번호를 입력하세요.</p>
          <input className="kkm" type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && unlock()} placeholder="비밀번호" autoFocus />
          {err && <p className="mt-3 text-[13px] text-[#ff9b9b]">⚠ {err}</p>}
          <div className="mt-5 flex gap-2">
            <button onClick={unlock} disabled={loading} className="flex-1 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ice px-6 text-[14px] font-semibold text-black disabled:opacity-60">
              {loading ? "확인 중..." : "열람하기"}
            </button>
            <button onClick={onClose} className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-6 text-[14px] text-offwhite">닫기</button>
          </div>
        </>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <div className="mb-1 font-mono text-[12px] text-ice">{data.ref_no}</div>
          <h2 className="mb-4 text-[20px] font-bold">{data.title}</h2>

          {/* 최초 문의 */}
          <div className="mb-3 rounded-xl border border-white/[0.11] bg-white/[0.03] p-4">
            <div className="mb-2 font-mono text-[11px] text-gray">문의 · {data.name} · {(data.created_at||"").slice(0,10)}</div>
            <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-offwhite">{data.message}</div>
            {(data.budget_range || data.timeline) && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[0.08] pt-3 font-mono text-[11px] text-gray">
                {data.budget_range && <span>예산 {data.budget_range}</span>}
                {data.timeline && <span>· 일정 {data.timeline}</span>}
              </div>
            )}
          </div>

          {/* 답변 스레드 */}
          {replies.map((r) => (
            <div key={r.id} className={`mb-3 rounded-xl border p-4 ${r.is_admin ? "border-[rgba(143,183,255,0.34)] bg-[rgba(143,183,255,0.06)] ml-6" : "border-white/[0.11] bg-white/[0.03] mr-6"}`}>
              <div className="mb-2 font-mono text-[11px] text-gray">{r.is_admin ? "🎬 KKOKKA.AI 답변" : "재질문"} · {(r.created_at||"").slice(0,16).replace("T"," ")}</div>
              <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-offwhite">{r.body}</div>
            </div>
          ))}

          {/* 재질문 입력 */}
          <div className="mt-4 border-t border-white/[0.11] pt-4">
            <textarea className="kkm min-h-[80px] resize-y" value={reply} onChange={e => setReply(e.target.value)} placeholder="추가 질문이나 답변을 남겨보세요." />
            {err && <p className="mt-2 text-[13px] text-[#ff9b9b]">⚠ {err}</p>}
            <div className="mt-3 flex gap-2">
              <button onClick={sendReply} disabled={loading} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-ice px-5 text-[13px] font-semibold text-black disabled:opacity-60">
                {loading ? "..." : "등록"}
              </button>
              <button onClick={onClose} className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-5 text-[13px] text-offwhite">닫기</button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-[560px] rounded-[22px] border border-white/[0.11] bg-char2 p-7" onClick={e => e.stopPropagation()}>
        {children}
      </div>
      <style>{`
        .kkm{width:100%;background:#0a0a0c;border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:12px 14px;color:#F4F1EA;font-family:inherit;font-size:14px}
        .kkm:focus{outline:none;border-color:rgba(143,183,255,.5)}
        .kkm::placeholder{color:#6E6E70}
      `}</style>
    </div>
  );
}

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.06em] text-gray">{label}</label>
      {children}
    </div>
  );
}
