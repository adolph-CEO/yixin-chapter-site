/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export type Tile = { href: string; label: string; en: string; desc: string; image?: string; count?: string };

/** 首頁三大區塊：藏紅底；桌機三欄，手機改成橫向滑動的矮卡片 */
export default function SectionTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="relative z-0 bg-accent">
      <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {tiles.map((t, i) => (
          <Link key={t.href} href={t.href}
            className="group relative shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start h-[210px] md:h-[308px] overflow-hidden border-r border-white/15">
            {t.image ? (
              <>
                <img src={t.image} alt="" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#7f1b2d]/95 via-[#a3243b]/60 to-[#a3243b]/20" />
              </>
            ) : (
              <div aria-hidden className="absolute inset-0 transition duration-700 group-hover:bg-accent-deep"
                style={{ background: "repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 2px, transparent 2px 14px)" }} />
            )}
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-white">
              <div className="num text-white/60 text-xs md:text-sm tracking-widest">{String(i + 1).padStart(2, "0")}</div>
              <div className="flex items-baseline gap-3 mt-1">
                <h2 className="headline text-3xl md:text-4xl">{t.label}</h2>
                <span className="eyebrow text-white/65">{t.en}</span>
              </div>
              <p className="mt-2 text-xs md:text-sm text-white/85 leading-6 max-w-xs line-clamp-2">{t.desc}</p>
              <div className="mt-3 md:mt-4 flex items-center justify-between text-xs tracking-[0.2em] font-bold">
                <span className="border-b border-white pb-1 group-hover:border-white/60 transition">進入{t.label} →</span>
                {t.count && <span className="num text-white/60">{t.count}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
