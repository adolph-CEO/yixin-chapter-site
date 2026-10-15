"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

/**
 * 教育頁背景：由小點串成的 BNI，固定在畫面中央，寬度約佔畫面八成。
 * 捲動時只做微幅視差（最多上移約 40px），系統設定「減少動態效果」時不移動。
 */
export default function BniBackdrop() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty("--drift", `${(-ratio * 40).toFixed(1)}px`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <img ref={ref} src="/images/bni-dots.svg" alt="" aria-hidden="true"
      className="pointer-events-none select-none fixed left-1/2 top-1/2 z-0 opacity-[0.078] will-change-transform"
      style={{ width: "min(80vw, 171vh)", transform: "translate3d(-50%, calc(-46% + var(--drift, 0px)), 0)" }} />
  );
}
