import Link from "next/link";
import Img from "./Img";

/** 內頁用的兩欄案例卡：圓角圖、標題、右側產業 #標籤 */
export default function ProjectCard({ href, title, image, tag, excerpt }: { href: string; title: string; image?: string; tag?: string; excerpt: string }) {
  return (
    <Link href={href} className="group block">
      <Img src={image} alt={title} className="w-full aspect-[4/3] rounded-2xl overflow-hidden transition group-hover:brightness-95" />
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="font-bold leading-snug group-hover:text-accent transition">{title}</h3>
        {tag && <span className="shrink-0 text-xs text-muted">#{tag}</span>}
      </div>
      <p className="mt-1.5 text-sm text-muted leading-6 line-clamp-2">{excerpt}</p>
    </Link>
  );
}
