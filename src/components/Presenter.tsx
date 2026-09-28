"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Cover = { week: string; title: string; summary: string; chapter: string };

/** 投影模式：例會直接投影網址，不再傳 pptx，也就不會跑版 */
export default function Presenter({ cover, slides, source, backHref }: { cover: Cover; slides: string[]; source: string; backHref: string }) {
  const total = slides.length + 1;
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((v) => Math.min(total - 1, Math.max(0, v + d))), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === "f") document.documentElement.requestFullscreen?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="fixed inset-0 z-[100] bg-dark text-white flex flex-col select-none">
      <div className="flex items-center justify-between px-6 md:px-12 py-5 text-xs tracking-[0.25em] text-white/50">
        <span className="headline text-white text-base tracking-[0.2em]">{cover.chapter}</span>
        <Link href={backHref} className="hover:text-white">離開投影 ✕</Link>
      </div>

      <div className="flex-1 relative overflow-hidden" onClick={(e) => go(e.clientX > window.innerWidth / 3 ? 1 : -1)}>
        {i === 0 ? (
          <div className="h-full flex flex-col justify-center px-6 md:px-24 max-w-6xl">
            <div className="num text-accent-light tracking-[0.3em]">{cover.week}</div>
            <h1 className="headline text-4xl md:text-7xl mt-6 leading-[1.2]">{cover.title}</h1>
            <p className="mt-8 text-lg md:text-2xl text-white/70 leading-relaxed max-w-3xl">{cover.summary}</p>
          </div>
        ) : (
          <div key={i} className="slide h-full flex flex-col justify-center px-6 md:px-24 max-w-6xl"
            dangerouslySetInnerHTML={{ __html: slides[i - 1] }} />
        )}
      </div>

      <div className="px-6 md:px-12 py-5 flex items-center justify-between gap-6 text-xs text-white/40">
        <span className="truncate">{source}</span>
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => go(-1)} aria-label="上一張" className="text-2xl hover:text-white">‹</button>
          <span className="num tracking-widest text-white/70">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <button onClick={() => go(1)} aria-label="下一張" className="text-2xl hover:text-white">›</button>
        </div>
      </div>
      <div className="h-1 bg-white/10"><div className="h-full bg-accent transition-all" style={{ width: `${((i + 1) / total) * 100}%` }} /></div>

      <style>{`
        .slide h2 { font-weight: 900; letter-spacing: .05em; font-size: clamp(2rem, 4.5vw, 4rem); line-height: 1.2; margin-bottom: .6em; }
        .slide h2::after { content: ""; display: block; width: 3rem; height: 3px; background: var(--accent); margin-top: .5em; }
        .slide p, .slide li { font-size: clamp(1.15rem, 2.2vw, 2rem); line-height: 1.7; color: rgba(255,255,255,.82); max-width: 52rem; }
        .slide p + p { margin-top: .8em; }
        .slide strong { color: #fff; }
        .slide ul { list-style: disc; padding-left: 1.2em; }
      `}</style>
    </div>
  );
}
