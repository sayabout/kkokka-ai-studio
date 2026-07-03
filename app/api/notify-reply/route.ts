import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, ref_no, title } = await req.json();
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !email) return NextResponse.json({ ok: true, mailed: false });

    const origin = new URL(req.url).origin;
    const html = `
      <div style="font-family:sans-serif;line-height:1.7;color:#222">
        <h2 style="color:#1a3a66">문의하신 건에 답변이 등록되었습니다</h2>
        <p>문의번호 <b>${ref_no || ""}</b> · ${title || ""}</p>
        <p>아래 링크에서 <b>글 작성 시 설정한 비밀번호</b>로 답변을 확인하실 수 있습니다.</p>
        <p><a href="${origin}/contact" style="display:inline-block;background:#1a3a66;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">답변 확인하기</a></p>
        <p style="color:#888;font-size:12px;margin-top:18px">KKOKKA.AI STUDIO</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "KKOKKA.AI STUDIO <onboarding@resend.dev>",
        to: [email],
        subject: `[KKOKKA.AI] ${ref_no || ""} 답변이 등록되었습니다`,
        html,
      }),
    });
    return NextResponse.json({ ok: true, mailed: res.ok });
  } catch (e: any) {
    return NextResponse.json({ ok: true, mailed: false, reason: e?.message });
  }
}
