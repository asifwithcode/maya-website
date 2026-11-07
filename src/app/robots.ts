import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/track", "/en/track"] },
    sitemap: "https://themaya.site/sitemap.xml",
  };
}
