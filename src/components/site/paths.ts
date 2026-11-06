// URL of each page per language. Bangla is the default: it lives at the plain paths
// (/, /docs, /privacy, /terms); English is under /en. Old /bn/... links redirect (next.config.ts).
export type Page = "" | "docs" | "privacy" | "terms";

export function pathFor(lang: "en" | "bn", page: Page = ""): string {
  if (lang === "bn") return page ? `/${page}` : "/";
  return page ? `/en/${page}` : "/en";
}
