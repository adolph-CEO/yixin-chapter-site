"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Img from "./Img";

export type MemberLite = { slug: string; name: string; company: string; title: string; industry: string; specialty: string; photo: string };

export default function MemberBrowser({ members, industries }: { members: MemberLite[]; industries: string[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const current = sp.get("industry") ?? "";
  const used = industries.filter((ind) => members.some((m) => m.industry === ind));
  const list = current ? members.filter((m) => m.industry === current) : members;
  const set = (v: string) => router.replace(v ? `${path}?industry=${encodeURIComponent(v)}` : path, { scroll: false });

  const chips = [{ v: "", label: "全部", n: members.length }, ...used.map((ind) => ({ v: ind, label: ind, n: members.filter((m) => m.industry === ind).length }))];

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap pb-2">
        {chips.map((c) => {
          const on = c.v === current;
          return (
            <button key={c.label} onClick={() => set(c.v)} aria-pressed={on}
              className={`shrink-0 px-5 py-2.5 text-sm font-bold tracking-[0.12em] border transition ${on ? "bg-indigo text-white border-indigo" : "border-line hover:border-indigo"}`}>
              {c.label}<span className={`num ml-2 text-xs ${on ? "text-white/60" : "text-muted"}`}>{c.n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14">
        {list.map((m) => (
          <Link key={m.slug} href={`/members/${m.slug}${current ? `?industry=${encodeURIComponent(current)}` : ""}`} className="group block">
            <div className="relative overflow-hidden">
              <Img src={m.photo} alt={m.name} label="會員照片" className="w-full aspect-[4/5] transition duration-700 group-hover:scale-[1.03]" />
              <span className="absolute left-0 bottom-0 bg-paper px-3 pt-2 text-[11px] tracking-[0.2em] text-accent font-bold">{m.industry}</span>
            </div>
            <h3 className="headline text-lg md:text-xl mt-3 group-hover:text-accent transition">{m.name}</h3>
            <div className="text-xs md:text-sm text-muted mt-1">{m.company}</div>
            <div className="text-xs md:text-sm mt-2 leading-6">{m.specialty}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
