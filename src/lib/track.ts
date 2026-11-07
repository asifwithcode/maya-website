import "server-only";
import { createHash } from "node:crypto";
import { desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { preorders, trackHits, type Preorder } from "@/db/schema";
import { normalizeStatus } from "@/db/statuses";
import { getCatalog } from "./shop";

/* Public order tracking. Anyone can type an order number or a phone number, so:
 * - names, phones and addresses are always masked (order numbers are sequential and guessable);
 * - a phone lookup lists only orders with that phone;
 * - each IP gets LIMIT lookups per 10 minutes (stored hashed in the database, works across instances). */

export const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

const hashIp = (ip: string) =>
  createHash("sha256")
    .update(`${ip}|${process.env.WEB_ADMIN_TOKEN ?? "maya-track"}`)
    .digest("hex")
    .slice(0, 32);

/** Counts this lookup; false when the IP is over the limit. */
export async function allowLookup(ip: string): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS);
  const [row] = await db()
    .insert(trackHits)
    .values({ ipHash: hashIp(ip), windowStart, hits: 1 })
    .onConflictDoUpdate({ target: [trackHits.ipHash, trackHits.windowStart], set: { hits: sql`${trackHits.hits} + 1` } })
    .returning({ hits: trackHits.hits });
  if (Math.random() < 0.05) {
    await db().delete(trackHits).where(lt(trackHits.windowStart, new Date(Date.now() - 24 * 3600 * 1000)));
  }
  return row.hits <= LIMIT;
}

/* masking */
const maskWord = (w: string) => {
  const chars = [...w];
  return chars.length <= 1 ? w : chars[0] + "*".repeat(Math.min(chars.length - 1, 6));
};
export const maskName = (name: string) => name.trim().split(/\s+/).filter(Boolean).map(maskWord).join(" ") || "—";
export const maskPhone = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length < 6 ? "***" : `${d.slice(0, 3)}${"*".repeat(Math.max(3, d.length - 5))}${d.slice(-2)}`;
};
/** Only the last part of the address (usually the city), the rest hidden. */
export const maskAddress = (a: string) => {
  const parts = a.split(/[,،]/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 ? `***, ${parts[parts.length - 1]}` : "***";
};

export type Lookup = { kind: "order"; id: number } | { kind: "phone"; digits: string } | null;

/** "MAYA-0007", "#7", "7" → order 7; 10–15 digits → phone. */
export function parseQuery(q: string): Lookup {
  const s = q.trim().replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  const order = s.match(/^(?:#|maya[-\s]?)?\s*0*(\d{1,6})$/i);
  if (order && Number(order[1]) > 0) return { kind: "order", id: Number(order[1]) };
  const digits = s.replace(/[\s()+-]/g, "");
  if (/^\d{10,15}$/.test(digits)) return { kind: "phone", digits };
  return null;
}

export async function findOrders(l: NonNullable<Lookup>): Promise<Preorder[]> {
  if (l.kind === "order") return db().select().from(preorders).where(eq(preorders.id, l.id));
  const last10 = l.digits.slice(-10);
  return db()
    .select()
    .from(preorders)
    .where(sql`right(regexp_replace(${preorders.phone}, '[^0-9]', '', 'g'), 10) = ${last10}`)
    .orderBy(desc(preorders.createdAt))
    .limit(10);
}

/** What the public page may see. */
export async function toPublic(rows: Preorder[]) {
  const { items } = await getCatalog();
  return rows.map((r) => {
    const item = items.find((i) => i.variant === r.variant);
    return {
      ref: `MAYA-${String(r.id).padStart(4, "0")}`,
      createdAt: new Date(r.createdAt).toISOString(),
      status: normalizeStatus(r.status) ?? "new",
      timeline: (r.history ?? []).map((h) => ({ status: normalizeStatus(h.status) ?? h.status, at: h.at })),
      courier: r.courier,
      trackingNo: r.trackingNo,
      item: item ? item.name : { en: r.variant, bn: r.variant },
      qty: r.qty,
      total: r.total,
      due: Math.max(0, r.total - r.paid),
      name: maskName(r.name),
      phone: maskPhone(r.phone),
      area: maskAddress(r.address),
      zone: r.location === "outside" ? "outside" : "dhaka",
    };
  });
}
export type PublicOrder = Awaited<ReturnType<typeof toPublic>>[number];
