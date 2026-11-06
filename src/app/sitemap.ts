import type { MetadataRoute } from "next";

const BASE = "https://maya.xentoryxlabs.site";

// Each page in English and Bangla, linked to each other.
const PAGES: { en: string; bn: string; priority: number }[] = [
  { en: "/", bn: "/bn", priority: 1 },
  { en: "/docs", bn: "/bn/docs", priority: 0.8 },
  { en: "/privacy", bn: "/bn/privacy", priority: 0.3 },
  { en: "/terms", bn: "/bn/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ en, bn, priority }) => {
    const languages = { en: `${BASE}${en}`, bn: `${BASE}${bn}` };
    return [
      { url: `${BASE}${en}`, priority, alternates: { languages } },
      { url: `${BASE}${bn}`, priority, alternates: { languages } },
    ];
  });
}
