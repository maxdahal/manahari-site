import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/artwork", "/recruiter", ...cases.map((c) => `/work/${c.slug}`)].map((p) => ({ url: `${SITE}${p}` }));
}
