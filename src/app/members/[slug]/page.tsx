import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import ProjectCard from "@/components/ProjectCard";
import MemberPrevNext from "@/components/MemberPrevNext";
import { Block, Column, SoftCard } from "@/components/Detail";
import { IndustryTag, PartnerTag, PlainTag, TagRow } from "@/components/Tags";
import JsonLd from "@/components/JsonLd";
import { getCases, getMembers, industriesOf, partnersOf, site } from "@/lib/content";
import { breadcrumb, memberPage } from "@/lib/schema";

export function generateStaticParams() {
  return getMembers().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMembers().find((x) => x.slug === slug);
  if (!m) return {};
  const title = `${m.name}｜${m.specialty}`;
  const description = [`${m.name}，${m.company}${m.title}，專業代表：${m.specialty}。`, m.valueFuture, "億鑫分會會員。"].filter(Boolean).join("");
  return {
    title, description,
    alternates: { canonical: `/members/${m.slug}` },
    openGraph: { type: "profile", title, description, url: `/members/${m.slug}`, images: [m.photo || "/og.png"] },
  };
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getMembers();
  const m = all.find((x) => x.slug === slug);
  if (!m) notFound();
  const allCases = getCases();
  const cases = allCases.filter((c) => c.members.includes(m.slug));
  const partners = partnersOf(m.slug, allCases, all);
  const partnerIndustries = [...new Set(partners.map((p) => p.member.industry))];
  const c = m.contact ?? {};
  const contacts = [
    // 電話要等會員同意公開後，把 content/site.json 的 showPhones 改成 true 才顯示
    site.showPhones && c.phone && { label: "電話", value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, "")}` },
    c.line && { label: "LINE", value: c.line, href: c.line.startsWith("http") ? c.line : undefined },
    c.email && { label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.website && { label: "網站", value: c.website.replace(/^https?:\/\//, ""), href: c.website },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <Column>
      <JsonLd data={[memberPage(m), breadcrumb([{ name: "會員", path: "/members" }, { name: m.name, path: `/members/${m.slug}` }])]} />
      {/* 開場：照片 + 自我介紹 */}
      <header className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[12rem_1fr] gap-5 sm:gap-10 items-center">
        <Img src={m.photo} alt={m.name} label="會員照片" className="w-full aspect-[4/5] rounded-2xl overflow-hidden" />
        <div>
          <IndustryTag name={m.industry} />
          <h1 className="headline text-3xl sm:text-5xl mt-4">{m.name}</h1>
          <div className="mt-2 text-sm text-muted">{[m.company, m.title].filter(Boolean).join("．")}</div>
          <p className="mt-4 text-lg sm:text-xl font-bold leading-relaxed">{m.specialty}</p>
          <a href="#contact" className="mt-5 hidden sm:inline-flex rounded-full border border-line px-5 py-2 text-sm font-bold hover:border-indigo transition">聯絡方式</a>
        </div>
      </header>

      {/* 標籤區：產業、想找的夥伴、合作過的夥伴 */}
      {(m.seekingPartners.length > 0 || partners.length > 0) && (
      <div className="mt-10 border-y border-line py-3 divide-y divide-line">
        {m.seekingPartners.length > 0 && (
          <TagRow label="想找的夥伴">
            {m.seekingPartners.map((s) => (
              <span key={s} className="rounded-full bg-indigo text-white px-3 py-1 text-xs font-bold">{s}</span>
            ))}
          </TagRow>
        )}
        {partners.length > 0 && (
          <TagRow label="合作過的夥伴">
            {partners.map((p) => (
              <PartnerTag key={p.member.slug} slug={p.member.slug} name={p.member.name} photo={p.member.photo} note={`${p.times} 案`} />
            ))}
          </TagRow>
        )}
        {partnerIndustries.length > 0 && (
          <TagRow label="合作過的產業">
            {partnerIndustries.map((ind) => <IndustryTag key={ind} name={ind} />)}
          </TagRow>
        )}
      </div>
      )}

      {m.skills.length > 0 && (
        <Block title="擅長項目">
          <div className="grid sm:grid-cols-2 gap-4">
            {m.skills.map((s) => <SoftCard key={s.name} title={s.name}>{s.desc}</SoftCard>)}
          </div>
        </Block>
      )}

      {m.html.trim() && (
        <Block title="關於我">
          <div className="prose-yx" dangerouslySetInnerHTML={{ __html: m.html }} />
        </Block>
      )}

      {m.valueFuture && (
        <Block title="未來能創造的價值">
          <p className="text-xl md:text-2xl font-bold leading-relaxed border-l-4 border-accent pl-5">{m.valueFuture}</p>
        </Block>
      )}

      {cases.length > 0 && (
        <Block title="參與的案例" action={{ href: "/cases", label: "看全部案例" }}>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-10">
            {cases.map((cs) => (
              <ProjectCard key={cs.slug} href={`/cases/${cs.slug}`} title={cs.title} image={cs.cover}
                tag={industriesOf(cs.members, all).filter((i) => i !== m.industry)[0] ?? cs.tags[0]} excerpt={cs.summary} />
            ))}
          </div>
        </Block>
      )}

      {/* 轉換出口（受眾 B） */}
      <section id="contact" className="mt-16 md:mt-20 rounded-2xl bg-indigo text-white p-7 md:p-10 scroll-mt-28">
        <div className="eyebrow text-white/50">Let&apos;s work together</div>
        <h2 className="headline text-2xl md:text-3xl mt-3">需要{m.specialty}？</h2>
        {contacts.length > 0 ? (
          <>
          <p className="mt-3 text-white/70 text-sm leading-7">直接聯絡{m.name}，或透過億鑫分會引薦，我們會把對的人介紹給你。</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            {contacts.map((x) => (
              <li key={x.label} className="rounded-xl border border-white/15 px-4 py-3">
                <span className="text-white/50 mr-3">{x.label}</span>
                {x.href ? <a href={x.href} className="hover:text-accent-light">{x.value}</a> : x.value}
              </li>
            ))}
          </ul>
          </>
        ) : (
          <p className="mt-6 text-sm text-white/70">歡迎透過億鑫分會引薦，我們會為你聯繫{m.name}。</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">{m.skills.slice(0, 3).map((s) => <PlainTag key={s.name} name={s.name} />)}</div>
      </section>

      <Suspense fallback={null}>
        <MemberPrevNext all={all.map(({ slug, name, industry }) => ({ slug, name, industry }))} slug={m.slug} />
      </Suspense>
    </Column>
  );
}
