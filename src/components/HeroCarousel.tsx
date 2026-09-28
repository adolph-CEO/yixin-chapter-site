"use client";
/* eslint-disable @next/next/no-img-element */
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

/**
 * 縱深位置：d = 0 是現在這張（最前、最大），1、2 在右後方等待，n-1 是剛退場的那張（往左後方離開）。
 * 切換時，後面那張會從遠處轉到前方放大。
 */
function depthStyle(d: number, n: number): React.CSSProperties {
  if (d === 0) return { transform: "translate3d(0,0,0) rotateY(0deg) scale(1)", opacity: 1, zIndex: 30, filter: "none" };
  if (d === n - 1 && n > 2)
    return { transform: "translate3d(-38%,0,-700px) rotateY(38deg) scale(.6)", opacity: 0, zIndex: 5, filter: "grayscale(1)" };
  const far = d; // 1, 2, 3...
  return {
    transform: `translate3d(${24 + far * 12}%,${-2 * far}%,${-420 * far}px) rotateY(${-28 - far * 6}deg) scale(${1 - far * 0.18})`,
    opacity: far === 1 ? 0.32 : far === 2 ? 0.14 : 0,
    zIndex: 20 - far,
    filter: "grayscale(1) blur(1px)",
  };
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const imgLayer = useRef<HTMLDivElement>(null);
  const textLayer = useRef<HTMLDivElement>(null);
  const numLayer = useRef<HTMLDivElement>(null);
  const n = slides.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  // 自動輪播
  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, go, n]);

  // 滾動視差：人物比頁面慢（往下沉、跨進下一個區塊），標題比頁面快，背景數字介於中間
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      const mobile = window.innerWidth < 768;
      // 下沉有上限：只跨進下一區塊的上緣，不蓋到卡片文字
      // 手機版人物下方就是標題，改成往上浮，拉開距離而不是壓到文字
      const sink = mobile ? -Math.min(y * 0.12, 80) : Math.min(y * 0.3, 90);
      if (imgLayer.current) imgLayer.current.style.transform = `translate3d(0,${sink}px,0)`;
      if (textLayer.current) textLayer.current.style.transform = `translate3d(0,${mobile ? 0 : -y * 0.12}px,0)`;
      if (numLayer.current) numLayer.current.style.transform = `translate3d(0,${y * 0.2}px,0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (!n) return null;
  const cur = slides[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="分會案例"
      /* overflow-x-clip：左右裁切，上下不裁，人物才能跨出 Hero 進到下一個區塊 */
      className="relative z-10 overflow-x-clip bg-paper"
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
      {/* 左側細線紋理 */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-1/3 hidden md:block opacity-60"
        style={{ background: "repeating-linear-gradient(0deg, #e9edf4 0 1px, transparent 1px 7px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-20">
        <div className="relative h-[calc(100svh-4rem)] min-h-[620px] max-h-[860px] md:h-[calc(100svh-5rem)] md:min-h-[600px]">
          {/* 背景大數字 */}
          <div ref={numLayer} aria-hidden className="absolute inset-0 will-change-transform pointer-events-none">
            {slides.map((s, idx) => (
              <div key={s.slug}
                className={`num absolute left-0 top-4 md:top-1/2 md:-translate-y-1/2 text-[34vw] md:text-[22rem] leading-none text-indigo/[0.06] select-none transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}>
                {pad(idx + 1)}
              </div>
            ))}
          </div>

          {/* 人物舞台：縱深輪播 + 視差 */}
          <div ref={imgLayer} className="absolute inset-x-0 top-0 h-[54%] md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-[56%] will-change-transform pointer-events-none">
            <div className="absolute inset-0" style={{ perspective: "1400px", perspectiveOrigin: "70% 60%" }}>
              {slides.map((s, idx) => {
                const d = (idx - i + n) % n;
                return (
                  <div key={s.slug} aria-hidden={d !== 0}
                    className="absolute inset-0 flex items-end justify-center md:pl-[4%] transition-[transform,opacity,filter] duration-[1100ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{ ...depthStyle(d, n), transformOrigin: "50% 100%" }}>
                    <picture className="contents">
                      {s.heroImageMobile && <source media="(max-width: 767px)" srcSet={s.heroImageMobile} />}
                      <img src={s.heroImage || "/placeholder/person.svg"} alt=""
                        className="h-[96%] md:h-[92%] w-auto max-w-full object-contain object-bottom" />
                    </picture>
                  </div>
                );
              })}
            </div>
            {!cur.heroImage && <span className="eyebrow absolute right-3 bottom-3 text-black/35">去背人物圖待置換</span>}
          </div>

          {/* 文字區：比頁面捲得快，拉出前後深度 */}
          <div ref={textLayer} className="absolute inset-0 z-40 will-change-transform pointer-events-none">
            {slides.map((s, idx) => {
              const on = idx === i;
              return (
                <div key={s.slug} aria-hidden={!on}
                  className={`absolute inset-x-0 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[48%] transition-all ease-out ${on ? "opacity-100 translate-x-0 pointer-events-auto duration-700 delay-300" : "opacity-0 -translate-x-6 duration-300"}`}>
                  <div className="eyebrow text-accent">Case {pad(idx + 1)}{s.memberCount > 0 && ` · Power Team ${s.memberCount} 人協作`}</div>
                  <h1 className="headline text-[2rem] leading-[1.18] md:text-6xl md:leading-[1.15] mt-4">{s.title}</h1>
                  <p className="mt-5 text-muted leading-8 max-w-md line-clamp-2 md:line-clamp-none">{s.summary}</p>
                  <Link href={`/cases/${s.slug}`} tabIndex={on ? 0 : -1}
                    className="group mt-7 inline-flex items-stretch bg-accent text-white text-sm font-bold tracking-[0.2em]">
                    <span className="px-6 py-3.5">看完整案例</span>
                    <span className="px-4 flex items-center border-l border-white/30 transition group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* 控制列 */}
          <div className="absolute z-40 bottom-5 md:bottom-8 left-0 right-0 flex items-center justify-between md:justify-start gap-6">
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

      {/* 桌機左右箭頭 */}
      <button onClick={() => go(-1)} aria-label="上一則" className="hidden md:flex absolute z-40 left-3 xl:left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center text-4xl font-light hover:text-accent">‹</button>
      <button onClick={() => go(1)} aria-label="下一則" className="hidden md:flex absolute z-40 right-3 xl:right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center text-4xl font-light hover:text-accent">›</button>
    </section>
  );
}
