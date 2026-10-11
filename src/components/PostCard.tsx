import Link from "next/link";
import Img from "./Img";

type Props = { href: string; title: string; meta: string[]; excerpt: string; image?: string; badge?: string; pending?: boolean };

/** 雜誌式卡片：圖片下緣被白色標題框切進去，對應 blog 清單參考版型。pending 時不可點，顯示「待發布」 */
export default function PostCard({ href, title, meta, excerpt, image, badge, pending }: Props) {
  const top = (
    <>
      <div className="relative">
        <Img src={image} alt={title} label={pending ? "" : undefined}
          className={`w-full aspect-[16/11] transition duration-500 ${pending ? "opacity-60" : "group-hover:brightness-90"}`} />
        {badge && <span className={`absolute top-3 left-3 ${pending ? "bg-muted" : "bg-accent"} text-white num text-xs tracking-widest px-2.5 py-1`}>{badge}</span>}
        {pending && <span className="absolute top-3 right-3 bg-paper text-muted text-xs font-bold tracking-[0.2em] px-2.5 py-1">待發布</span>}
        <div className="absolute left-0 bottom-0 w-[80%] h-10 bg-paper" />
      </div>
      <div className="relative w-[80%] -mt-10 pt-4 pr-4 bg-paper">
        <h3 className={`headline text-xl leading-[1.45] tracking-[0.03em] ${pending ? "text-muted" : "group-hover:text-accent transition"}`}>{title}</h3>
      </div>
    </>
  );

  return (
    <article className={`group ${pending ? "cursor-default select-none" : ""}`}>
      {pending ? <div>{top}</div> : <Link href={href} className="block">{top}</Link>}
      <div className="mt-3 flex flex-wrap gap-x-2 text-[11px] tracking-[0.18em] text-muted uppercase">
        {meta.filter(Boolean).map((m, i) => (
          <span key={i}>{i > 0 && <span className="mr-2">·</span>}{m}</span>
        ))}
      </div>
      <span className={`block h-px w-10 mt-4 ${pending ? "bg-line" : "bg-accent"}`} />
      <p className="mt-4 text-sm text-muted leading-7 line-clamp-3">{excerpt}</p>
      {pending ? (
        <span className="inline-block mt-4 text-[11px] tracking-[0.25em] text-muted font-bold">待發布</span>
      ) : (
        <Link href={href} className="inline-block mt-4 text-[11px] tracking-[0.25em] text-accent font-bold hover:translate-x-1 transition">
          閱讀全文 →
        </Link>
      )}
    </article>
  );
}
