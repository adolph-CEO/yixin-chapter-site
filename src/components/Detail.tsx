import Link from "next/link";

/** 內頁共用：窄欄置中、區塊標題、柔和卡片 */
export function Column({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 md:px-0 py-12 md:py-20">{children}</div>;
}

export function Block({ title, action, children }: { title: string; action?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="headline text-2xl md:text-[1.75rem] tracking-[0.04em]">{title}</h2>
        {action && (
          <Link href={action.href} className="shrink-0 rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-[0.1em] hover:border-indigo transition">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function SoftCard({ title, children, href }: { title: string; children?: React.ReactNode; href?: string }) {
  const inner = (
    <>
      <div className="font-bold">{title}</div>
      {children && <div className="mt-2 text-sm text-muted leading-7">{children}</div>}
    </>
  );
  const cls = "block rounded-2xl bg-soft p-5 md:p-6 transition";
  return href ? <Link href={href} className={`${cls} hover:bg-[#ebebe7]`}>{inner}</Link> : <div className={cls}>{inner}</div>;
}
