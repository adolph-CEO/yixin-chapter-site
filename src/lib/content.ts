import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import site from "../../content/site.json";
import STROKES from "./strokes-tw.json";

export { site };

/** 正式網址：優先讀 Vercel 環境變數 NEXT_PUBLIC_SITE_URL，沒有就用 site.json 的 url */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const ROOT = path.join(process.cwd(), "content");

export type Contact = { phone?: string; line?: string; email?: string; website?: string };

export type Member = {
  slug: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  specialty: string;
  order: number;
  photo: string;
  skills: { name: string; desc: string }[];
  seekingPartners: string[];
  valueFuture: string;
  contact: Contact;
  html: string;
};

export type Case = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  members: string[];
  /** 每位會員在這個案例負責什麼，key 為會員檔名 */
  roles: Record<string, string>;
  tags: string[];
  cover: string;
  heroImage: string;
  heroImageMobile: string;
  featured: boolean;
  featuredOrder: number;
  html: string;
};

export type Education = {
  slug: string;
  title: string;
  week: number;
  date: string;
  summary: string;
  podcast: { episode: string; titleEn: string; url: string };
  relatedCases: string[];
  tags: string[];
  cover: string;
  body: string;
  html: string;
};

function toDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

function readDir<T>(dir: string, map: (slug: string, data: Record<string, unknown>, body: string) => T): T[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return map(f.replace(/\.md$/, ""), data, content);
    });
}

const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
const str = (v: unknown) => (v == null ? "" : String(v));

export function getMembers(): Member[] {
  const list = readDir("members", (slug, d, body) => ({
    slug,
    name: str(d.name),
    company: str(d.company),
    title: str(d.title),
    industry: str(d.industry),
    specialty: str(d.specialty),
    order: Number(d.order ?? 999),
    photo: str(d.photo),
    skills: (Array.isArray(d.skills) ? d.skills : []).map((x) =>
      typeof x === "string" ? { name: x, desc: "" } : { name: str((x as Record<string, unknown>).name), desc: str((x as Record<string, unknown>).desc) }
    ),
    seekingPartners: arr(d.seekingPartners),
    valueFuture: str(d.valueFuture),
    contact: (d.contact as Contact) ?? {},
    html: marked.parse(body) as string,
  }));
  return sortByStrokes(list);
}

/**
 * 會員一律依姓氏筆畫排序（台灣教育部標準字體筆畫，資料在 strokes-tw.json）：
 * (1) 姓氏筆畫少的在前 (2) 同姓的放在一起，再依名字逐字筆畫 (3) 不同姓但筆畫相同，依名字逐字筆畫
 * 新會員名字裡若有表中沒有的字，建置時會提醒補上筆畫
 */
const stroke = (c: string) => {
  const n = (STROKES as Record<string, number>)[c];
  if (n == null) console.warn(`[筆畫] 缺少「${c}」的筆畫資料，請補到 src/lib/strokes-tw.json`);
  return n ?? 99;
};
const givenKey = (name: string) => [...name.slice(1)].map(stroke);
const cmpArr = (a: number[], b: number[]) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] ?? 0) - (b[i] ?? 0); if (d) return d; }
  return 0;
};
export function sortByStrokes<T extends { name: string }>(list: T[]): T[] {
  // 每個姓氏的代表鍵：該姓氏中名字筆畫最小的那位，讓同姓的人排在一起
  const best = new Map<string, number[]>();
  for (const m of list) {
    const s = m.name[0], k = givenKey(m.name);
    const cur = best.get(s);
    if (!cur || cmpArr(k, cur) < 0) best.set(s, k);
  }
  return [...list].sort((a, b) =>
    stroke(a.name[0]) - stroke(b.name[0]) ||
    cmpArr(best.get(a.name[0])!, best.get(b.name[0])!) ||
    a.name[0].localeCompare(b.name[0], "zh-Hant") ||
    cmpArr(givenKey(a.name), givenKey(b.name))
  );
}

export function getCases(): Case[] {
  return readDir("cases", (slug, d, body) => ({
    slug,
    title: str(d.title),
    date: toDate(d.date),
    summary: str(d.summary),
    members: arr(d.members),
    roles: (d.roles as Record<string, string>) ?? {},
    tags: arr(d.tags),
    cover: str(d.cover),
    heroImage: str(d.heroImage),
    heroImageMobile: str(d.heroImageMobile),
    featured: Boolean(d.featured),
    featuredOrder: Number(d.featuredOrder ?? 999),
    html: marked.parse(body) as string,
  })).sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedCases(limit = 4): Case[] {
  return getCases()
    .filter((c) => c.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, limit);
}

export function getEducation(): Education[] {
  return readDir("education", (slug, d, body) => {
    const p = (d.podcast as Record<string, unknown>) ?? {};
    return {
      slug,
      title: str(d.title),
      week: Number(d.week ?? 0),
      date: toDate(d.date),
      summary: str(d.summary),
      podcast: { episode: str(p.episode), titleEn: str(p.titleEn), url: str(p.url) },
      relatedCases: arr(d.relatedCases),
      tags: arr(d.tags),
      cover: str(d.cover),
      body,
      html: marked.parse(body.replace(/^\s*---\s*$/gm, "")) as string,
    };
  }).sort((a, b) => b.week - a.week);
}

/** 投影模式：以單獨一行的 --- 切成一張張投影片 */
export function toSlides(body: string): string[] {
  return body
    .split(/^\s*---\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => marked.parse(s) as string);
}

export function neighbors<T>(list: T[], idx: number) {
  return { prev: idx > 0 ? list[idx - 1] : undefined, next: idx < list.length - 1 ? list[idx + 1] : undefined };
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** 案例牽涉的產業：由參與會員自動推導，不必手動填 */
export function industriesOf(memberSlugs: string[], members: Member[] = getMembers()): string[] {
  const set = new Set<string>();
  memberSlugs.forEach((s) => { const m = members.find((x) => x.slug === s); if (m) set.add(m.industry); });
  return [...set];
}

/** 某位會員合作過的夥伴與次數：由案例自動推導 */
export function partnersOf(slug: string, cases: Case[] = getCases(), members: Member[] = getMembers()) {
  const count = new Map<string, number>();
  cases.filter((c) => c.members.includes(slug)).forEach((c) =>
    c.members.filter((s) => s !== slug).forEach((s) => count.set(s, (count.get(s) ?? 0) + 1))
  );
  const list = [...count.entries()]
    .map(([s, n]) => ({ member: members.find((m) => m.slug === s), times: n }))
    .filter((x): x is { member: Member; times: number } => !!x.member);
  const order = sortByStrokes(members).map((m) => m.slug);
  return list.sort((a, b) => order.indexOf(a.member.slug) - order.indexOf(b.member.slug));
}
