import "server-only";
import { count } from "drizzle-orm";
import { db, hasDatabase } from "@/db";
import { preorders } from "@/db/schema";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "preorders.json");

export type NewPreorder = {
  name: string;
  email: string;
  variant: string;
  qty: number;
  lang?: string;
  phone?: string;
  address?: string;
  location?: string;
  submittedAt?: string;
};

async function readAllLocal(): Promise<NewPreorder[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as NewPreorder[];
  } catch {
    return [];
  }
}

/** Saves a reservation and returns how many there are now. Supports Postgres DB & local fallback. */
export async function addPreorder(entry: NewPreorder): Promise<number> {
  if (hasDatabase()) {
    try {
      const extraNotes = [
        entry.phone ? `Phone: ${entry.phone}` : "",
        entry.address ? `Address: ${entry.address}` : "",
        entry.location ? `Location: ${entry.location}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      await db()
        .insert(preorders)
        .values({
          name: entry.name,
          email: entry.email,
          variant: entry.variant,
          qty: entry.qty,
          lang: entry.lang ?? "en",
          note: extraNotes,
        });

      return await countPreorders();
    } catch (err) {
      console.warn("DB insert failed, writing to fallback store:", err);
    }
  }

  // File fallback for local dev when DATABASE_URL is not set
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAllLocal();
  all.push({ ...entry, submittedAt: entry.submittedAt ?? new Date().toISOString() });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return all.length;
}

export async function countPreorders(): Promise<number> {
  if (hasDatabase()) {
    try {
      const [{ n }] = await db().select({ n: count() }).from(preorders);
      return n;
    } catch (err) {
      console.warn("DB count failed, falling back to local store:", err);
    }
  }
  const all = await readAllLocal();
  return all.length;
}
