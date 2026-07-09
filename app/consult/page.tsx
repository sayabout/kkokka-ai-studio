"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "안녕하세요, 꼬까AI입니다 🎬\n\n편하게, 어떤 영상을 만들고 싶으신지 말씀해주세요!";

export default function ConsultPage() {
  // ── 입장 게이트 상태 ──
  const [entered, setEntered] = useState(false);
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  // ── 대화 상태 ──
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canEnter = company.trim().length >= 2 && phone.trim().length >= 8 && agree;
  const visitorName = `${company.trim()} / ${phone.trim()}`;

  async function send() {
    const text = input.trim();
    if (!text || loading || done) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          visitorName,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages([...next, { role: "assistant", content: data.reply }]);
        if (data.done) setDone(true);
      } else {
        setMessages([...next, { role: "assistant", content: data.error || "잠시 후 다시 시도해주세요." }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  // 입장 화면 (신원 + 동의)
  if (!entered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10">
        <div className="w-full max-w-[440px] rounded-3xl bg-white p-8 text-black shadow-2xl">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8FB7FF]" />
            <strong className="text-[16px] font-semibold">꼬까AI 상담 시작하기</strong>
          </div>
          <p className="mb-6 text-[13.5px] leading-[1.6] text-black/55">
            AI가 영상 방향을 함께 그려드려요. 원활한 상담을 위해 아래 정보를 남겨주세요.
          </p>

          <label className="mb-1.5 block text-[13px] font-medium text-black/70">회사명 / 기관명 *</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="예: 세이어바웃"
            className="mb-4 w-full rounded-xl border border-black/12 px-4 py-3 text-[14.5px] outline-none focus:border-[#8FB7FF]"
          />

          <label className="mb-1.5 block text-[13px] font-medium text-black/70">연락처 *</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 010-0000-0000"
            inputMode="tel"
            className="mb-4 w-full rounded-xl border border-black/12 px-4 py-3 text-[14.5px] outline-none focus:border-[#8FB7FF]"
          />

          <label className="mb-5 flex items-start gap-2.5 text-[13px] leading-[1.55] text-black/70">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#8FB7FF]"
            />
            <span>
              개인정보 수집·이용에 동의합니다.
              <br />
              <span className="text-black/45">
                (수집: 회사명·연락처 / 목적: AI 영상 상담 / 상담 종료 후 파기)
              </span>
            </span>
          </label>

          <button
            onClick={() => canEnter && setEntered(true)}
            disabled={!canEnter}
            className="w-full rounded-xl bg-[#050505] py-3.5 text-[14.5px] font-semibold text-white transition disabled:opacity-30"
          >
            상담 시작
          </button>

          <div className="mt-5 border-t border-black/8 pt-4 text-center text-[12.5px] text-black/45">
            정보 입력이 부담되시면{" "}
            <Link href="/contact" className="font-medium text-[#3b6fd4] underline">
              일반 문의하기
            </Link>
            로 남겨주세요.
          </div>
        </div>
      </div>
    );
  }

  // 대화 화면
  return (
    <div className="min-h-screen bg-[#050505] px-4 py-10 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[720px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8FB7FF]" />
            <strong className="text-[15px] font-semibold">꼬까AI 상담</strong>
            <span className="text-[12px] text-black/40">{company.trim()}님</span>
          </div>
          <Link href="/" className="text-[13px] text-black/40 hover:text-black">닫기 ✕</Link>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  "max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14.5px] leading-[1.6] " +
                  (m.role === "user" ? "bg-[#050505] text-white" : "bg-[#F1F3F7] text-black")
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[#F1F3F7] px-4 py-3 text-[14px] text-black/40">꼬까AI가 입력 중…</div>
            </div>
          )}
        </div>

        {done && (
          <div className="border-t border-black/10 bg-[#F8FAFF] px-6 py-4 text-center">
            <p className="mb-3 text-[14px] text-black/60">더 정확한 디렉팅은 문의에서 완성돼요.</p>
            <Link href="/contact" className="inline-flex items-center rounded-full bg-[#050505] px-6 py-3 text-[14px] font-semibold text-white">
              제작 문의하기 →
            </Link>
          </div>
        )}

        {!done && (
          <div className="border-t border-black/10 p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-black/12 bg-white p-2 focus-within:border-[#8FB7FF]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder="어떤 영상을 만들고 싶으세요?"
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[14.5px] outline-none"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[#050505] px-4 py-2.5 text-[14px] font-semibold text-white disabled:opacity-30"
              >
                보내기
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[11.5px] text-black/35">
              본 상담은 맛보기 데모예요. 정확한 견적·상담은 제작 문의로 진행됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}