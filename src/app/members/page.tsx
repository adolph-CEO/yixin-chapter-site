import { Suspense } from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/schema";
import MemberBrowser from "@/components/MemberBrowser";
import SectionTitle from "@/components/SectionTitle";
import { getMembers, site } from "@/lib/content";

export const metadata: Metadata = { title: "會員", description: "億鑫分會會員的專業、擅長項目與想找的合作夥伴。", alternates: { canonical: "/members" }, openGraph: { title: "會員", description: "億鑫分會會員的專業、擅長項目與想找的合作夥伴。", url: "/members", images: ["/og.png"] } };

export default function MembersPage() {
  const members = getMembers().map(({ slug, name, company, title, industry, specialty, photo }) => ({ slug, name, company, title, industry, specialty, photo }));
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "會員", path: "/members" }])} />
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
      <SectionTitle eyebrow="Members" title="會員" desc="每一位會員都是一個產業的窗口。依產業篩選，找到你需要的專業，也看看他們正在找誰合作。" />
      <Suspense fallback={null}>
        <MemberBrowser members={members} industries={site.industries} />
      </Suspense>
    </div>
    </>
  );
}
