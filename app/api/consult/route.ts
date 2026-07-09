import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ─────────────────────────────────────────────
// 꼬까AI 상담 서버 (OpenAI 호출 + 대화 저장)
// ★ API 키는 이 서버 파일에서만 사용. 화면에는 절대 노출 안 됨.
// ─────────────────────────────────────────────

const MAX_TURNS = 10; // 하드 상한 (비용/악용 방어)

// 꼬까AI의 역할 지시문 (System Prompt)
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

export async function POST(req: Request) {
  try {
    const { messages, visitorName } = await req.json();

    // 입력 검증
    if (!Array.isArray(messages)) {
      return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
    }

    // 턴 제한 (user 메시지 개수 기준)
    const userTurns = messages.filter((m: any) => m.role === "user").length;
    if (userTurns > MAX_TURNS) {
      return NextResponse.json({
        ok: true,
        reply: "오늘 이 데모에서 나눌 수 있는 대화는 여기까지예요 🙏 이어서는 아래 '제작 문의하기'로 도와드릴게요!",
        done: true,
      });
    }

    // OpenAI 호출 (키는 서버 환경변수에서만)
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
        model: "gpt-4o-mini", // 저렴하고 빠른 모델
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

    // 대화가 어느 정도 진행되면(2턴 이상) 원본 저장
    try {
      if (userTurns >= 2) {
        const supabase = createAdminClient();
        const fullMessages = [...messages, { role: "assistant", content: reply }];
        await supabase.from("ai_consultations").insert({
          visitor_name: visitorName || null,
          messages: fullMessages,
          turn_count: userTurns,
        });
      }
    } catch {
      // 저장 실패해도 대화는 계속 (사용자 경험 우선)
    }

    return NextResponse.json({ ok: true, reply, done: userTurns >= MAX_TURNS });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "서버 오류" }, { status: 500 });
  }
}