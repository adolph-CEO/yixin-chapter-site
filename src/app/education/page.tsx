import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/schema";
import PostCard from "@/components/PostCard";
import SectionTitle from "@/components/SectionTitle";
import { getEducationSchedule, pad2 } from "@/lib/content";

const DESC = "第五屆鑫想事成時間：22 週，把 BNI 五大基本功變成五個增加收入的方法。每篇都標註原始 Podcast 的出處。";

export const metadata: Metadata = { title: "教育", description: DESC, alternates: { canonical: "/education" }, openGraph: { title: "教育", description: DESC, url: "/education", images: ["/og.png"] } };

export default function EducationPage() {
  const list = getEducationSchedule(); // 課表：W1 到 W22，含待發布
  const done = list.filter((e) => e.published).length;
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "教育", path: "/education" }])} />
      {/* 背景：由小點串成的 BNI，固定在畫面中央不隨捲動，寬度約佔畫面八成 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/bni-dots.svg" alt="" aria-hidden="true"
        className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-[46%] z-0 opacity-[0.13]"
        style={{ width: "min(80vw, 171vh)" }} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
      <SectionTitle eyebrow="BNI Business Value" title="教育"
        desc={`${DESC}目前已發布 ${done} / ${list.length} 週，每週例會後上架。`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {list.map((e) => (
          <PostCard key={e.slug} href={`/education/${e.slug}`} title={e.title} image={e.cover} pending={!e.published}
            badge={`WEEK ${pad2(e.week)}`}
            meta={[e.pillar, e.published ? e.date : "", e.podcast.episode ? `Podcast EP.${e.podcast.episode}` : ""]}
            excerpt={e.summary} />
        ))}
      </div>
    </div>
    </>
  );
}
