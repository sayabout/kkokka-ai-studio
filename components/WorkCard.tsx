import Link from "next/link";

export type Work = {
  code: string;
  year: string;
  category: string;
  title: string;
  tint: string; // t-blue, t-steel, ...
  live?: boolean;
  href?: string;
};

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      href={work.href || "/works/preview"}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.11] bg-char2 transition hover:-translate-y-1 hover:border-[rgba(143,183,255,0.34)]"
    >
      <div className={`absolute inset-0 ${work.tint}`} />
      <div className="kk-fx-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.15] via-black/[0.05] to-black/[0.86]" />

      <div className="absolute left-3.5 top-3.5 h-[22px] w-[22px] border-l-[1.5px] border-t-[1.5px] border-[rgba(143,183,255,0.5)]" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[11px] tracking-[0.08em] text-[rgba(244,241,234,0.7)]">
        <span>{work.code} · {work.year}</span>
        {work.live && (
          <span className="flex items-center gap-1.5 text-ice">
            <span className="kk-dot" style={{ width: 6, height: 6 }} /> LIVE
          </span>
        )}
      </div>

      <div className="absolute inset-x-[18px] bottom-[18px]">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ice">{work.category}</div>
        <h4 className="text-[18px] font-semibold leading-tight tracking-[-0.02em] text-offwhite">{work.title}</h4>
      </div>
    </Link>
  );
}
