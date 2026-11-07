// Fills an empty database with the products: pricing, the six editions and a stock row for every
// orderable variant (six editions + "Collector's Set"). No orders. Safe to re-run: existing rows are
// left alone, so prices and stock set in the admin are never overwritten.   npm run db:seed
import { pool } from "./db.mjs";

const PRICING = { maya: 3490, collector: 4490, accessory: 249, mini: 79, delivery: { dhaka: 70, outside: 130 } };

// slug, variant, name en/bn, accessory en/bn, eyes en/bn, tint   (editions 1-6 in "3D File")
const EDITIONS = [
  ["bunny", "Bunny", "Bunny Edition", "বানি এডিশন", "Bunny ears", "খরগোশের কান", "Curious eyes", "কৌতূহলী চোখ", "#fbe7ef"],
  ["panda", "Panda", "Panda Edition", "পান্ডা এডিশন", "Panda ears", "পান্ডার কান", "Big round eyes", "বড় গোল চোখ", "#f1eee8"],
  ["crown", "Crown", "Royal Edition", "রয়্যাল এডিশন", "Gold crown with gems", "রত্নখচিত সোনালি মুকুট", "Wink", "চোখ টিপ", "#fbeedb"],
  ["sprout", "Sprout", "Sprout Edition", "চারা এডিশন", "Little green sprout", "ছোট্ট সবুজ চারা", "Sleepy eyes", "ঘুম ঘুম চোখ", "#ebf4e7"],
  ["headphones", "Headphones", "Beats Edition", "বিটস এডিশন", "Dark pink headphones", "গাঢ় গোলাপি হেডফোন", "Happy eyes", "খুশি চোখ", "#fff2c9"],
  ["backpack", "Backpack", "Explorer Edition", "এক্সপ্লোরার এডিশন", "Backpack with pocket", "পকেটওয়ালা ব্যাকপ্যাক", "Heart eyes", "হার্ট চোখ", "#e4ecf6"],
];
const COMBO_VARIANT = "Collector's Set"; // 7_Complete_Collection
const START_STOCK = Math.max(0, Math.trunc(Number(process.env.SEED_STOCK ?? 0)) || 0);

const p = pool();
await p.query(
  `insert into settings (key, value) values ('pricing', $1) on conflict (key) do nothing`,
  [JSON.stringify(PRICING)],
);
for (const [i, [slug, variant, nameEn, nameBn, accEn, accBn, eyesEn, eyesBn, tint]] of EDITIONS.entries()) {
  await p.query(
    `insert into editions (slug, variant, name_en, name_bn, accessory_en, accessory_bn, eyes_en, eyes_bn, tint, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) on conflict do nothing`,
    [slug, variant, nameEn, nameBn, accEn, accBn, eyesEn, eyesBn, tint, i],
  );
}
for (const variant of [...EDITIONS.map((e) => e[1]), COMBO_VARIANT]) {
  await p.query(`insert into stock (variant, qty) values ($1, $2) on conflict (variant) do nothing`, [variant, START_STOCK]);
}
const count = async (t) => (await p.query(`select count(*)::int as n from ${t}`)).rows[0].n;
console.log(`editions: ${await count("editions")}, stock rows: ${await count("stock")}, orders: ${await count("preorders")}, pricing: set`);
await p.end();
