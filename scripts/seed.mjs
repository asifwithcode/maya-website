// Fills an empty database with the current site content and imports the old local preorders.
// Safe to re-run: existing rows are left alone.   npm run db:seed
import { existsSync, readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { count } from "drizzle-orm";
import * as schema from "../src/db/schema.ts";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");
const db = drizzle(neon(process.env.DATABASE_URL), { schema });

const PRICING = { maya: 3490, collector: 4490, accessory: 249, mini: 79, delivery: { dhaka: 70, outside: 130 } };

const EDITIONS = [
  ["bunny", "Bunny", "Bunny Edition", "বানি এডিশন", "Bunny ears", "খরগোশের কান", "Curious eyes", "কৌতূহলী চোখ", "#fbe7ef"],
  ["panda", "Panda", "Panda Edition", "পান্ডা এডিশন", "Panda ears", "পান্ডার কান", "Big round eyes", "বড় গোল চোখ", "#f1eee8"],
  ["crown", "Crown", "Royal Edition", "রয়্যাল এডিশন", "Gold crown with gems", "রত্নখচিত সোনালি মুকুট", "Wink", "চোখ টিপ", "#fbeedb"],
  ["sprout", "Sprout", "Sprout Edition", "চারা এডিশন", "Little green sprout", "ছোট্ট সবুজ চারা", "Sleepy eyes", "ঘুম ঘুম চোখ", "#ebf4e7"],
  ["headphones", "Headphones", "Beats Edition", "বিটস এডিশন", "Dark pink headphones", "গাঢ় গোলাপি হেডফোন", "Happy eyes", "খুশি চোখ", "#fff2c9"],
  ["backpack", "Backpack", "Explorer Edition", "এক্সপ্লোরার এডিশন", "Backpack with pocket", "পকেটওয়ালা ব্যাকপ্যাক", "Heart eyes", "হার্ট চোখ", "#e4ecf6"],
];

await db.insert(schema.settings).values({ key: "pricing", value: PRICING }).onConflictDoNothing();

await db
  .insert(schema.editions)
  .values(
    EDITIONS.map(([slug, variant, nameEn, nameBn, accessoryEn, accessoryBn, eyesEn, eyesBn, tint], i) => ({
      slug, variant, nameEn, nameBn, accessoryEn, accessoryBn, eyesEn, eyesBn, tint, sortOrder: i,
    })),
  )
  .onConflictDoNothing();

// old file-backed preorders (data/preorders.json), only into an empty table
const [{ n }] = await db.select({ n: count() }).from(schema.preorders);
let imported = 0;
if (n === 0 && existsSync("data/preorders.json")) {
  const old = JSON.parse(readFileSync("data/preorders.json", "utf-8"));
  if (old.length) {
    await db.insert(schema.preorders).values(
      old.map((p) => ({ name: p.name, email: p.email, variant: p.variant, qty: p.qty ?? 1, createdAt: new Date(p.submittedAt) })),
    );
    imported = old.length;
  }
}

const [{ e }] = await db.select({ e: count() }).from(schema.editions);
const [{ p }] = await db.select({ p: count() }).from(schema.preorders);
console.log(`editions: ${e}, preorders: ${p} (imported now: ${imported}), pricing: set`);
