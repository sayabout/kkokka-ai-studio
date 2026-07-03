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
      {page === "memo" && <Memo />}
      {page === "footer" && <FooterManage />}
      {!["dashboard", "inquiries", "members", "home", "memo", "footer"].includes(page) && (
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

const STATUS_LABEL: Record<string, string> = { new: "접수", in_progress: "진행중", closed: "완료" };

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
                {open.status !== "closed" ? (
                  <button onClick={() => changeStatus("closed")} disabled={busy} className="rounded-lg border border-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-[#1a3a66]">✓ 완료 처리</button>
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
function HomeManage() {
  return (
    <>
      <Head title="홈 화면 · 영상 관리" desc="히어로 배경 영상 변경·추가·삭제·순서 + 메인 카피 수정 (2단계 Supabase Storage 연결)" />
      <Card>
        <h2 className="mb-4 text-[15px] font-extrabold">🎬 배경 영상</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {["PC용 영상 (hero.mp4)", "모바일 영상 (hero-mobile.mp4)", "포스터 이미지 (hero-poster.jpg)"].map((t) => (
            <div key={t} className="rounded-xl border border-dashed border-[#cfd8e6] bg-[#f7f9ff] p-5 text-center">
              <div className="mb-2 text-[13px] font-bold text-[#1a3a66]">{t}</div>
              <div className="mb-3 text-[11px] text-[#6b6b63]">파일 업로드 또는 URL 등록</div>
              <button className="rounded-lg border border-[#cfd8e6] bg-white px-4 py-2 text-[12px]">업로드 (2단계)</button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-[#f3d9b3] bg-[#fef8ec] p-4 text-[12px] leading-[1.8] text-[#7a5a1a]">
          <b>⚠ 영상 업로드가 안 될 때</b><br />
          · 파일이 너무 크면 실패할 수 있어요 → 웹용 압축본(5~12MB) 사용<br />
          · 영상 대신 <b>포스터 이미지만</b> 등록해도 정상 작동합니다<br />
          · 외부 스토리지 <b>URL로 등록</b>하는 방법도 지원합니다
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-[15px] font-extrabold">✍ 메인 카피</h2>
        <div className="space-y-3">
          <FieldRow label="메인 헤드라인" value="누구나 AI로 영상을 만듭니다. 문제는 누가 디렉팅하느냐입니다." />
          <FieldRow label="서브 카피" value="도구는 평준화됐습니다. 남는 건 판단입니다..." />
          <FieldRow label="오버레이 투명도" value="0.55" />
        </div>
        <button className="mt-4 rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white">저장 (2단계)</button>
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

/* ===== 관리자 메모 (게시판) ===== */
type Memo = { id: number; title: string; body: string; date: string; author: string };
function Memo() {
  const [memos, setMemos] = useState<Memo[]>([
    { id: 1, title: "1차 오픈 체크리스트", body: "홈·Works·Process·About·Contact 배포 확인 후 2단계(로그인) 진행.", date: "2026-07-02", author: "SAYABOUT" },
  ]);
  const [view, setView] = useState<"list" | "new" | number>("list");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const save = () => {
    if (!title.trim()) { alert("제목을 입력하세요"); return; }
    const id = memos.length ? Math.max(...memos.map((m) => m.id)) + 1 : 1;
    setMemos([...memos, { id, title, body, date: new Date().toISOString().slice(0, 10), author: "SAYABOUT" }]);
    setTitle(""); setBody(""); setView("list");
  };
  const del = (id: number) => { if (confirm("삭제할까요?")) { setMemos(memos.filter((m) => m.id !== id)); setView("list"); } };

  if (view === "new") {
    return (
      <>
        <Head title="📝 관리자 메모" desc="새 글 쓰기" />
        <button onClick={() => setView("list")} className="mb-3.5 rounded-lg border border-[#e6e2d6] bg-white px-3 py-1.5 text-[13px]">← 목록으로</button>
        <Card>
          <div className="mb-3.5"><label className="mb-1.5 block text-[12px] font-bold text-[#6b6b63]">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-[#e6e2d6] px-3 py-2.5 text-[13px]" placeholder="제목을 입력하세요" /></div>
          <div className="mb-3.5"><label className="mb-1.5 block text-[12px] font-bold text-[#6b6b63]">본문</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[160px] w-full rounded-lg border border-[#e6e2d6] px-3 py-2.5 text-[13px]" placeholder="내용을 입력하세요" /></div>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-lg bg-[#1a3a66] px-5 py-2.5 text-[13px] font-semibold text-white">등록</button>
            <button onClick={() => setView("list")} className="rounded-lg border border-[#e6e2d6] bg-white px-5 py-2.5 text-[13px]">취소</button>
          </div>
        </Card>
      </>
    );
  }
  if (typeof view === "number") {
    const m = memos.find((x) => x.id === view);
    if (m) return (
      <>
        <Head title="📝 관리자 메모" />
        <button onClick={() => setView("list")} className="mb-3.5 rounded-lg border border-[#e6e2d6] bg-white px-3 py-1.5 text-[13px]">← 목록으로</button>
        <Card>
          <h2 className="mb-1.5 text-[18px] font-extrabold">{m.title}</h2>
          <div className="mb-4 text-[12px] text-[#6b6b63]">✍ {m.author} · {m.date} · 번호 {m.id}</div>
          <div className="whitespace-pre-wrap text-[14px] leading-[1.7]">{m.body}</div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setView("list")} className="rounded-lg border border-[#e6e2d6] bg-white px-4 py-2 text-[13px]">목록</button>
            <button onClick={() => del(m.id)} className="rounded-lg border border-[#f0c0b8] bg-white px-4 py-2 text-[13px] text-[#c0392b]">삭제</button>
          </div>
        </Card>
      </>
    );
  }
  return (
    <>
      <Head title="📝 관리자 메모" desc="운영 메모 게시판 (네이버 카페형) — 목록·작성·상세·삭제" />
      <Card>
        <div className="mb-3.5 flex items-center">
          <h2 className="text-[15px] font-extrabold">운영 메모 ({memos.length}개)</h2>
          <button onClick={() => setView("new")} className="ml-auto rounded-lg bg-[#1a3a66] px-4 py-2 text-[13px] font-semibold text-white">✏ 새 글 쓰기</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#e6e2d6]">
          <table className="w-full border-collapse text-[13px]">
            <thead><tr>
              <th className="w-[60px] bg-[#1a3a66] px-3.5 py-2.5 text-left text-white">번호</th>
              <th className="bg-[#1a3a66] px-3.5 py-2.5 text-left text-white">제목</th>
              <th className="w-[130px] bg-[#1a3a66] px-3.5 py-2.5 text-left text-white">작성일</th>
            </tr></thead>
            <tbody>
              {memos.slice().sort((a, b) => b.id - a.id).map((m) => (
                <tr key={m.id} onClick={() => setView(m.id)} className="cursor-pointer hover:bg-[#f9fbff]">
                  <td className="border-b border-[#e6e2d6] px-3.5 py-2.5 text-center font-mono text-[#6b6b63]">{m.id}</td>
                  <td className="border-b border-[#e6e2d6] px-3.5 py-2.5">{m.title}</td>
                  <td className="border-b border-[#e6e2d6] px-3.5 py-2.5">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
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
