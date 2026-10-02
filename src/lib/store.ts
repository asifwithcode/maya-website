import { promises as fs } from "fs";
import path from "path";

// Local, file-backed preorder store. Good enough for running this site with
// `npm run dev`/`next start` on a single persistent machine - it is NOT
// suitable behind a serverless/edge deploy (Vercel etc.), where the
// filesystem is read-only or reset between invocations. Swap this module
// for a real database (Postgres, Supabase, the existing Backend/ service...)
// before shipping this beyond local use.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "preorders.json");

export type Preorder = {
  name: string;
  email: string;
  variant: string;
  qty: number;
  submittedAt: string;
};

async function readAll(): Promise<Preorder[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Preorder[];
  } catch {
    return [];
  }
}

export async function addPreorder(entry: Preorder): Promise<number> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAll();
  all.push(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return all.length;
}

export async function countPreorders(): Promise<number> {
  const all = await readAll();
  return all.length;
}
