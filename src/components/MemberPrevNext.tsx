"use client";
import { useSearchParams } from "next/navigation";
import PrevNext from "./PrevNext";

type M = { slug: string; name: string; industry: string };

/** 上一位、下一位跟著篩選條件走：從工程類進來，就只在工程類之間切換 */
export default function MemberPrevNext({ all, slug }: { all: M[]; slug: string }) {
  const industry = useSearchParams().get("industry") ?? "";
  const list = industry ? all.filter((m) => m.industry === industry) : all;
  const idx = list.findIndex((m) => m.slug === slug);
  const q = industry ? `?industry=${encodeURIComponent(industry)}` : "";
  const at = (m?: M) => (m ? { href: `/members/${m.slug}${q}`, title: m.name } : undefined);
  const prev = idx > 0 ? list[idx - 1] : undefined;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined;
  return (
    <PrevNext prev={at(prev)} next={at(next)}
      prevLabel={industry ? `上一位 · ${industry}` : "上一位"} nextLabel={industry ? `下一位 · ${industry}` : "下一位"}
      backHref={`/members${q}`} backLabel={industry ? `回到${industry}` : "全部會員"} />
  );
}
