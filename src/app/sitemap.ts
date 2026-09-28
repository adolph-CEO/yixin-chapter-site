import type { MetadataRoute } from "next";
import { abs, getCases, getEducation, getMembers } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const cases = getCases();
  const edu = getEducation();
  const latest = [...cases.map((c) => c.date), ...edu.map((e) => e.date)].sort().pop();
  return [
    { url: abs("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: abs("/members"), changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/cases"), lastModified: cases[0]?.date, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/education"), lastModified: edu[0]?.date, changeFrequency: "weekly", priority: 0.8 },
    ...getMembers().map((m) => ({ url: abs(`/members/${m.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...cases.map((c) => ({ url: abs(`/cases/${c.slug}`), lastModified: c.date, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...edu.map((e) => ({ url: abs(`/education/${e.slug}`), lastModified: e.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
