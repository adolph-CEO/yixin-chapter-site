import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, site } from "@/lib/content";

export const metadata: Metadata = {
  title: { default: `${site.chapterName}｜${site.tagline}`, template: `%s｜${site.chapterName}` },
  description: site.description,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: site.chapterName,
    title: `${site.chapterName}｜${site.tagline}`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.chapterName }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700;900&family=Oswald:wght@500;600&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-indigo focus:text-white focus:px-4 focus:py-2">
          跳到主要內容
        </a>
        <div aria-hidden className="side-rail">
          {Array.from({ length: 24 }, (_, i) => <span key={i}>TAINAN BNI</span>)}
        </div>
        {/* 品牌色帶：放在頁首之外（頁首的背景模糊會把 fixed 元素困在頁首裡），固定在最上層、橫跨整個畫面，蓋過左側長條 */}
        <div aria-hidden className="fixed top-0 left-0 right-0 z-[70] h-1 bg-indigo"><div className="h-full w-1/4 bg-accent" /></div>
        <div aria-hidden className="side-mark"><span>BNI</span></div>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
