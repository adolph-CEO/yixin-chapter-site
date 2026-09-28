import { abs, getCases, getEducation, getMembers, industriesOf, site } from "@/lib/content";

export const dynamic = "force-static";

/** 給 AI 助理讀的網站摘要（llms.txt）：讓 ChatGPT、Claude、Perplexity 能正確介紹分會與會員 */
export function GET() {
  const members = getMembers();
  const lines: string[] = [
    `# ${site.chapterName}（${site.chapterNameEn}）`,
    "",
    `> ${site.description}`,
    "",
    `${site.chapterName}是台南的 BNI 分會。例會時間：${site.meeting.day} ${site.meeting.time}，地點：${site.meeting.place}。`,
    "",
    "## 會員",
    ...members.map((m) =>
      `- [${m.name}｜${m.company}](${abs(`/members/${m.slug}`)})：${m.industry}，專長${m.specialty}。擅長${m.skills.map((s) => s.name).join("、")}。想找的合作夥伴：${m.seekingPartners.join("、")}。`
    ),
    "",
    "## Power Team 協作案例",
    ...getCases().map((c) => `- [${c.title}](${abs(`/cases/${c.slug}`)})：${c.summary}（跨產業：${industriesOf(c.members, members).join("、")}）`),
    "",
    "## 每週 BNI 商務價值教育",
    ...getEducation().map((e) => `- [第 ${e.week} 週｜${e.title}](${abs(`/education/${e.slug}`)})：${e.summary}（出處：The Official BNI Podcast Episode ${e.podcast.episode}）`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
