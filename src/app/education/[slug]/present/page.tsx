import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Presenter from "@/components/Presenter";
import { getEducation, pad2, site, toSlides } from "@/lib/content";

export function generateStaticParams() {
  return getEducation().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEducation().find((x) => x.slug === slug);
  return e ? { title: `投影｜${e.title}`, robots: { index: false } } : {};
}

export default async function PresentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEducation().find((x) => x.slug === slug);
  if (!e) notFound();
  return (
    <Presenter
      backHref={`/education/${e.slug}`}
      cover={{ week: `WEEK ${pad2(e.week)}`, title: e.title, summary: e.summary, chapter: site.chapterName }}
      slides={toSlides(e.body)}
      source={`The Official BNI Podcast · Episode ${e.podcast.episode}：${e.podcast.titleEn}`}
    />
  );
}
