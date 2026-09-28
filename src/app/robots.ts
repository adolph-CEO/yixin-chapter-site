import type { MetadataRoute } from "next";
import { abs } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/education/*/present", "/brand"] }],
    sitemap: abs("/sitemap.xml"),
  };
}
