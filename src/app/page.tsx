import HeroCarousel from "@/components/HeroCarousel";
import SectionTiles from "@/components/SectionTiles";
import GuestCta from "@/components/GuestCta";
import JsonLd from "@/components/JsonLd";
import { abs, getCases, getEducation, getFeaturedCases, getMembers, site } from "@/lib/content";
import { chapterOrg } from "@/lib/schema";

export default function Home() {
  const featured = getFeaturedCases(4);
  const members = getMembers();
  const cases = getCases();
  const edu = getEducation();
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", ...chapterOrg() },
        { "@context": "https://schema.org", "@type": "WebSite", name: site.chapterName, url: abs("/"), inLanguage: "zh-Hant-TW", publisher: { "@id": abs("/#chapter") } },
      ]} />
      <HeroCarousel
        slides={featured.map((c) => ({
          slug: c.slug, title: c.title, summary: c.summary,
          heroImage: c.heroImage, heroImageMobile: c.heroImageMobile, memberCount: c.members.length,
        }))}
      />
      <SectionTiles
        tiles={[
          { href: "/members", label: "會員", en: "Members", desc: "每一位會員的專業、擅長項目，以及他正在找的合作夥伴。", count: `${members.length} 位會員` },
          { href: "/cases", label: "案例", en: "Cases", desc: "分會即品牌。看 Power Team 怎麼一起接下別人接不動的案子。", count: `${cases.length} 則案例` },
          { href: "/education", label: "教育", en: "Education", desc: "每週一堂 BNI 商務價值應用，搭配分會裡的真實案例。", count: `${edu.length} 週` },
        ]}
      />
      <GuestCta />
    </>
  );
}
