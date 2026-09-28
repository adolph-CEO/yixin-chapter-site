import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import PrevNext from "@/components/PrevNext";
import { Block, Column } from "@/components/Detail";
import { IndustryTag, PartnerTag, PlainTag, TagRow } from "@/components/Tags";
import JsonLd from "@/components/JsonLd";
import { getCases, getEducation, getMembers, industriesOf, neighbors, pad2 } from "@/lib/content";
import { breadcrumb, caseArticle } from "@/lib/schema";

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCases().find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: c.title, description: c.summary,
    alternates: { canonical: `/cases/${c.slug}` },
    openGraph: { type: "article", title: c.title, description: c.summary, url: `/cases/${c.slug}`, publishedTime: c.date, images: [c.cover || "/og.png"] },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cases = getCases();
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx < 0) notFound();
  const c = cases[idx];
  const all = getMembers();
  const members = c.members.map((s) => all.find((m) => m.slug === s)).filter((m): m is NonNullable<typeof m> => !!m);
  const industries = industriesOf(c.members, all);
  const lessons = getEducation().filter((e) => e.relatedCases.includes(c.slug));
  const { prev, next } = neighbors(cases, idx);

  return (
    <Column>
      <JsonLd data={[caseArticle(c, members), breadcrumb([{ name: "案例", path: "/cases" }, { name: c.title, path: `/cases/${c.slug}` }])]} />
      <header>
        <div className="text-[11px] tracking-[0.2em] text-muted">{c.date}．{members.length} 位會員協作</div>
        <h1 className="headline text-3xl md:text-5xl mt-4 leading-[1.25]">{c.title}</h1>
        <p className="mt-5 text-lg text-muted leading-8">{c.summary}</p>
      </header>

      {/* 標籤區：這個案例跨了哪些產業、哪些夥伴 */}
      <div className="mt-8 border-y border-line py-3 divide-y divide-line">
        <TagRow label="跨產業">{industries.map((i) => <IndustryTag key={i} name={i} />)}</TagRow>
        <TagRow label="合作夥伴">
          {members.map((m) => <PartnerTag key={m.slug} slug={m.slug} name={m.name} photo={m.photo} />)}
        </TagRow>
        {c.tags.length > 0 && <TagRow label="標籤">{c.tags.map((t) => <PlainTag key={t} name={t} />)}</TagRow>}
      </div>

      <Img src={c.cover} alt={c.title} className="mt-10 w-full aspect-[16/10] rounded-2xl overflow-hidden" />

      <Block title="這次的分工">
        <div className="grid sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <Link key={m.slug} href={`/members/${m.slug}`} className="group flex gap-4 items-start rounded-2xl bg-soft p-5 hover:bg-[#ebebe7] transition">
              <Img src={m.photo} alt={m.name} label="" className="w-12 h-12 rounded-full shrink-0" />
              <div>
                <div className="font-bold group-hover:text-accent transition">{m.name}</div>
                <div className="text-xs text-muted mt-0.5">{m.industry}．{m.company}</div>
                {c.roles[m.slug] && <div className="text-sm mt-2 leading-6">負責：{c.roles[m.slug]}</div>}
              </div>
            </Link>
          ))}
        </div>
      </Block>

      <Block title="案例故事">
        <div className="prose-yx" dangerouslySetInnerHTML={{ __html: c.html }} />
      </Block>

      {lessons.length > 0 && (
        <Block title="對應的教育主題" action={{ href: "/education", label: "看全部教育" }}>
          <div className="space-y-4">
            {lessons.map((e) => (
              <Link key={e.slug} href={`/education/${e.slug}`} className="group block rounded-2xl bg-soft p-5 md:p-6 hover:bg-[#ebebe7] transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-bold text-lg group-hover:text-accent transition">{e.title}</div>
                  <span className="num text-xs text-accent shrink-0 pt-1">WEEK {pad2(e.week)}</span>
                </div>
                <p className="mt-2 text-sm text-muted leading-7">{e.summary}</p>
              </Link>
            ))}
          </div>
        </Block>
      )}

      <PrevNext
        prev={prev && { href: `/cases/${prev.slug}`, title: prev.title }}
        next={next && { href: `/cases/${next.slug}`, title: next.title }}
        prevLabel="上一案例" nextLabel="下一案例" backHref="/cases" backLabel="全部案例" />
    </Column>
  );
}
