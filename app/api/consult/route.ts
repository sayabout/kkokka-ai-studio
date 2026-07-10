import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/hash";

// ─────────────────────────────────────────────
// 꼬까AI 상담 서버 (OpenAI 호출 + 대화 저장 + 문의목록 자동등록)
// ★ API 키는 이 서버 파일에서만 사용. 화면에는 절대 노출 안 됨.
// ─────────────────────────────────────────────

const MAX_TURNS = 10; // 하드 상한 (비용/악용 방어)

const SYSTEM_PROMPT = `너는 'KKOKKA.AI STUDIO'의 AI 영상 상담 도우미 '꼬까AI'야.
너의 목적은 방문자가 원하는 영상의 '방향'을 함께 그려주고, 8개 카테고리 중 어디에 해당하는지 자연스럽게 정리해주는 것이다. 완벽한 견적/상담이 아니라 '맛보기 디렉팅'이다.

[대화 방식]
- 먼저 방문자의 이야기를 끌어낸다. AI가 먼저 다 정하지 말 것.
- "아~ 회사용이시군요! 어떤 모습을 원하는지 자유롭게 써보세요" 처럼 공감하며 질문한다.
- 방문자가 원하는 걸 말하면, 무드에 공감하고 방향(길이/가로세로/무드/카테고리)을 부드럽게 제안한다.
- 카테고리는 '확정'이 아니라 '추측+확인'으로. ("AI Brand Film 쪽으로 보이는데, 맞을까요?")

[8개 카테고리]
1) AI Brand Film (브랜드 무드·세계관, 가로)
2) AI Public Campaign (공공·캠페인, 가로)
3) AI Short-form Ads (SNS·숏폼, 세로)
4) AI Product Visual (제품·쇼핑몰, 가로)
5) AI Avatar & Explainer (인물·설명·교육, 가로)
6) AI Animation & Character (캐릭터·애니, 가로)
7) AI Pre-visualization (콘티·프리비주얼, 세로)
8) AI Content Package (여러 편 묶음)

[반드시 지킬 선]
- 견적 금액을 말하지 않는다. ("예산은 상담 후 안내드려요")
- "무조건 됩니다" 같은 확답을 하지 않는다.
- 영상 제작과 무관한 잡담은 정중히 거절한다. ("영상 문의만 도와드려요")
- 3~4번 대화가 오가면, 자연스럽게 아래 폼으로 안내한다:
  "정확한 디렉팅은 상담에서 완성돼요. 아래 '제작 문의하기'로 남겨주시면 제가 정리한 내용까지 담당자에게 전달돼요!"
- 답변은 3~4문장 이내로 짧고 친근하게. 이모지는 최소한만.`;

// 대화 내용에서 카테고리 추출 (간단 키워드 매칭)
function guessCategory(text: string): string {
  const t = text.toLowerCase();
  if (/(숏폼|쇼츠|릴스|틱톡|sns|세로|short)/.test(t)) return "숏폼 광고";
  if (/(공공|기관|캠페인|정부|지자체|public)/.test(t)) return "공공 캠페인";
  if (/(제품|상품|쇼핑몰|product)/.test(t)) return "제품 비주얼";
  if (/(아바타|설명|교육|강의|avatar|explain)/.test(t)) return "아바타·설명";
  if (/(캐릭터|애니|animation|character)/.test(t)) return "애니·캐릭터";
  if (/(콘티|프리비주얼|스토리보드|previs)/.test(t)) return "프리비주얼";
  if (/(패키지|묶음|여러|package)/.test(t)) return "콘텐츠 패키지";
  return "브랜드 필름";
}

export async function POST(req: Request) {
  try {
    const { messages, visitorName, company, phone, savedRef } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
    }

    const userTurns = messages.filter((m: any) => m.role === "user").length;
    if (userTurns > MAX_TURNS) {
      return NextResponse.json({
        ok: true,
        reply: "오늘 이 데모에서 나눌 수 있는 대화는 여기까지예요 🙏 이어서는 아래 '제작 문의하기'로 도와드릴게요!",
        done: true,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "AI 설정이 필요합니다." }, { status: 500 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!openaiRes.ok) {
      return NextResponse.json({ ok: false, error: "AI 응답에 실패했어요. 잠시 후 다시 시도해주세요." }, { status: 502 });
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "죄송해요, 다시 한 번 말씀해주시겠어요?";

    const fullMessages = [...messages, { role: "assistant", content: reply }];
    let newRef = savedRef || null;

    // ── 2턴 이상 & 아직 미등록이면 → inquiries 공개목록에 자동 등록 (딱 한 번) ──
    if (userTurns >= 2 && !savedRef) {
      try {
        const supabase = createAdminClient();

        // 방문자 발화 모아서 카테고리 추정
        const userText = messages.filter((m: any) => m.role === "user").map((m: any) => m.content).join(" ");
        const category = guessCategory(userText);

        // 비번 = 전화번호 뒤 4자리 (없으면 0000)
        const digits = String(phone || "").replace(/\D/g, "");
        const pw = digits.length >= 4 ? digits.slice(-4) : "0000";

        // 대화 원본을 읽기 좋게 정리 (관리자 상세에서 봄)
        const transcript = fullMessages
          .map((m: any) => (m.role === "user" ? "고객: " : "꼬까AI: ") + m.content)
          .join("\n\n");

        const { data: inserted } = await supabase.from("inquiries").insert({
          title: `🤖 AI 영상 상담 (${category})`,
          name: company || "AI 상담 고객",
          email: "ai-consult@kkokka.ai",
          company_name: company || null,
          phone: phone || null,
          message: `[꼬까AI 상담 자동 등록]\n연락처: ${phone || "-"}\n추정 카테고리: ${category}\n\n──── 대화 원본 ────\n${transcript}`,
          password_hash: hashPassword(pw),
          agree_privacy: true,
          status: "new",
          source: "ai_consult",
        }).select("id, ref_no").single();

        newRef = inserted?.ref_no || "saved";
      } catch {
        // 등록 실패해도 대화는 계속
      }
    }

    // 대화 원본은 별도 테이블에도 계속 저장 (백업)
    try {
      if (userTurns >= 2) {
        const supabase = createAdminClient();
        await supabase.from("ai_consultations").insert({
          visitor_name: visitorName || null,
          messages: fullMessages,
          turn_count: userTurns,
        });
      }
    } catch {}

    return NextResponse.json({ ok: true, reply, done: userTurns >= MAX_TURNS, savedRef: newRef });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "서버 오류" }, { status: 500 });
  }
}