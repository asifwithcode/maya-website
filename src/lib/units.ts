import "server-only";
import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { preorders, stock, units, type Unit } from "@/db/schema";

/*
 * Built units (from the desktop tool) and the website stock move together:
 * - unit_add puts a unit in stock: stock[variant] +1.
 * - unit_remove takes an in-stock unit out: stock[variant] −1.
 * - an order takes stock as before and reserves the oldest in-stock units of its variant;
 *   delivery marks them sold; cancel/return/delete-with-restock puts them back in stock.
 * Stock set by hand (without units) still works: orders then reserve as many units as exist.
 */

type Tx = Parameters<Parameters<ReturnType<typeof db>["transaction"]>[0]>[0];

export class UnitError extends Error {
  constructor(
    public code: "unit_busy" | "variant_mismatch" | "not_found" | "bad_input" | "invalid_variant" | "order_not_active",
    message?: string,
  ) {
    super(message ?? code);
  }
}

const UNIT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/;
export const validUnitId = (id: unknown): id is string => typeof id === "string" && UNIT_ID.test(id);

async function bumpStock(tx: Tx, variant: string, delta: number, now: Date) {
  if (delta > 0) {
    await tx
      .insert(stock)
      .values({ variant, qty: delta, updatedAt: now })
      .onConflictDoUpdate({ target: stock.variant, set: { qty: sql`${stock.qty} + ${delta}`, updatedAt: now } });
  } else if (delta < 0) {
    await tx
      .update(stock)
      .set({ qty: sql`greatest(${stock.qty} - ${-delta}, 0)`, updatedAt: now })
      .where(eq(stock.variant, variant));
  }
}

async function stockOf(tx: Tx, variant: string) {
  const [r] = await tx.select({ qty: stock.qty }).from(stock).where(eq(stock.variant, variant));
  return { variant, qty: r?.qty ?? 0 };
}

/* ------------------------------------------------------------------ order hooks (inside the order's transaction) */

/** Reserves up to `qty` of the oldest in-stock units of `variant` for an order. */
export async function reserveUnitsFor(tx: Tx, orderId: number, variant: string, qty: number, now: Date) {
  const free = await tx
    .select({ unitId: units.unitId })
    .from(units)
    .where(and(eq(units.variant, variant), eq(units.status, "in_stock")))
    .orderBy(asc(units.addedAt), asc(units.unitId))
    .limit(qty)
    .for("update", { skipLocked: true });
  if (!free.length) return [];
  await tx
    .update(units)
    .set({ status: "reserved", orderId, updatedAt: now })
    .where(inArray(units.unitId, free.map((f) => f.unitId)));
  return free.map((f) => f.unitId);
}

/** Puts the units of these orders back in stock (cancel, return, delete with restock). Stock counts are handled by the caller. */
export async function releaseUnitsOf(tx: Tx, orderIds: number[], now: Date) {
  if (!orderIds.length) return;
  await tx
    .update(units)
    .set({ status: "in_stock", orderId: null, updatedAt: now })
    .where(and(inArray(units.orderId, orderIds), ne(units.status, "removed")));
}

/** Delivered orders' units are sold; moving back out of delivered makes them reserved again. */
export async function setOrderUnitsStatus(tx: Tx, orderId: number, status: "sold" | "reserved", now: Date) {
  await tx.update(units).set({ status, updatedAt: now }).where(and(eq(units.orderId, orderId), ne(units.status, "removed")));
}

/** Units of deleted orders that keep their stock out (restock off): they count as sold, no order. */
export async function detachUnitsOf(tx: Tx, orderIds: number[], now: Date) {
  if (!orderIds.length) return;
  await tx.update(units).set({ status: "sold", orderId: null, updatedAt: now }).where(inArray(units.orderId, orderIds));
}

/* ------------------------------------------------------------------ admin actions */

export async function unitAdd(unitId: string, variant: string, note: string | undefined, variants: string[]) {
  if (!validUnitId(unitId)) throw new UnitError("bad_input", "unitId: 2-64 letters, digits, . _ : -");
  if (!variants.includes(variant)) throw new UnitError("invalid_variant");
  return db().transaction(async (tx) => {
    const now = new Date();
    const [cur] = await tx.select().from(units).where(eq(units.unitId, unitId)).for("update");
    const noteSet = note !== undefined ? { note: note.trim().slice(0, 300) } : {};
    let changed = true;
    let unit: Unit;
    if (!cur) {
      [unit] = await tx.insert(units).values({ unitId, variant, status: "in_stock", addedAt: now, updatedAt: now, ...noteSet }).returning();
      await bumpStock(tx, variant, 1, now);
    } else if (cur.status === "removed") {
      [unit] = await tx
        .update(units)
        .set({ variant, status: "in_stock", orderId: null, updatedAt: now, ...noteSet })
        .where(eq(units.unitId, unitId))
        .returning();
      await bumpStock(tx, variant, 1, now);
    } else if (cur.status === "in_stock") {
      if (cur.variant === variant) {
        changed = note !== undefined && noteSet.note !== cur.note;
        [unit] = changed ? await tx.update(units).set({ ...noteSet, updatedAt: now }).where(eq(units.unitId, unitId)).returning() : [cur];
      } else {
        [unit] = await tx.update(units).set({ variant, updatedAt: now, ...noteSet }).where(eq(units.unitId, unitId)).returning();
        await bumpStock(tx, cur.variant, -1, now);
        await bumpStock(tx, variant, 1, now);
      }
    } else {
      throw new UnitError("unit_busy", `Unit is ${cur.status} on order #${cur.orderId ?? "?"}.`);
    }
    return { changed, unit, stock: await stockOf(tx, unit.variant) };
  });
}

