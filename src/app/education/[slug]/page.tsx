import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import PrevNext from "@/components/PrevNext";
import { Block, Column } from "@/components/Detail";
import { IndustryTag, PartnerTag, PlainTag, TagRow } from "@/components/Tags";
import JsonLd from "@/components/JsonLd";
import { getCases, getEducation, getMembers, industriesOf, neighbors, pad2 } from "@/lib/content";
import { breadcrumb, lessonArticle } from "@/lib/schema";

export function generateStaticParams() {
  return getEducation().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEducation().find((x) => x.slug === slug);
  if (!e) return {};
  return {
    title: e.title, description: e.summary,
    alternates: { canonical: `/education/${e.slug}` },
    openGraph: { type: "article", title: e.title, description: e.summary, url: `/education/${e.slug}`, publishedTime: e.date, images: [e.cover || "/og.png"] },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = getEducation(); // 依週次新到舊
  const idx = list.findIndex((e) => e.slug === slug);
  if (idx < 0) notFound();
  const e = list[idx];
  const all = getMembers();
  const related = getCases().filter((c) => e.relatedCases.includes(c.slug));
  const memberSlugs = [...new Set(related.flatMap((c) => c.members))];
  const members = memberSlugs.map((s) => all.find((m) => m.slug === s)).filter((m): m is NonNullable<typeof m> => !!m);
  const industries = industriesOf(memberSlugs, all);
  const { prev: newer, next: older } = neighbors(list, idx);

  return (
    <Column>
      <JsonLd data={[lessonArticle(e), breadcrumb([{ name: "教育", path: "/education" }, { name: e.title, path: `/education/${e.slug}` }])]} />
      <header>
        <div className="flex items-center gap-3">
          <span className="num rounded-full bg-accent text-white text-xs tracking-widest px-3 py-1">WEEK {pad2(e.week)}</span>
          <span className="text-[11px] tracking-[0.2em] text-muted">{e.date}</span>
        </div>
        <h1 className="headline text-3xl md:text-5xl mt-5 leading-[1.25]">{e.title}</h1>
        <p className="mt-5 text-lg text-muted leading-8">{e.summary}</p>
        <Link href={`/education/${e.slug}/present`} className="mt-7 inline-flex rounded-full bg-indigo text-white px-6 py-2.5 text-sm font-bold tracking-[0.15em] hover:bg-accent transition">
          投影模式 ▸
        </Link>
      </header>

      {(industries.length > 0 || e.tags.length > 0) && (
        <div className="mt-8 border-y border-line py-3 divide-y divide-line">
          {industries.length > 0 && <TagRow label="案例產業">{industries.map((i) => <IndustryTag key={i} name={i} />)}</TagRow>}
          {members.length > 0 && (
            <TagRow label="案例夥伴">{members.map((m) => <PartnerTag key={m.slug} slug={m.slug} name={m.name} photo={m.photo} />)}</TagRow>
          )}
          {e.tags.length > 0 && <TagRow label="標籤">{e.tags.map((t) => <PlainTag key={t} name={t} />)}</TagRow>}
        </div>
      )}

      {/* 原始出處：集數、英文原標題、原始連結 */}
      <aside className="mt-8 rounded-2xl bg-soft px-6 py-5 border-l-4 border-accent">
        <div className="eyebrow text-muted">Source · The Official BNI Podcast</div>
        <div className="mt-2 font-bold">Episode {e.podcast.episode}：{e.podcast.titleEn}</div>
        {e.podcast.url && (
          <a href={e.podcast.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-accent underline underline-offset-4 break-all">{e.podcast.url}</a>
        )}
      </aside>

      <div className="prose-yx mt-10" dangerouslySetInnerHTML={{ __html: e.html }} />

      {related.length > 0 && (
        <Block title="分會裡的真實案例" action={{ href: "/cases", label: "看全部案例" }}>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-10">
            {related.map((c) => (
              <ProjectCard key={c.slug} href={`/cases/${c.slug}`} title={c.title} image={c.cover} tag={industriesOf(c.members, all)[0]} excerpt={c.summary} />
            ))}
          </div>
        </Block>
      )}

      <PrevNext
        prev={older && { href: `/education/${older.slug}`, title: older.title }}
        next={newer && { href: `/education/${newer.slug}`, title: newer.title }}
        prevLabel="上一週" nextLabel="下一週" backHref="/education" backLabel="全部教育" />
    </Column>
  );
}
