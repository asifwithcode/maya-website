import { asc } from "drizzle-orm";
import Image from "next/image";
import { db } from "@/db";
import { editions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { saveEdition } from "../actions";

const FIELDS = [
  ["nameEn", "Name (English)"],
  ["nameBn", "নাম (বাংলা)"],
  ["accessoryEn", "Accessory (English)"],
  ["accessoryBn", "অ্যাক্সেসরি (বাংলা)"],
  ["eyesEn", "Eyes (English)"],
  ["eyesBn", "চোখ (বাংলা)"],
] as const;

export default async function EditionsPage() {
  await requireAdmin();
  const rows = await db().select().from(editions).orderBy(asc(editions.sortOrder), asc(editions.id));
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Editions</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Shown on the site and in the reserve form. Leave the price empty to use the standard Maya price. Saving updates the
        live site.
      </p>
      <div className="mt-6 space-y-4">
        {rows.map((e) => (
          <form key={e.id} action={saveEdition} className="grid gap-5 rounded-2xl bg-card p-5 ring-1 ring-ink/10 md:grid-cols-[7rem_1fr]">
            <input type="hidden" name="id" value={e.id} />
            <div className="relative aspect-[5/6] overflow-hidden rounded-xl" style={{ background: e.tint }}>
              <Image src={`/showcase/art/maya-${e.slug}.svg`} alt="" fill unoptimized sizes="112px" className="object-contain object-bottom p-2" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="font-semibold">{e.slug}</span>
                  <span className="ml-2 text-ink-faint">form value: {e.variant}</span>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={e.active} /> Show on site
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {FIELDS.map(([k, label]) => (
                  <label key={k} className="block">
                    <span className="text-xs text-ink-faint">{label}</span>
                    <input name={k} defaultValue={e[k]} required className="field-input-light" />
                  </label>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs text-ink-faint">Price ৳ (empty = standard)</span>
                  <input name="price" type="number" min={0} defaultValue={e.price ?? ""} className="field-input-light" />
                </label>
                <label className="block">
                  <span className="text-xs text-ink-faint">Card colour</span>
                  <input name="tint" type="color" defaultValue={e.tint} className="mt-2 h-9 w-full cursor-pointer rounded-lg bg-transparent" />
                </label>
                <label className="block">
                  <span className="text-xs text-ink-faint">Order</span>
                  <input name="sortOrder" type="number" min={0} defaultValue={e.sortOrder} className="field-input-light" />
                </label>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-eye-deep hover:text-white">Save</button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
