import Link from "next/link";
import Img from "./Img";

export type Tile = { href: string; label: string; en: string; desc: string; image?: string; count?: string };

/** 首頁三大區塊：桌機三欄；手機改成橫向滑動的矮卡片，避免三張高圖一路往下疊 */
export default function SectionTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="bg-dark">
      <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {tiles.map((t, i) => (
          <Link key={t.href} href={t.href}
            className="group relative shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start h-[300px] md:h-[440px] overflow-hidden border-r border-white/10">
            <Img src={t.image} alt={t.label} dark className="absolute inset-0 w-full h-full transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13244a]/95 via-[#13244a]/45 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white">
              <div className="num text-accent-light text-sm tracking-widest">{String(i + 1).padStart(2, "0")}</div>
              <div className="flex items-baseline gap-3 mt-2">
                <h2 className="headline text-4xl md:text-5xl">{t.label}</h2>
                <span className="eyebrow text-white/60">{t.en}</span>
              </div>
              <p className="mt-3 text-sm text-white/75 leading-7 max-w-xs">{t.desc}</p>
              <div className="mt-5 flex items-center justify-between text-xs tracking-[0.2em] font-bold">
                <span className="border-b border-accent-light pb-1 group-hover:text-accent-light transition">進入{t.label}</span>
                {t.count && <span className="num text-white/50">{t.count}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
