"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const TYPES = ["Public Campaign", "Brand Film", "Short-form Ads", "Product Visual", "Pre-visual", "AI World-building"];

export default function ContactPage() {
  const [picked, setPicked] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "AI 제작 문의 드립니다", name: "", email: "", company: "", budget: "", timeline: "", refs: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg("이름, 이메일, 프로젝트 설명은 필수입니다.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        title: form.title || "AI 제작 문의 드립니다",
        name: form.name,
        email: form.email,
        company_name: form.company || null,
        budget_range: form.budget || null,
        timeline: form.timeline || null,
        reference_links: form.refs || null,
        message: form.message,
        project_types: picked.length ? picked : null,
        agree_privacy: true,
        status: "new",
      });
      if (error) throw error;

      fetch("/api/notify-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, project_types: picked }),
      }).catch(() => {});

      setStatus("done");
    } catch (e: any) {
      setErrMsg(e?.message || "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <>
        <Header />
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-8">
          <div className="kk-stage"><div className="kk-grid" /><div className="kk-sweep" /></div>
          <div className="relative z-[4] max-w-[520px] text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(143,183,255,0.5)] text-[28px] text-ice">&#10003;</div>
            <h1 className="text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.03em]">문의가 접수되었습니다.</h1>
            <p className="mt-5 text-[16px] leading-[1.8] text-gray [word-break:keep-all]">
              보통 24시간 이내에 회신드립니다. 답변과 견적은 이후 Google 로그인으로 확인하실 수 있게 준비 중입니다.
            </p>
            <a href="/" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/[0.11] px-[26px] text-[14px] font-semibold text-offwhite hover:border-[rgba(143,183,255,0.34)] hover:text-ice">
              홈으로 돌아가기
            </a>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="relative overflow-hidden border-b border-white/[0.11] pb-[70px] pt-[170px]">
        <div className="kk-stage opacity-60"><div className="kk-grid" /></div>
        <div className="relative z-[2] mx-auto max-w-[1240px] px-8">
          <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.2em] text-ice">04 / Contact</div>
          <h1 className="font-display text-[clamp(46px,7vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">Got an idea?</h1>
          <p className="mt-6 max-w-[600px] text-[16px] leading-[1.75] text-gray [word-break:keep-all]">상상만 가져와 주세요. 장면은 우리가 디렉팅합니다. 목적에 맞는 형식부터 함께 설계합니다.</p>
        </div>
      </section>

      <section className="px-8 py-[100px]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 rounded-xl border border-[rgba(143,183,255,0.28)] bg-[rgba(143,183,255,0.06)] p-4 text-[13px] leading-[1.7] text-gray [word-break:keep-all]">
              🔒 <span className="text-offwhite">제작문의 글 및 답변글은 본인만 볼 수 있습니다.</span> 목록에는 제목만 표시되니, 회사명 등 민감한 정보는 제목에 넣지 말아주세요.
            </div>
            <Field label="제목"><input className="kk-input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="AI 제작 문의 드립니다" /></Field>
            <Field label="이름" required><input className="kk-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="담당자 이름" /></Field>
            <Field label="이메일" required><input className="kk-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" /></Field>
            <Field label="회사 / 브랜드"><input className="kk-input" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="회사명 또는 브랜드" /></Field>
            <Field label="프로젝트 유형 (복수 선택 가능)">
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => {
                  const on = picked.includes(t);
                  return (
                    <button key={t} type="button" onClick={() => toggle(t)}
                      className={\`rounded-full border px-[15px] py-[9px] text-[13px] transition \${on ? "border-ice bg-ice text-black" : "border-white/[0.11] text-gray hover:border-[rgba(143,183,255,0.34)] hover:text-offwhite"}\`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="예산 범위"><input className="kk-input" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="예: 500만원 ~ 1,000만원" /></Field>
              <Field label="희망 일정"><input className="kk-input" value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="예: 2026년 3월 중" /></Field>
            </div>
            <Field label="참고 링크"><input className="kk-input" value={form.refs} onChange={(e) => set("refs", e.target.value)} placeholder="참고할 영상·자료 링크 (선택)" /></Field>
            <Field label="프로젝트 설명" required>
              <textarea className="kk-input min-h-[140px] resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="목적, 타깃, 활용 채널 등을 자유롭게 적어주세요." />
            </Field>

            {status === "error" && <p className="mb-3 text-[13px] text-[#ff9b9b]">&#9888; {errMsg}</p>}

            <button type="button" disabled={status === "sending"} onClick={submit}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-ice px-[26px] text-[14px] font-semibold text-black transition hover:-translate-y-0.5 disabled:opacity-60">
              {status === "sending" ? "보내는 중..." : "제작 문의 보내기 →"}
            </button>
            <p className="mt-3.5 font-mono text-[12px] text-gray-dark">※ 접수 후 보통 24시간 이내 회신드립니다. 답변·견적 확인은 추후 Google 로그인으로 제공됩니다.</p>
          </div>

          <div>
            <InfoCard k="Response Time" v="보통 24시간 이내" sub="평일 기준 24시간 안에 답신드리며, 미팅 일정은 1주 안에 잡습니다." />
            <InfoCard k="Available Slots" v="2026 신규 프로젝트 가능" sub="긴급 건은 별도 문의로 조율합니다." />
            <InfoCard k="Studio" v="Seoul · KR" sub="KKOKKA.AI STUDIO by SAYABOUT" />
          </div>
        </div>
      </section>

      <PublicInquiryList />

      <Footer />

      <style>{\`
        .kk-input{width:100%;background:var(--char);border:1px solid var(--line);border-radius:12px;padding:15px 16px;color:var(--white);font-family:inherit;font-size:15px;transition:.2s}
        .kk-input:focus{outline:none;border-color:var(--line-ice);box-shadow:0 0 0 3px rgba(143,183,255,.12)}
        .kk-input::placeholder{color:var(--gray-d)}
      \`}</style>
    </>
  );
}

function PublicInquiryList() {
  const [rows, setRows] = useState<{ id: number; title: string; status: string; created_at: string }[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("inquiries_public")
          .select("id,title,status,created_at")
          .order("created_at", { ascending: false })
          .limit(20);
        if (data) setRows(data as any);
      } catch { /* 무시 */ }
    })();
  }, []);

  const label: Record<string, string> = { new: "접수", reviewing: "검토중", quoted: "견적발송", in_progress: "진행중", closed: "완료", spam: "-" };

  return (
    <section className="px-8 pb-[100px]">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-5 flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ice">
          <span className="h-[7px] w-[7px] border border-ice" /> Inquiry Board
        </div>
        <p className="mb-6 text-[14px] text-gray [word-break:keep-all]">
          🔒 제작문의 글 및 답변글은 <span className="text-offwhite">본인만 볼 수 있습니다.</span> 목록에는 제목만 표시됩니다.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.11]">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-white/[0.04] text-left font-mono text-[12px] uppercase tracking-[0.08em] text-gray">
                <th className="w-[70px] px-5 py-3.5">No</th>
                <th className="px-5 py-3.5">제목</th>
                <th className="w-[110px] px-5 py-3.5">상태</th>
                <th className="w-[130px] px-5 py-3.5">접수일</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((r) => (
                <tr key={r.id} className="border-t border-white/[0.07]">
                  <td className="px-5 py-3.5 font-mono text-gray-dark">{r.id}</td>
                  <td className="px-5 py-3.5 text-offwhite">🔒 {r.title}</td>
                  <td className="px-5 py-3.5"><span className="rounded-full border border-[rgba(143,183,255,0.34)] px-2.5 py-0.5 font-mono text-[11px] text-ice">{label[r.status] || r.status}</span></td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-gray">{(r.created_at || "").slice(0, 10)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-gray-dark">아직 등록된 문의가 없습니다. 첫 문의를 남겨보세요.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-[22px]">
      <label className="mb-2.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-gray">
        {label} {required && <em className="not-italic text-ice">*</em>}
      </label>
      {children}
    </div>
  );
}

function InfoCard({ k, v, sub }: { k: string; v?: string; sub: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-white/[0.11] bg-white/[0.045] p-[26px]">
      <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ice">{k}</div>
      {v && <div className="text-[16px] leading-[1.6]">{v}</div>}
      <div className={\`text-[14px] leading-[1.6] text-gray \${v ? "mt-2" : ""}\`}>{sub}</div>
    </div>
  );
}
