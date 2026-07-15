// components/CapabilitiesSection.tsx
// 홈 맨 아래 "Studio Capabilities" 섹션.
// capabilities 테이블(활성 항목)을 읽어오고, DB가 아직 없거나 비어 있으면
// 아래 FALLBACK 목록으로 그대로 렌더된다 → 커밋하면 바로 화면에 보임.

type Category = "engine_video" | "engine_image" | "tool" | "effect";
type Capability = { category: Category; name: string; sort_order: number };

const mk = (category: Category, names: string[]): Capability[] =>
  names.map((name, i) => ({ category, name, sort_order: (i + 1) * 10 }));

const FALLBACK: Capability[] = [
  ...mk("engine_video", [
    "Veo 3.1", "Veo 3", "Veo 3 Fast", "Sora 2", "Kling 3.0", "Kling 2.6 Pro",
    "Kling 2.5", "Kling O1", "Runway Gen-4.5", "Runway", "Seedance 2.0",
    "Seedance", "Vidu Q3", "Hailuo AI", "Dreamina 3.0", "Pika 2.2", "Pixverse V6",
  ]),
  ...mk("engine_image", [
    "Nano Banana Pro", "Nano Banana 2", "Nano Banana", "FLUX", "Imagen",
    "GPT Image 2", "GPT Image 1.5", "GPT-4o", "Qwen Image", "Seedream 5.0",
    "Seedream 4.5", "Seedream 4.0", "Dreamina", "Grok-2", "Recraft V4 Vector",
  ]),
  ...mk("tool", [
    "립싱크", "다국어 자막·번역", "화질 업스케일", "영상·사진 복원", "배경 제거·합성",
    "프레임 확장 (아웃페인팅)", "모션 트랜스퍼", "워터마크·자막 제거", "이미지 리터칭", "애니메이션 변환",
  ]),
  ...mk("effect", ["시네마틱 그레이딩", "슬로우모션", "트랜지션", "라이트 FX", "필름 그레인"]),
];

async function getCapabilities(): Promise<Capability[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK; // DB 미연결 → 기본 목록
  try {
    const res = await fetch(
      `${url}/rest/v1/capabilities?is_active=eq.true&select=category,name,sort_order&order=category,sort_order`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } }
    );
    if (!res.ok) return FALLBACK;
    const rows = (await res.json()) as Capability[];
    return rows.length ? rows : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

const by = (list: Capability[], c: Category) =>
  list.filter((x) => x.category === c).sort((a, b) => a.sort_order - b.sort_order);

function Labels({ items, dim = false }: { items: Capability[]; dim?: boolean }) {
  return (
    <div className="flex flex-wrap gap-y-4">
      {items.map((it) => (
        <span
          key={it.category + it.name}
          className={`border-l border-white/10 px-4 first:border-l-0 first:pl-0 font-mono text-sm leading-none transition-colors ${
            dim ? "text-[#6E6E70]" : "text-[#A7A7A7] hover:text-[#8FB7FF]"
          }`}
        >
          {it.name}
        </span>
      ))}
    </div>
  );
}

function BlockHead({ title, count, quiet = false }: { title: string; count?: string; quiet?: boolean }) {
  return (
    <div className={`mb-[22px] flex items-baseline gap-3 border-b pb-[13px] ${quiet ? "border-white/[0.07]" : "border-white/10"}`}>
      <b className={`font-bold uppercase tracking-[0.06em] ${quiet ? "text-xs text-[#A7A7A7]" : "text-sm text-[#F4F1EA]"}`}>
        {title}
      </b>
      {count && <span className="font-mono text-[11px] tracking-[0.1em] text-[#6E6E70]">{count}</span>}
    </div>
  );
}

export default async function CapabilitiesSection() {
  const list = await getCapabilities();
  const video = by(list, "engine_video");
  const image = by(list, "engine_image");
  const tools = by(list, "tool");
  const effects = by(list, "effect");

  return (
    <section id="capabilities" className="relative z-[2] border-t border-white/[0.07] px-6 py-28">
      <div className="mx-auto max-w-[1180px]">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-[#8FB7FF]">
          Studio Capabilities
        </p>
        <h2 className="max-w-[720px] text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.24] tracking-[-0.04em] text-[#F4F1EA] [word-break:keep-all]">
          하나의 툴에 머물지 않습니다.
          <br />
          <span className="text-[#8FB7FF]">30여 개</span>의 AI 영상·이미지 엔진을 실무에서 다룹니다.
        </h2>
        <p className="mt-5 max-w-[620px] text-[15px] leading-[1.75] text-[#A7A7A7] [word-break:keep-all]">
          엔진마다 잘하는 장면이 다릅니다. KKOKKA는 프로젝트의 목적과 톤에 맞는 엔진을 골라, 조합하고 디렉팅합니다.
        </p>

        {/* Tier 1 · Engines */}
        <div className="mt-14 grid grid-cols-1 gap-[52px] md:grid-cols-2">
          <div>
            <BlockHead title="Video Engines" count={`${video.length} models`} />
            <Labels items={video} />
          </div>
          <div>
            <BlockHead title="Image Engines" count={`${image.length} models`} />
            <Labels items={image} />
          </div>
        </div>

        {/* Tier 2 · Tools */}
        <div className="mt-16">
          <BlockHead title="Production Tools" count="후반 작업 범위" />
          <Labels items={tools} />
        </div>

        {/* Tier 3 · Effects */}
        <div className="mt-14">
          <BlockHead title="Effects" quiet />
          <Labels items={effects} dim />
        </div>

        <p className="mt-14 max-w-[720px] border-t border-white/[0.07] pt-[22px] font-mono text-[11px] leading-[1.7] tracking-[0.06em] text-[#6E6E70] [word-break:keep-all]">
          엔진과 도구 라인업은 발전 속도에 맞춰 지속적으로 업데이트됩니다. 프로젝트별 최적 조합은 브리핑 단계에서 함께 결정합니다.
        </p>
      </div>
    </section>
  );
}
