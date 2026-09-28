import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 md:py-40">
      <div className="num text-accent tracking-[0.3em]">404</div>
      <h1 className="headline text-4xl md:text-6xl mt-5 leading-[1.2]">這一頁不在這裡</h1>
      <p className="mt-6 text-muted leading-8">可能是網址打錯了，或是這個頁面已經移除。從下面挑一個入口繼續看。</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex bg-accent text-white px-6 py-3 text-sm font-bold tracking-[0.2em] hover:bg-accent-deep transition">回首頁</Link>
        <Link href="/members" className="inline-flex bg-indigo text-white px-6 py-3 text-sm font-bold tracking-[0.2em] hover:bg-dark transition">會員</Link>
        <Link href="/cases" className="inline-flex border border-line rounded-full px-5 py-3 text-sm font-bold hover:border-indigo transition">案例</Link>
        <Link href="/education" className="inline-flex border border-line rounded-full px-5 py-3 text-sm font-bold hover:border-indigo transition">教育</Link>
      </div>
    </div>
  );
}
