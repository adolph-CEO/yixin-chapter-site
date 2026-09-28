"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/members", label: "會員", en: "Members" },
  { href: "/cases", label: "案例", en: "Cases" },
  { href: "/education", label: "教育", en: "Education" },
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* 品牌色帶：靛藍為底，藏紅一段 */}
      <div aria-hidden className="h-1 bg-indigo"><div className="h-full w-1/4 bg-accent" /></div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span aria-hidden className="flex flex-col gap-[3px]"><span className="block w-2.5 h-2.5 bg-accent" /><span className="block w-2.5 h-2.5 bg-indigo" /></span>
          <span className="headline text-xl md:text-2xl text-indigo">億鑫分會</span>
          <span className="eyebrow text-accent hidden sm:inline">Yixin Chapter</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`group relative py-2 text-[15px] font-bold tracking-[0.2em] ${active ? "text-accent" : "hover:text-accent"}`}>
                {n.label}
                <span className={`absolute left-0 -bottom-0.5 h-0.5 bg-accent transition-all ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </nav>
        <button className="md:hidden p-2 -mr-2" aria-label="開啟選單" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className={`block h-0.5 w-6 bg-indigo transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-indigo mt-1.5 transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-indigo mt-1.5 transition ${open ? "-translate-y-[9px] -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-line bg-paper">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between px-4 py-5 border-b border-line">
              <span className="headline text-2xl">{n.label}</span>
              <span className="eyebrow text-muted">{n.en}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
