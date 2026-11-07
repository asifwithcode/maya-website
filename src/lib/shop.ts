import "server-only";
import { and, count, desc, eq, gt, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { preorders, stock, type OrderHistoryEntry, type Preorder } from "@/db/schema";
import { getSiteContent } from "@/db/content";
import { COMBO } from "@/components/site/data";
import { normalizeStatus, RELEASES_STOCK, type OrderStatus } from "@/db/statuses";
import { detachUnitsOf, releaseUnitsOf, reserveUnitsFor, setOrderUnitsStatus, unitCounts } from "./units";

/** The bilingual name of the combo; editions take theirs from the database. */
const COMBO_NAME = { en: "Complete Collection", bn: "কমপ্লিট কালেকশন" };

/** Orders at or below this many left show "only N left" on the site. */
export const LOW_STOCK = 5;

export class ShopError extends Error {
  constructor(
    public code: "out_of_stock" | "invalid_variant" | "not_found" | "bad_status" | "bad_input",
    message?: string,
  ) {
    super(message ?? code);
  }
}

export type CatalogItem = {
  variant: string;
  slug: string;
  name: { en: string; bn: string };
  price: number;
  active: boolean;
};

/** Everything that can be ordered: the active editions plus the Complete Collection. */
export async function getCatalog(): Promise<{ items: CatalogItem[]; delivery: { dhaka: number; outside: number } }> {
  const { editions, pricing } = await getSiteContent();
  const items: CatalogItem[] = editions.map((e) => ({
    variant: e.variant,
    slug: e.slug,
    name: e.name,
    price: e.price ?? pricing.maya,
    active: true,
  }));
  items.push({ variant: COMBO.variant, slug: "collection", name: COMBO_NAME, price: pricing.collector, active: true });
  return { items, delivery: pricing.delivery };
}

export async function getStockMap(): Promise<Record<string, number>> {
  const rows = await db().select().from(stock);
  return Object.fromEntries(rows.map((r) => [r.variant, r.qty]));
}

/** Stock per variant with name and price, for the admin. */
export async function getStockItems() {
  const [{ items }, map, counts] = await Promise.all([getCatalog(), getStockMap(), unitCounts()]);
  return items.map((i) => ({
    variant: i.variant,
    name: i.name.en,
    nameBn: i.name.bn,
    price: i.price,
    qty: map[i.variant] ?? 0,
    active: i.active,
    units: counts[i.variant] ?? { in_stock: 0, reserved: 0, sold: 0 },
  }));
}

export type PublicStock = { variant: string; state: "in" | "low" | "out"; left?: number };

/** What the order form shows. Exact numbers only when few are left. */
export async function getPublicStock(): Promise<PublicStock[]> {
  const [{ items }, map] = await Promise.all([getCatalog(), getStockMap()]);
  return items.map(({ variant }) => {
    const q = map[variant] ?? 0;
    if (q <= 0) return { variant, state: "out" };
    if (q <= LOW_STOCK) return { variant, state: "low", left: q };
    return { variant, state: "in" };
  });
}

export async function setStock(variant: string, qty: number) {
  const { items } = await getCatalog();
  if (!items.some((i) => i.variant === variant)) throw new ShopError("invalid_variant");
  const n = Math.trunc(qty);
  if (!Number.isFinite(n) || n < 0 || n > 100000) throw new ShopError("bad_input", "qty must be 0 or more");
  const [row] = await db()
    .insert(stock)
    .values({ variant, qty: n })
    .onConflictDoUpdate({ target: stock.variant, set: { qty: n, updatedAt: new Date() } })
    .returning();
  return row;
}

export type NewOrder = {
  name: string;
  email: string;
  phone: string;
  address: string;
  location: "dhaka" | "outside";
  variant: string;
  qty: number;
  lang: "bn" | "en";
  note?: string;
  source?: string;
};

/** Places an order and takes the stock in one transaction. Prices are always computed here. */
export async function placeOrder(o: NewOrder): Promise<Preorder> {
  const { items, delivery } = await getCatalog();
  const item = items.find((i) => i.variant === o.variant);
  if (!item) throw new ShopError("invalid_variant");
  const fee = o.location === "outside" ? delivery.outside : delivery.dhaka;
  const now = new Date();
  const history: OrderHistoryEntry[] = [{ status: "new", at: now.toISOString(), ...(o.source ? { note: o.source } : {}) }];

  return db().transaction(async (tx) => {
    const taken = await tx
      .update(stock)
      .set({ qty: sql`${stock.qty} - ${o.qty}`, updatedAt: now })
      .where(and(eq(stock.variant, o.variant), gte(stock.qty, o.qty)))
      .returning({ qty: stock.qty });
    if (!taken.length) throw new ShopError("out_of_stock");

    const [row] = await tx
      .insert(preorders)
      .values({
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        location: o.location,
        variant: o.variant,
        qty: o.qty,
        lang: o.lang,
        note: o.note ?? "",
        unitPrice: item.price,
        delivery: fee,
        total: item.price * o.qty + fee,
        history,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    await reserveUnitsFor(tx, row.id, o.variant, o.qty, now);
    return row;
  });
}

export type FulfillmentPatch = {
  status?: string;
  courier?: string;
  trackingNo?: string;
  note?: string;
  paid?: number;
  historyNote?: string;
};

/**
 * Changes an order. A move to cancelled/returned puts its stock back; a move out of those takes it again.
 * Every status change is appended to history.
 */
export async function updateOrder(id: number, p: FulfillmentPatch): Promise<Preorder> {
  let next: OrderStatus | undefined;
  if (p.status !== undefined) {
    const s = normalizeStatus(p.status);
    if (!s) throw new ShopError("bad_status");
    next = s;
  }
  return db().transaction(async (tx) => {
    const [cur] = await tx.select().from(preorders).where(eq(preorders.id, id)).for("update");
    if (!cur) throw new ShopError("not_found");
    const now = new Date();
    const set: Partial<typeof preorders.$inferInsert> = { updatedAt: now };

    if (p.courier !== undefined) set.courier = p.courier.trim().slice(0, 60);
    if (p.trackingNo !== undefined) set.trackingNo = p.trackingNo.trim().slice(0, 80);
    if (p.note !== undefined) set.note = p.note.trim().slice(0, 1000);
    if (p.paid !== undefined) {
      const paid = Math.trunc(Number(p.paid));
      if (!Number.isFinite(paid) || paid < 0) throw new ShopError("bad_input", "paid must be 0 or more");
      set.paid = paid;
    }

    if (next && next !== cur.status) {
      const release = RELEASES_STOCK.includes(next);
      if (release && cur.stockHeld) {
        await tx
          .update(stock)
          .set({ qty: sql`${stock.qty} + ${cur.qty}`, updatedAt: now })
          .where(eq(stock.variant, cur.variant));
        await releaseUnitsOf(tx, [cur.id], now);
        set.stockHeld = false;
      } else if (!release && !cur.stockHeld) {
        const taken = await tx
          .update(stock)
          .set({ qty: sql`${stock.qty} - ${cur.qty}`, updatedAt: now })
          .where(and(eq(stock.variant, cur.variant), gte(stock.qty, cur.qty)))
          .returning({ qty: stock.qty });
        if (!taken.length) throw new ShopError("out_of_stock");
        await reserveUnitsFor(tx, cur.id, cur.variant, cur.qty, now);
        set.stockHeld = true;
      }
      if (next === "delivered") await setOrderUnitsStatus(tx, cur.id, "sold", now);
      else if (cur.status === "delivered" && !release) await setOrderUnitsStatus(tx, cur.id, "reserved", now);
      set.status = next;
      const entry: OrderHistoryEntry = { status: next, at: now.toISOString() };
      const hn = p.historyNote?.trim();
      if (hn) entry.note = hn.slice(0, 300);
      set.history = [...(cur.history ?? []), entry];
    }

    const [row] = await tx.update(preorders).set(set).where(eq(preorders.id, id)).returning();
    return row;
  });
}

/**
 * Deletes orders. Orders still holding stock (not cancelled/returned) put their units back first,
 * unless restock is false. Deleting every order also restarts the order numbers at 1.
 */
export async function deleteOrders(opts: { ids?: number[]; restock: boolean }) {
  return db().transaction(async (tx) => {
    const all = !opts.ids;
    const rows = all
      ? await tx.select().from(preorders).for("update")
      : opts.ids!.length
        ? await tx.select().from(preorders).where(inArray(preorders.id, opts.ids!)).for("update")
        : [];
    if (!all && rows.length === 0) throw new ShopError("not_found");

    const restocked: Record<string, number> = {};
    if (opts.restock) {
      for (const r of rows) if (r.stockHeld) restocked[r.variant] = (restocked[r.variant] ?? 0) + r.qty;
      const now = new Date();
      for (const [variant, n] of Object.entries(restocked)) {
        await tx
          .update(stock)
          .set({ qty: sql`${stock.qty} + ${n}`, updatedAt: now })
          .where(eq(stock.variant, variant));
      }
    }
    const now2 = new Date();
    const held = rows.filter((r) => r.stockHeld).map((r) => r.id);
    if (opts.restock) await releaseUnitsOf(tx, held, now2);
    else await detachUnitsOf(tx, held, now2);
    if (all) await tx.execute(sql`TRUNCATE TABLE ${preorders} RESTART IDENTITY`);
    else await tx.delete(preorders).where(inArray(preorders.id, rows.map((r) => r.id)));
    return { deleted: rows.length, restocked };
  });
}

export async function listOrders(opts: { since?: Date } = {}) {
  const rows = await db().select().from(preorders).orderBy(desc(preorders.createdAt), desc(preorders.id));
  const [[{ n: newCount }], sinceCount] = await Promise.all([
    db().select({ n: count() }).from(preorders).where(eq(preorders.status, "new")),
    opts.since
      ? db().select({ n: count() }).from(preorders).where(gt(preorders.createdAt, opts.since)).then((r) => r[0].n)
      : Promise.resolve(0),
  ]);
  return { rows, newCount, sinceCount };
}

export async function getOrder(id: number) {
  const [row] = await db().select().from(preorders).where(eq(preorders.id, id));
  return row ?? null;
}

/** The order as the admin API sends it. */
export function toApiOrder(r: Preorder, unitIds: string[] = []) {
  const isDhaka = r.location !== "outside";
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    variant: r.variant,
    qty: r.qty,
    lang: r.lang,
    status: normalizeStatus(r.status) ?? "new",
    note: r.note,
    address: r.address,
    location: isDhaka ? "dhaka" : "outside",
    date: new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" }),
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
    isDhaka,
    courier: r.courier,
    trackingNo: r.trackingNo,
    unitPrice: r.unitPrice,
    delivery: r.delivery,
    total: r.total,
    paid: r.paid,
    history: r.history ?? [],
    units: unitIds,
  };
}
export type ApiOrder = ReturnType<typeof toApiOrder>;

/** Sales totals for the admin dashboard. Cancelled and returned orders are left out of revenue. */
export function salesSummary(orders: ApiOrder[]) {
  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const delivered = live.filter((o) => o.status === "delivered");
  const byStatus: Record<string, number> = {};
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  const byVariant: Record<string, { orders: number; units: number; revenue: number }> = {};
  for (const o of live) {
    const v = (byVariant[o.variant] ??= { orders: 0, units: 0, revenue: 0 });
    v.orders += 1;
    v.units += o.qty;
    v.revenue += o.total;
  }
  return {
    orders: orders.length,
    activeOrders: live.length,
    units: live.reduce((s, o) => s + o.qty, 0),
    bookedRevenue: live.reduce((s, o) => s + o.total, 0),
    deliveredRevenue: delivered.reduce((s, o) => s + o.total, 0),
    collected: live.reduce((s, o) => s + o.paid, 0),
    byStatus,
    byVariant,
  };
}