export async function unitRemove(unitId: string) {
  if (!validUnitId(unitId)) throw new UnitError("bad_input");
  return db().transaction(async (tx) => {
    const now = new Date();
    const [cur] = await tx.select().from(units).where(eq(units.unitId, unitId)).for("update");
    if (!cur || cur.status === "removed") return { changed: false, unit: cur ?? null, stock: cur ? await stockOf(tx, cur.variant) : null };
    if (cur.status !== "in_stock") throw new UnitError("unit_busy", `Unit is ${cur.status} on order #${cur.orderId ?? "?"}.`);
    const [unit] = await tx.update(units).set({ status: "removed", orderId: null, updatedAt: now }).where(eq(units.unitId, unitId)).returning();
    await bumpStock(tx, cur.variant, -1, now);
    return { changed: true, unit, stock: await stockOf(tx, cur.variant) };
  });
}

/** Puts a specific unit on an order. If the order already holds enough units, the latest auto-reserved one goes back. */
export async function unitAssign(unitId: string, orderId: number) {
  if (!validUnitId(unitId)) throw new UnitError("bad_input");
  return db().transaction(async (tx) => {
    const now = new Date();
    const [order] = await tx.select().from(preorders).where(eq(preorders.id, orderId)).for("update");
    if (!order) throw new UnitError("not_found", "order not found");
    if (!order.stockHeld) throw new UnitError("order_not_active", "Order is cancelled or returned.");
    const [cur] = await tx.select().from(units).where(eq(units.unitId, unitId)).for("update");
    if (!cur) throw new UnitError("not_found", "unit not found");
    if (cur.variant !== order.variant) throw new UnitError("variant_mismatch", `Unit is ${cur.variant}, order is ${order.variant}.`);
    if (cur.orderId === orderId && cur.status !== "removed") return { changed: false, unit: cur, stock: await stockOf(tx, cur.variant) };
    if (cur.status !== "in_stock") throw new UnitError("unit_busy", `Unit is ${cur.status}${cur.orderId ? ` on order #${cur.orderId}` : ""}.`);

    const held = await tx
      .select()
      .from(units)
      .where(and(eq(units.orderId, orderId), ne(units.status, "removed")))
      .orderBy(desc(units.updatedAt))
      .for("update");
    if (held.length >= order.qty) {
      await tx.update(units).set({ status: "in_stock", orderId: null, updatedAt: now }).where(eq(units.unitId, held[0].unitId));
    }
    const [unit] = await tx
      .update(units)
      .set({ status: order.status === "delivered" ? "sold" : "reserved", orderId, updatedAt: now })
      .where(eq(units.unitId, unitId))
      .returning();
    return { changed: true, unit, stock: await stockOf(tx, cur.variant) };
  });
}

export async function listUnits(f: { variant?: string; status?: string; orderId?: number } = {}) {
  const where = [
    f.variant ? eq(units.variant, f.variant) : undefined,
    f.status ? eq(units.status, f.status) : undefined,
    f.orderId ? eq(units.orderId, f.orderId) : undefined,
  ].filter(Boolean);
  return db()
    .select()
    .from(units)
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(units.variant), asc(units.addedAt));
}

/** units per order id, for the order list. */
export async function unitsByOrder(): Promise<Record<number, string[]>> {
  const rows = await db()
    .select({ unitId: units.unitId, orderId: units.orderId })
    .from(units)
    .where(and(sql`${units.orderId} is not null`, ne(units.status, "removed")));
  const out: Record<number, string[]> = {};
  for (const r of rows) (out[r.orderId!] ??= []).push(r.unitId);
  return out;
}

/** in_stock / reserved / sold counts per variant. */
export async function unitCounts(): Promise<Record<string, { in_stock: number; reserved: number; sold: number }>> {
  const rows = await db()
    .select({ variant: units.variant, status: units.status, n: sql<number>`count(*)::int` })
    .from(units)
    .groupBy(units.variant, units.status);
  const out: Record<string, { in_stock: number; reserved: number; sold: number }> = {};
  for (const r of rows) {
    const c = (out[r.variant] ??= { in_stock: 0, reserved: 0, sold: 0 });
    if (r.status === "in_stock" || r.status === "reserved" || r.status === "sold") c[r.status] = r.n;
  }
  return out;
}

export const toApiUnit = (u: Unit) => ({
  unitId: u.unitId,
  variant: u.variant,
  status: u.status,
  orderId: u.orderId,
  note: u.note,
  addedAt: new Date(u.addedAt).toISOString(),
  updatedAt: new Date(u.updatedAt).toISOString(),
});
