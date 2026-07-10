"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "안녕하세요, 꼬까AI입니다 🎬\n\n어떤 영상을 만들고 싶으신지 편하게 말씀해주세요!";

export default function ConsultPage() {
  // ── 대화 상태 ──
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [savedRef, setSavedRef] = useState<string | null>(null);

  // ── 동의 게이트 상태 ──
  const [agreed, setAgreed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canEnter = company.trim().length >= 2 && phone.trim().length >= 8 && agree;
  const visitorName = `${company.trim()} / ${phone.trim()}`;

  function handleSend() {
    const text = input.trim();
    if (!text || loading || done) return;

    if (!agreed) {
      setPendingText(text);
      setInput("");
      setShowGate(true);
      return;
    }
    setInput("");
    sendToAI(text);
  }

  function confirmGate() {
    if (!canEnter) return;
    setAgreed(true);
    setShowGate(false);
    if (pendingText) {
      sendToAI(pendingText);
      setPendingText("");
    }
  }

  async function sendToAI(text: string) {
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          visitorName,
          company: company.trim(),
          phone: phone.trim(),
          savedRef,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages([...next, { role: "assistant", content: data.reply }]);
        if (data.savedRef) setSavedRef(data.savedRef);
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

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-10 text-black">
      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[720px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8FB7FF]" />
            <strong className="text-[15px] font-semibold">꼬까AI 상담</strong>
            {agreed && <span className="text-[12px] text-black/40">{company.trim()}님</span>}
          </div>
          <Link href="/" className="text-[13px] text-black/40 hover:text-black">닫기 ✕</Link>
        </div>

        {/* 대화 영역 */}
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

        {/* 대화 종료 시 폼 안내 */}
        {done && (
          <div className="border-t border-black/10 bg-[#F8FAFF] px-6 py-4 text-center">
            <p className="mb-3 text-[14px] text-black/60">더 정확한 디렉팅은 문의에서 완성돼요.</p>
            <Link href="/contact" className="inline-flex items-center rounded-full bg-[#050505] px-6 py-3 text-[14px] font-semibold text-white">
              제작 문의하기 →
            </Link>
          </div>
        )}

        {/* 입력창 (ChatGPT 스타일) */}
        {!done && (
          <div className="border-t border-black/10 p-4">
            <div className="flex items-center gap-2 rounded-full border border-black/12 bg-white px-2 py-1.5 focus-within:border-[#8FB7FF]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="어떤 영상을 만들고 싶으세요?"
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[14.5px] outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="보내기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#050505] text-white transition hover:bg-[#8FB7FF] hover:text-black disabled:opacity-25"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[11.5px] text-black/35">
              본 상담은 한정적 AI로 진행됩니다. 정확한 견적·상담은 제작 문의를 이용해 주세요.
            </p>
            <p className="mt-1 px-1 text-center text-[12px]">
              <Link href="/contact" className="font-medium text-[#3b6fd4] underline">
                일반 문의 바로가기 →
              </Link>
            </p>
          </div>
        )}

        {/* ── 동의 팝업 (첫 질문 전송 시) ── */}
        {showGate && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[420px] rounded-3xl bg-white p-7 shadow-2xl">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8FB7FF]" />
                <strong className="text-[16px] font-semibold">상담을 시작할게요</strong>
              </div>
              <p className="mb-5 text-[13.5px] leading-[1.6] text-black/55">
                더 정확한 상담을 위해 아래 정보를 남겨주세요.
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
                  <span className="text-black/45">(수집: 회사명·연락처 / 목적: AI 영상 상담 / 상담 종료 후 파기)</span>
                </span>
              </label>

              <button
                onClick={confirmGate}
                disabled={!canEnter}
                className="w-full rounded-xl bg-[#050505] py-3.5 text-[14.5px] font-semibold text-white transition disabled:opacity-30"
              >
                네, 상담 시작할게요
              </button>

              <div className="mt-4 text-center text-[12.5px] text-black/45">
                정보 입력이 부담되시면{" "}
                <Link href="/contact" className="font-medium text-[#3b6fd4] underline">일반 문의하기</Link>
                로 남겨주세요.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
