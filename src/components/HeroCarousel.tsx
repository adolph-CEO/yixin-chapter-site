"use client";
 
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  slug: string;
  title: string;
  summary: string;
  heroImage: string;
  heroImageMobile: string;
  memberCount: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
const INTERVAL = 7000;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, go, n]);

  if (!n) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="分會案例"
      className="relative overflow-hidden bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* 左側細線紋理，呼應參考版型 */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-1/3 hidden md:block opacity-60"
        style={{ background: "repeating-linear-gradient(0deg, #e9edf4 0 1px, transparent 1px 7px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-20">
        <div className="relative h-[calc(100svh-4rem)] min-h-[620px] max-h-[860px] md:h-[calc(100svh-5rem)] md:min-h-[600px]">
          {slides.map((s, idx) => {
            const on = idx === i;
            return (
              <div key={s.slug} aria-hidden={!on}
                className={`absolute inset-0 transition-all duration-700 ease-out ${on ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}>
                {/* 背景大數字 */}
                <div aria-hidden className="num absolute left-0 top-4 md:top-1/2 md:-translate-y-1/2 text-[34vw] md:text-[22rem] leading-none text-indigo/[0.06] select-none">
                  {pad(idx + 1)}
                </div>

                {/* 圖像區：外框 + 破框人物 */}
                <div className="absolute inset-x-0 top-0 h-[54%] md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-[56%]">
                  {/* 人物圖限制在圖像區內置中：多人合照再寬也不會撞到左邊的標題 */}
                  <div className="absolute inset-0 flex items-end justify-center md:pl-[4%]">
                    <picture className="contents">
                      {s.heroImageMobile && <source media="(max-width: 767px)" srcSet={s.heroImageMobile} />}
                      <img
                        src={s.heroImage || "/placeholder/person.svg"}
                        alt=""
                        className="h-[96%] md:h-[92%] w-auto max-w-full object-contain object-bottom"
                      />
                    </picture>
                  </div>
                  {!s.heroImage && (
                    <span className="eyebrow absolute right-3 bottom-3 text-black/35">去背人物圖待置換</span>
                  )}
                </div>

                {/* 文字區 */}
                <div className="absolute z-10 inset-x-0 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[48%]">
                  <div className="eyebrow text-accent">Case {pad(idx + 1)} · Power Team {s.memberCount} 人協作</div>
                  <h1 className="headline text-[2rem] leading-[1.18] md:text-6xl md:leading-[1.15] mt-4">{s.title}</h1>
                  <p className="mt-5 text-muted leading-8 max-w-md line-clamp-2 md:line-clamp-none">{s.summary}</p>
                  <Link href={`/cases/${s.slug}`} tabIndex={on ? 0 : -1}
                    className="group mt-7 inline-flex items-stretch bg-accent text-white text-sm font-bold tracking-[0.2em]">
                    <span className="px-6 py-3.5">看完整案例</span>
                    <span className="px-4 flex items-center border-l border-white/30 transition group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* 控制列 */}
          <div className="absolute bottom-5 md:bottom-8 left-0 right-0 flex items-center justify-between md:justify-start gap-6">
            <button onClick={() => go(-1)} aria-label="上一則" className="md:hidden w-11 h-11 flex items-center justify-center text-3xl hover:text-accent">‹</button>
            <div className="flex items-center gap-4">
              <span className="num text-sm tracking-widest">{pad(i + 1)}</span>
              <span className="relative block w-24 md:w-40 h-px bg-black/15 overflow-hidden">
                <span className="absolute inset-y-0 left-0 bg-accent transition-all duration-500" style={{ width: `${((i + 1) / n) * 100}%` }} />
              </span>
              <span className="num text-sm tracking-widest text-muted">{pad(n)}</span>
            </div>
            <button onClick={() => go(1)} aria-label="下一則" className="md:hidden w-11 h-11 flex items-center justify-center text-3xl hover:text-accent">›</button>
          </div>
        </div>
      </div>
      {/* 桌機左右箭頭，貼齊視窗兩側 */}
      <button onClick={() => go(-1)} aria-label="上一則" className="hidden md:flex absolute left-3 xl:left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center text-4xl font-light hover:text-accent">‹</button>
      <button onClick={() => go(1)} aria-label="下一則" className="hidden md:flex absolute right-3 xl:right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center text-4xl font-light hover:text-accent">›</button>
    </section>
  );
}
