import { NextResponse } from "next/server";

/*
  새 문의 알림 메일 발송 API
  - Contact 폼 제출 시 호출됨
  - Resend(https://resend.com) 사용. RESEND_API_KEY 환경변수가 있으면 발송.
  - 키가 없으면 조용히 건너뜀 (문의 저장 자체는 이미 성공 상태이므로 사이트 영향 없음)
  - 받는 사람: NOTIFY_EMAIL 환경변수 (없으면 sayabout.corp@gmail.com)
*/

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFY_EMAIL || "sayabout.corp@gmail.com";

    // 키가 없으면 메일 발송은 생략 (에러 아님)
    if (!apiKey) {
      return NextResponse.json({ ok: true, mailed: false, reason: "no RESEND_API_KEY" });
    }

    const types = Array.isArray(body.project_types) && body.project_types.length
      ? body.project_types.join(", ")
      : "(선택 안 함)";

    const html = `
      <div style="font-family:sans-serif;line-height:1.7;color:#222">
        <h2 style="color:#1a3a66">새 제작 문의가 접수되었습니다</h2>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 12px;color:#888">이름</td><td style="padding:6px 12px">${esc(body.name)}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">이메일</td><td style="padding:6px 12px">${esc(body.email)}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">회사/브랜드</td><td style="padding:6px 12px">${esc(body.company) || "-"}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">프로젝트 유형</td><td style="padding:6px 12px">${esc(types)}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">예산</td><td style="padding:6px 12px">${esc(body.budget) || "-"}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">일정</td><td style="padding:6px 12px">${esc(body.timeline) || "-"}</td></tr>
          <tr><td style="padding:6px 12px;color:#888">참고 링크</td><td style="padding:6px 12px">${esc(body.refs) || "-"}</td></tr>
        </table>
        <h3 style="color:#1a3a66;margin-top:18px">문의 내용</h3>
        <p style="white-space:pre-wrap;background:#f6f6f4;padding:14px;border-radius:8px">${esc(body.message)}</p>
        <p style="color:#888;font-size:12px;margin-top:18px">KKOKKA.AI STUDIO 관리자에서 확인하세요.</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "KKOKKA.AI STUDIO <onboarding@resend.dev>",
        to: [to],
        reply_to: body.email,
        subject: `[제작문의] ${body.title || body.name}${body.company ? " · " + body.company : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ ok: true, mailed: false, reason: t }, { status: 200 });
    }
    return NextResponse.json({ ok: true, mailed: true });
  } catch (e: any) {
    // 메일 실패가 사용자 경험을 막지 않도록 200으로 응답
    return NextResponse.json({ ok: true, mailed: false, reason: e?.message }, { status: 200 });
  }
}

function esc(s: any) {
  return String(s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
