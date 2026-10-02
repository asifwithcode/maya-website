import "server-only";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { preorders } from "@/db/schema";

export type NewPreorder = { name: string; email: string; variant: string; qty: number; lang: string };

/** Saves a reservation and returns how many there are now. */
export async function addPreorder(entry: NewPreorder): Promise<number> {
  await db().insert(preorders).values(entry);
  return countPreorders();
}

export async function countPreorders(): Promise<number> {
  const [{ n }] = await db().select({ n: count() }).from(preorders);
  return n;
}
