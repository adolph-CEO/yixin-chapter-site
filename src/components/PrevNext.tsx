import Link from "next/link";

type Item = { href: string; title: string } | undefined;

export default function PrevNext({ prev, next, prevLabel, nextLabel, backHref, backLabel }:
  { prev: Item; next: Item; prevLabel: string; nextLabel: string; backHref: string; backLabel: string }) {
  return (
    <nav className="border-t border-line mt-16">
      <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-stretch">
        <div className="py-8 pr-4">
          {prev && (
            <Link href={prev.href} className="group block">
              <div className="eyebrow text-muted">← {prevLabel}</div>
              <div className="headline text-base md:text-lg mt-2 group-hover:text-accent transition line-clamp-2">{prev.title}</div>
            </Link>
          )}
        </div>
        <Link href={backHref} className="hidden md:flex items-center px-10 border-x border-line text-sm font-bold tracking-[0.2em] hover:text-accent">
          {backLabel}
        </Link>
        <div className="py-8 pl-4 text-right border-l border-line md:border-l-0">
          {next && (
            <Link href={next.href} className="group block">
              <div className="eyebrow text-muted">{nextLabel} →</div>
              <div className="headline text-base md:text-lg mt-2 group-hover:text-accent transition line-clamp-2">{next.title}</div>
            </Link>
          )}
        </div>
      </div>
      <Link href={backHref} className="md:hidden block text-center py-4 border-t border-line text-sm font-bold tracking-[0.2em]">{backLabel}</Link>
    </nav>
  );
}
