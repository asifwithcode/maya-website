import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, hasDatabase } from "./index";
import { editions, settings, type Pricing } from "./schema";
import { EDITIONS as FALLBACK_EDITIONS, PRICING as FALLBACK_PRICING } from "@/components/site/data";
import type { SiteContent, SiteEdition } from "@/components/site/content";

const BN_FALLBACK: Record<string, [string, string, string]> = {
  bunny: ["বানি এডিশন", "খরগোশের কান", "কৌতূহলী চোখ"],
  panda: ["পান্ডা এডিশন", "পান্ডার কান", "বড় গোল চোখ"],
  crown: ["রয়্যাল এডিশন", "রত্নখচিত সোনালি মুকুট", "চোখ টিপ"],
  sprout: ["চারা এডিশন", "ছোট্ট সবুজ চারা", "ঘুম ঘুম চোখ"],
  headphones: ["বিটস এডিশন", "গাঢ় গোলাপি হেডফোন", "খুশি চোখ"],
  backpack: ["এক্সপ্লোরার এডিশন", "পকেটওয়ালা ব্যাকপ্যাক", "হার্ট চোখ"],
};

export const FALLBACK: SiteContent = {
  pricing: FALLBACK_PRICING,
  editions: FALLBACK_EDITIONS.map((e) => ({
    slug: e.look,
    variant: e.variant,
    name: { en: e.name, bn: BN_FALLBACK[e.look][0] },
    accessory: { en: e.accessory, bn: BN_FALLBACK[e.look][1] },
    eyes: { en: e.eyes, bn: BN_FALLBACK[e.look][2] },
    tint: e.tint,
    price: null,
  })),
};

/** Prices and editions for the public site. Falls back to the built-in content if the database is unreachable. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasDatabase()) return FALLBACK;
  try {
    const [rows, pricingRow] = await Promise.all([
      db().select().from(editions).where(eq(editions.active, true)).orderBy(asc(editions.sortOrder), asc(editions.id)),
      db().select().from(settings).where(eq(settings.key, "pricing")),
    ]);
    const pricing = { ...FALLBACK_PRICING, ...((pricingRow[0]?.value as Partial<Pricing>) ?? {}) };
    const list: SiteEdition[] = rows.map((r) => ({
      slug: r.slug,
      variant: r.variant,
      name: { en: r.nameEn, bn: r.nameBn },
      accessory: { en: r.accessoryEn, bn: r.accessoryBn },
      eyes: { en: r.eyesEn, bn: r.eyesBn },
      tint: r.tint,
      price: r.price,
    }));
    return { pricing, editions: list.length ? list : FALLBACK.editions };
  } catch (err) {
    console.error("getSiteContent: using fallback content", err);
    return FALLBACK;
  }
}
