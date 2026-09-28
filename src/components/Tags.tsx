import Link from "next/link";
import Img from "./Img";

/** 產業標籤：紅框，可點，帶到該產業的會員篩選 */
export function IndustryTag({ name }: { name: string }) {
  return (
    <Link href={`/members?industry=${encodeURIComponent(name)}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 text-accent px-3 py-1 text-xs font-bold tracking-[0.08em] hover:bg-accent hover:text-white transition">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{name}
    </Link>
  );
}

/** 合作夥伴標籤：頭像 + 名字，可點，連到會員頁 */
export function PartnerTag({ slug, name, photo, note }: { slug: string; name: string; photo?: string; note?: string }) {
  return (
    <Link href={`/members/${slug}`}
      className="inline-flex items-center gap-2 rounded-full bg-indigo-soft text-indigo pl-1 pr-3.5 py-1 text-xs font-bold hover:bg-indigo hover:text-white transition">
      <Img src={photo} alt={name} label="" className="w-6 h-6 rounded-full shrink-0" />
      {name}{note && <span className="font-normal opacity-60">{note}</span>}
    </Link>
  );
}

/** 一般標籤：#文字 */
export function PlainTag({ name }: { name: string }) {
  return <span className="text-xs text-muted tracking-[0.05em]">#{name}</span>;
}

/** 一整排標籤的外框，左側有標題 */
export function TagRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3">
      <div className="shrink-0 sm:w-24 text-[11px] font-bold tracking-[0.18em] text-muted pt-1.5">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
