import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/schema";
import PostCard from "@/components/PostCard";
import SectionTitle from "@/components/SectionTitle";
import { getEducation, pad2 } from "@/lib/content";

export const metadata: Metadata = { title: "教育", description: "每週一堂 BNI 商務價值應用，搭配億鑫分會的真實案例。", alternates: { canonical: "/education" }, openGraph: { title: "教育", description: "每週一堂 BNI 商務價值應用，搭配億鑫分會的真實案例。", url: "/education", images: ["/og.png"] } };

export default function EducationPage() {
  const list = getEducation();
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "教育", path: "/education" }])} />
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
      <SectionTitle eyebrow="BNI Business Value" title="教育" desc="每週例會的教育時間，整理成可以回頭查閱的文章。每篇都標註原始 Podcast 的出處。" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {list.map((e) => (
          <PostCard key={e.slug} href={`/education/${e.slug}`} title={e.title} image={e.cover}
            badge={`WEEK ${pad2(e.week)}`} meta={[e.date, e.podcast.episode ? `Podcast EP.${e.podcast.episode}` : ""]} excerpt={e.summary} />
        ))}
      </div>
    </div>
    </>
  );
}
