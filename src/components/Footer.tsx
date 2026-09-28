import Link from "next/link";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="headline text-2xl text-white">{site.chapterName}</div>
          <div className="eyebrow text-accent-light mt-2">{site.chapterNameEn}</div>
          <p className="mt-5 text-sm leading-7 max-w-xs">{site.description}</p>
        </div>
        <div className="text-sm leading-8">
          <div className="eyebrow text-white/40 mb-3">Weekly Meeting</div>
          <div>{site.meeting.day}</div>
          <div>{site.meeting.time}</div>
          <div>{site.meeting.place}</div>
        </div>
        <div className="flex md:justify-end gap-8 text-sm font-bold tracking-[0.2em] text-white">
          <Link href="/members" className="hover:text-accent-light">會員</Link>
          <Link href="/cases" className="hover:text-accent-light">案例</Link>
          <Link href="/education" className="hover:text-accent-light">教育</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-5 text-xs text-white/40 flex justify-between">
          <span>© {new Date().getFullYear()} {site.chapterName}</span>
          <Link href="/brand" className="hover:text-white">視覺規範</Link>
        </div>
      </div>
    </footer>
  );
}
