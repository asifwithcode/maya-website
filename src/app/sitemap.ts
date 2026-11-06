import type { MetadataRoute } from "next";

const BASE = "https://maya.xentoryxlabs.site";

// Each page in Bangla (default, plain path) and English (/en), linked to each other.
const PAGES: { bn: string; en: string; priority: number }[] = [
  { bn: "/", en: "/en", priority: 1 },
  { bn: "/docs", en: "/en/docs", priority: 0.8 },
  { bn: "/privacy", en: "/en/privacy", priority: 0.3 },
  { bn: "/terms", en: "/en/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ bn, en, priority }) => {
    const languages = { bn: `${BASE}${bn}`, en: `${BASE}${en}` };
    return [
      { url: `${BASE}${bn}`, priority, alternates: { languages } },
      { url: `${BASE}${en}`, priority, alternates: { languages } },
    ];
  });
}
