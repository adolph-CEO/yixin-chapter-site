import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/schema";
import Img from "@/components/Img";
import PostCard from "@/components/PostCard";
import SectionTitle from "@/components/SectionTitle";
import { getCases, site } from "@/lib/content";

export const metadata: Metadata = { title: "案例", description: "分會即品牌。億鑫分會 Power Team 的協作案例。", alternates: { canonical: "/cases" }, openGraph: { title: "案例", description: "分會即品牌。億鑫分會 Power Team 的協作案例。", url: "/cases", images: ["/og.png"] } };

export default function CasesPage() {
  const cases = getCases();
  const b = site.brandHero;
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "案例", path: "/cases" }])} />
      {/* 分會即品牌 Hero：當屆代表影片或照片 */}
      <section className="relative bg-dark text-white overflow-hidden">
        {b.video ? (
          <video src={b.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <Img src={b.image} alt={b.subtitle} dark label="當屆代表影片或照片待置換" className="absolute inset-0 w-full h-full opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#13244a] via-[#13244a]/60 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-40">
          <div className="eyebrow text-accent-light">{site.chapterNameEn} · Brand</div>
          <h1 className="headline text-5xl md:text-8xl mt-5">{b.title}</h1>
          <p className="mt-6 max-w-lg text-white/75 leading-8">{site.description}</p>
          <div className="mt-4 text-xs text-white/50 tracking-[0.2em]">{b.subtitle}</div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
        <SectionTitle eyebrow="Power Team Stories" title="協作案例" desc="每一則案例，都是幾位會員一起把客戶的問題解決掉的過程。" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {cases.map((c, i) => (
            <PostCard key={c.slug} href={`/cases/${c.slug}`} title={c.title} image={c.cover}
              badge={String(cases.length - i).padStart(2, "0")}
              meta={[c.date, `${c.members.length} 位會員協作`, ...c.tags.slice(0, 1)]} excerpt={c.summary} />
          ))}
        </div>
      </div>
    </>
  );
}
