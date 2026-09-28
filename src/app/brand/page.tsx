import type { Metadata } from "next";
import { Block, Column } from "@/components/Detail";
import { IndustryTag, PartnerTag, PlainTag } from "@/components/Tags";

export const metadata: Metadata = { title: "視覺規範", robots: { index: false } };

const BRAND = [
  { name: "藏紅", hex: "#A3243B", token: "--accent", use: "行動與強調：主要按鈕、產業標籤、分隔短線、進度條。面積控制在一成以內，越少越有力。", fg: "#fff" },
  { name: "靛藍", hex: "#1F3A68", token: "--indigo", use: "結構與信任：品牌字、次要按鈕、選中狀態、夥伴標籤、Hero 外框。", fg: "#fff" },
  { name: "靛藍深", hex: "#13244A", token: "--dark", use: "深色區塊：首頁三大分區、頁尾、分會即品牌 Hero、投影模式。", fg: "#fff" },
];
const SUPPORT = [
  { name: "藏紅深", hex: "#7F1B2D", token: "--accent-deep", use: "藏紅按鈕的 hover" },
  { name: "藏紅淺", hex: "#EC8797", token: "--accent-light", use: "只用在靛藍深底上的小字（對比 6:1）" },
  { name: "藏紅淡底", hex: "#F7EAEC", token: "--accent-soft", use: "提示框底色" },
  { name: "靛藍淡底", hex: "#E9EDF4", token: "--indigo-soft", use: "夥伴標籤、Hero 背景細線" },
  { name: "墨", hex: "#161E30", token: "--ink", use: "標題與內文，帶靛藍的黑，不用純黑" },
  { name: "灰字", hex: "#646B78", token: "--muted", use: "說明文字、日期、標籤名" },
  { name: "暖灰底", hex: "#F4F3EF", token: "--soft", use: "柔和卡片底色" },
  { name: "分隔線", hex: "#E6E3DE", token: "--line", use: "細線與框線" },
];

export default function BrandPage() {
  return (
    <Column>
      <div className="eyebrow text-accent">Visual Guidelines v0.1</div>
      <h1 className="headline text-4xl md:text-5xl mt-4">視覺規範</h1>
      <p className="mt-5 text-muted leading-8">
        兩個固定品牌色各有分工：靛藍負責讓人信任，藏紅負責讓人行動。靛藍是底，藏紅是點；
        一個畫面裡，藏紅出現的地方就是希望對方下一步去的地方。
      </p>

      <Block title="品牌色">
        <div className="grid sm:grid-cols-3 gap-4">
          {BRAND.map((c) => (
            <div key={c.hex} className="rounded-2xl overflow-hidden border border-line">
              <div className="h-28 p-4 flex items-end" style={{ background: c.hex, color: c.fg }}>
                <span className="headline text-2xl">{c.name}</span>
              </div>
              <div className="p-4 text-sm">
                <div className="num tracking-widest">{c.hex}</div>
                <div className="text-xs text-muted mt-0.5">{c.token}</div>
                <p className="mt-3 text-muted leading-6">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="輔助色">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SUPPORT.map((c) => (
            <div key={c.hex}>
              <div className="h-16 rounded-xl border border-line" style={{ background: c.hex }} />
              <div className="mt-2 text-sm font-bold">{c.name}</div>
              <div className="num text-xs tracking-widest text-muted">{c.hex}</div>
              <p className="text-xs text-muted leading-5 mt-1">{c.use}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="比例">
        <div className="flex h-12 rounded-xl overflow-hidden text-[11px] font-bold">
          <div className="flex items-center justify-center bg-paper border border-line" style={{ width: "60%" }}>白 60%</div>
          <div className="flex items-center justify-center bg-soft" style={{ width: "15%" }}>暖灰 15%</div>
          <div className="flex items-center justify-center bg-dark text-white" style={{ width: "17%" }}>靛藍 17%</div>
          <div className="flex items-center justify-center bg-accent text-white" style={{ width: "8%" }}>藏紅</div>
        </div>
        <p className="mt-4 text-sm text-muted leading-7">白與暖灰撐出留白，靛藍給結構和份量，藏紅只點在行動上。藏紅一旦變多，就不再是重點。</p>
      </Block>

      <Block title="元件">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="inline-flex bg-accent text-white px-6 py-3 text-sm font-bold tracking-[0.2em]">主要行動</span>
          <span className="inline-flex bg-indigo text-white px-6 py-3 text-sm font-bold tracking-[0.2em]">次要行動</span>
          <span className="inline-flex border border-line rounded-full px-5 py-2 text-sm font-bold">文字按鈕</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <IndustryTag name="工程營建" />
          <PartnerTag slug="sample-engineering-01" name="範例會員 01" />
          <span className="rounded-full bg-indigo text-white px-3 py-1 text-xs font-bold">想找的夥伴</span>
          <PlainTag name="Power Team" />
        </div>
      </Block>

      <Block title="字體">
        <div className="space-y-4">
          <div className="headline text-4xl">標題 Noto Serif TC 900</div>
          <p className="text-sm text-muted">H1 到 H4 與所有大標一律使用襯線體，給分會一點書卷氣與份量；內文用無襯線體，長文好讀。</p>
          <div className="text-lg">內文 Noto Sans TC 400，行高 1.95，讓長文讀起來不累。</div>
          <div className="eyebrow text-accent">Oswald · English Label & Numbers 01 / 04</div>
        </div>
      </Block>
    </Column>
  );
}
