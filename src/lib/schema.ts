import { abs, site, type Case, type Education, type Member } from "./content";

export const chapterOrg = () => ({
  "@type": "Organization",
  "@id": abs("/#chapter"),
  name: site.chapterName,
  alternateName: site.chapterNameEn,
  url: abs("/"),
  logo: abs("/icon.svg"),
  description: site.description,
  parentOrganization: { "@type": "Organization", name: "BNI" },
});

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "首頁", path: "/" }, ...items].map((it, i) => ({
    "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path),
  })),
});

export const personOf = (m: Member) => ({
  "@type": "Person",
  "@id": abs(`/members/${m.slug}#person`),
  name: m.name,
  jobTitle: m.title,
  description: m.specialty,
  url: abs(`/members/${m.slug}`),
  ...(m.photo ? { image: abs(m.photo) } : {}),
  knowsAbout: m.skills.map((s) => s.name),
  worksFor: { "@type": "Organization", name: m.company, ...(m.contact?.website ? { url: m.contact.website } : {}) },
  memberOf: { "@id": abs("/#chapter") },
});

export const memberPage = (m: Member) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: abs(`/members/${m.slug}`),
  name: `${m.name}｜${m.specialty}`,
  mainEntity: personOf(m),
});

export const caseArticle = (c: Case, members: Member[]) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: c.title,
  description: c.summary,
  datePublished: c.date,
  url: abs(`/cases/${c.slug}`),
  ...(c.cover ? { image: abs(c.cover) } : {}),
  keywords: c.tags.join(", "),
  publisher: { "@id": abs("/#chapter") },
  author: { "@id": abs("/#chapter") },
  contributor: members.map((m) => ({ "@type": "Person", name: m.name, url: abs(`/members/${m.slug}`), jobTitle: m.specialty })),
});

export const lessonArticle = (e: Education) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: e.title,
  description: e.summary,
  datePublished: e.date,
  url: abs(`/education/${e.slug}`),
  inLanguage: "zh-Hant-TW",
  publisher: { "@id": abs("/#chapter") },
  author: { "@id": abs("/#chapter") },
  // 標註原始出處
  isBasedOn: {
    "@type": "PodcastEpisode",
    name: e.podcast.titleEn,
    episodeNumber: e.podcast.episode,
    url: e.podcast.url,
    partOfSeries: { "@type": "PodcastSeries", name: "The Official BNI Podcast", url: "https://www.bnipodcast.com/" },
  },
});
