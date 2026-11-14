import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, hasDatabase } from "@/db";
import { editions, settings, type Pricing } from "@/db/schema";
import { DEFAULT_COPY, getSiteContent } from "@/db/content";
import type { SiteCopy } from "@/components/site/content";
import { ORDER_STATUSES } from "@/db/statuses";
import {
  deleteOrders,
  editOrder,
  getCatalog,
  type OrderEdit,
  getStockItems,
  listOrders,
  placeOrder,
  salesSummary,
  setStock,
  ShopError,
  toApiOrder,
  updateOrder,
  type FulfillmentPatch,
} from "@/lib/shop";
import { listUnits, toApiUnit, unitAdd, unitAssign, unitDelete, UnitError, unitRemove, unitsByOrder } from "@/lib/units";

/** The order with the ids of the units it holds. */
async function orderOut(o: Parameters<typeof toApiOrder>[0]) {
  const us = await listUnits({ orderId: o.id });
  return toApiOrder(o, us.filter((u) => u.status !== "removed").map((u) => u.unitId));
}

export const dynamic = "force-dynamic";

/**
 * Who may use this API. It returns every order (names, phones, addresses) and changes prices
 * and site content, so it is never open on a public deployment:
 * - WEB_ADMIN_TOKEN set: the request must send "Authorization: Bearer <token>".
 * - not set: only the local dev server (next dev), which MAYA Studio talks to on 127.0.0.1.
 */
function adminAllowed(request: NextRequest): boolean {
  const token = process.env.WEB_ADMIN_TOKEN?.trim();
  if (token) {
    const got = Buffer.from(request.headers.get("authorization") ?? "");
    const want = Buffer.from(`Bearer ${token}`);
    return got.length === want.length && timingSafeEqual(got, want);
  }
  return process.env.NODE_ENV !== "production";
}

const bad = (error: string) => NextResponse.json({ ok: false, error }, { status: 400 });
const forbidden = () => NextResponse.json({ ok: false, error: "Not available." }, { status: 404 });

const BN_FALLBACK: Record<string, [string, string, string]> = {
  bunny: ["বানি এডিশন", "খরগোশের কান", "কৌতূহলী চোখ"],
  panda: ["পান্ডা এডিশন", "পান্ডার কান", "বড় গোল চোখ"],
  crown: ["রয়্যাল এডিশন", "রত্নখচিত সোনালি মুকুট", "চোখ টিপ"],
  sprout: ["চারা এডিশন", "ছোট্ট সবুজ চারা", "ঘুম ঘুম চোখ"],
  headphones: ["বিটস এডিশন", "গাঢ় গোলাপি হেডফোন", "খুশি চোখ"],
  backpack: ["এক্সপ্লোরার এডিশন", "পকেটওয়ালা ব্যাকপ্যাক", "হার্ট চোখ"],
};

function sanitizeText(val: string | null | undefined, fallback: string): string {
  if (!val) return fallback;
  if (/[\uFFFD]/.test(val) || (val.includes("?") && val.length < 5)) {
    return fallback;
  }
  return val.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

const refreshPaths = () => {
  try {
    revalidatePath("/");
    revalidatePath("/en");
  } catch (e) {
    console.warn("revalidatePath error in web-admin api:", e);
  }
};


// GET /api/web-admin - full sync; ?view=orders[&since=ISO] and ?view=stock are the light polls
export async function GET(request: NextRequest) {
  if (!adminAllowed(request)) return forbidden();
  const view = request.nextUrl.searchParams.get("view");
  if (view === "orders" || view === "stock" || view === "units") {
    if (!hasDatabase()) return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
    try {
      if (view === "units") {
        const q = request.nextUrl.searchParams;
        const orderId = Number(q.get("orderId"));
        const items = await listUnits({
          unitId: q.get("unitId") ?? undefined,
          variant: q.get("variant") ?? undefined,
          status: q.get("status") ?? undefined,
          orderId: Number.isInteger(orderId) && orderId > 0 ? orderId : undefined,
        });
        return NextResponse.json({ ok: true, items: items.map(toApiUnit) }, { headers: { "Cache-Control": "no-store" } });
      }
      if (view === "stock") {
        return NextResponse.json({ ok: true, items: await getStockItems() }, { headers: { "Cache-Control": "no-store" } });
      }
      const sinceRaw = request.nextUrl.searchParams.get("since");
      const since = sinceRaw && !Number.isNaN(Date.parse(sinceRaw)) ? new Date(sinceRaw) : undefined;
      const serverTime = new Date().toISOString();
      const [{ rows, newCount, sinceCount }, byOrder] = await Promise.all([listOrders({ since }), unitsByOrder()]);
      const orders = rows.map((r) => toApiOrder(r, byOrder[r.id]));
      return NextResponse.json(
        { ok: true, serverTime, newCount, sinceCount, orders, summary: salesSummary(orders), statuses: ORDER_STATUSES },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (err) {
      console.error(`GET /api/web-admin?view=${view} failed:`, err);
      return NextResponse.json({ ok: false, error: "Could not load admin data." }, { status: 500 });
    }
  }
  try {
    const site = await getSiteContent();

    let orderList: unknown[] = [];
    let editionsList: unknown[] = [];
    let stockList: unknown[] = [];

    if (hasDatabase()) {
      try {
        const [{ rows }, allEditions, stockItems, byOrder] = await Promise.all([
          listOrders(),
          db().select().from(editions).orderBy(asc(editions.sortOrder), asc(editions.id)),
          getStockItems(),
          unitsByOrder(),
        ]);
        orderList = rows.map((r) => toApiOrder(r, byOrder[r.id]));
        stockList = stockItems;

        editionsList = allEditions.map((e) => {
          const fb = BN_FALLBACK[e.slug] || ["এডিশন", "অ্যাকসেসরি", "চোখ"];
          return {
            id: e.id,
            slug: e.slug,
            variant: e.variant,
            nameEn: e.nameEn,
            nameBn: sanitizeText(e.nameBn, fb[0]),
            accessoryEn: e.accessoryEn,
            accessoryBn: sanitizeText(e.accessoryBn, fb[1]),
            eyesEn: e.eyesEn,
            eyesBn: sanitizeText(e.eyesBn, fb[2]),
            tintHex: e.tint,
            price: e.price,
            sortOrder: e.sortOrder,
            active: e.active,
          };
        });
      } catch (err) {
        console.warn("Failed to fetch tables for web-admin:", err);
      }
    }

    const copy = site.copy;

    return NextResponse.json(
      {
        ok: true,
        preorders: orderList,
        stock: stockList,
        editions: editionsList.length
          ? editionsList
          : site.editions.map((e, idx) => ({
              id: idx + 1,
              slug: e.slug,
              variant: e.variant,
              nameEn: e.name.en,
              nameBn: e.name.bn,
              accessoryEn: e.accessory.en,
              accessoryBn: e.accessory.bn,
              eyesEn: e.eyes.en,
              eyesBn: e.eyes.bn,
              tintHex: e.tint,
              price: e.price,
              sortOrder: idx + 1,
              active: true,
            })),
        pricing: {
          maya: site.pricing.maya,
          collector: site.pricing.collector,
          accessory: site.pricing.accessory,
          mini: site.pricing.mini,
          deliveryDhaka: site.pricing.delivery.dhaka,
          deliveryOutside: site.pricing.delivery.outside,
        },
        copy: copy,
        content: {
          heroBadge: sanitizeText(copy?.hero?.badgeEn, "Maya · Desk Companion"),
          heroTitle: sanitizeText((copy?.hero?.badgeEn ?? "Maya") + " · " + (copy?.hero?.batchEn ?? "Batch 1"), "Maya · Desk Companion V1"),
          heroSubtitle: sanitizeText(copy?.manifesto?.textEn, "Tactile, expressive desk companion built for your workspace."),
          ctaText: "Order Now — ৳" + site.pricing.maya.toLocaleString(),
          manifestoTagline: sanitizeText(copy?.manifesto?.kickerEn, "// 02 LIVING OBJECT ARCHITECTURE"),
          manifestoHeadline: sanitizeText((copy?.manifesto?.titleEn ?? "") + " " + (copy?.manifesto?.titleSoftEn ?? ""), "DESK COMPANIONS SHOULD BE TACTILE & ALIVE."),
          manifestoBody: sanitizeText(copy?.manifesto?.textEn, "MAYA is built with intentional tactility and living pixel eyes."),
          specWeight: "185 g (featherlight)",
          specHeight: "120 mm desk stature",
          specBattery: "Continuous 5V USB-C",
          specDof: "Dual Capacitive Touch Pads",
          specChip: "ESP32-C3 RISC-V Neural Core",
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/web-admin failed:", error);
    return NextResponse.json({ ok: false, error: "Could not load admin data." }, { status: 500 });
  }
}

// POST /api/web-admin - admin actions (orders, stock, prices, editions, copy)
export async function POST(request: NextRequest) {
  if (!adminAllowed(request)) return forbidden();
  try {
    const body = await request.json();
    const action = String(body.action ?? "").trim();

    if (!hasDatabase()) {
      return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
    }

    switch (action) {
      case "set_status":
      case "set_note":
      case "set_fulfillment": {
        const id = Number(body.id);
        if (!Number.isInteger(id) || id <= 0) return bad("Missing id.");
        const patch: FulfillmentPatch = {};
        if (action !== "set_note" && body.status !== undefined) patch.status = String(body.status);
        if (action === "set_status" && patch.status === undefined) return bad("Missing status.");
        if (action !== "set_status" && body.note !== undefined) patch.note = String(body.note ?? "");
        if (action === "set_fulfillment") {
          if (body.courier !== undefined) patch.courier = String(body.courier ?? "");
          if (body.trackingNo !== undefined) patch.trackingNo = String(body.trackingNo ?? "");
          if (body.paid !== undefined) patch.paid = Number(body.paid);
          if (body.historyNote !== undefined) patch.historyNote = String(body.historyNote ?? "");
        }
        const order = await orderOut(await updateOrder(id, patch));
        if (patch.status !== undefined) refreshPaths(); // stock may have changed
        return NextResponse.json({ ok: true, order, message: `Order #${id} updated.` });
      }

      case "set_stock": {
        const variant = String(body.variant ?? "").trim();
        const item = await setStock(variant, Number(body.qty));
        refreshPaths();
        return NextResponse.json({ ok: true, item: { variant: item.variant, qty: item.qty }, message: `Stock for ${variant} set to ${item.qty}.` });
      }

      case "save_pricing": {
        const pricingData: Pricing = {
          maya: Number(body.maya) || 3490,
          collector: Number(body.collector) || 4490,
          accessory: Number(body.accessory) || 390,
          mini: Number(body.mini) || 490,
          delivery: {
            dhaka: Number.isFinite(Number(body.deliveryDhaka)) && body.deliveryDhaka !== "" ? Number(body.deliveryDhaka) : 70,
            outside: Number.isFinite(Number(body.deliveryOutside)) && body.deliveryOutside !== "" ? Number(body.deliveryOutside) : 130,
          },
        };
        await db()
          .insert(settings)
          .values({ key: "pricing", value: pricingData })
          .onConflictDoUpdate({ target: settings.key, set: { value: pricingData, updatedAt: new Date() } });
        refreshPaths();
        return NextResponse.json({ ok: true, message: "Store pricing saved and synced to website." });
      }

      case "save_edition": {
        const id = Number(body.id);
        if (!id) {
          return NextResponse.json({ ok: false, error: "Missing edition id." }, { status: 400 });
        }
        const tint = String(body.tint ?? "#f3f1ee").trim();
        const price = body.price !== null && body.price !== undefined && body.price !== "" ? Number(body.price) : null;
        await db()
          .update(editions)
          .set({
            nameEn: String(body.nameEn ?? "").trim(),
            nameBn: String(body.nameBn ?? "").trim(),
            accessoryEn: String(body.accessoryEn ?? "").trim(),
            accessoryBn: String(body.accessoryBn ?? "").trim(),
            eyesEn: String(body.eyesEn ?? "").trim(),
            eyesBn: String(body.eyesBn ?? "").trim(),
            tint: /^#[0-9a-f]{6}$/i.test(tint) ? tint : "#f3f1ee",
            price: price && Number.isFinite(price) ? price : null,
            sortOrder: Number(body.sortOrder) || 0,
            active: Boolean(body.active),
            updatedAt: new Date(),
          })
          .where(eq(editions.id, id));
        refreshPaths();
        return NextResponse.json({ ok: true, message: `Edition #${id} updated successfully.` });
      }

      case "toggle_edition": {
        const id = Number(body.id);
        const active = Boolean(body.active);
        if (!id) {
          return NextResponse.json({ ok: false, error: "Missing edition id." }, { status: 400 });
        }
        await db().update(editions).set({ active, updatedAt: new Date() }).where(eq(editions.id, id));
        refreshPaths();
        return NextResponse.json({ ok: true, message: `Edition #${id} visibility updated.` });
      }

      case "save_content":
      case "save_site_copy": {
        const currentSite = await getSiteContent();
        // Clone so the edits below never change the shared built-in DEFAULT_COPY.
        const copy: SiteCopy = body.copy
          ? (body.copy as SiteCopy)
          : structuredClone(currentSite.copy ?? DEFAULT_COPY);

        if (body.heroBadge) copy.hero.badgeEn = String(body.heroBadge);
        if (body.manifestoTagline) copy.manifesto.kickerEn = String(body.manifestoTagline);
        if (body.manifestoHeadline) copy.manifesto.titleEn = String(body.manifestoHeadline);
        if (body.manifestoBody) copy.manifesto.textEn = String(body.manifestoBody);

        await db()
          .insert(settings)
          .values({ key: "site_copy", value: copy })
          .onConflictDoUpdate({ target: settings.key, set: { value: copy, updatedAt: new Date() } });
        refreshPaths();
        return NextResponse.json({ ok: true, message: "Website content published and live." });
      }

      case "update_order": {
        const id = Number(body.id);
        if (!Number.isInteger(id) || id <= 0) return bad("Missing id.");
        const e: OrderEdit = {};
        for (const k of ["name", "phone", "email", "address", "note"] as const) if (body[k] !== undefined) e[k] = String(body[k] ?? "");
        if (body.location !== undefined) e.location = body.location === "outside" ? "outside" : body.location === "dhaka" ? "dhaka" : (String(body.location) as "dhaka");
        if (body.lang !== undefined) e.lang = String(body.lang) as "bn";
        if (body.variant !== undefined) e.variant = String(body.variant);
        for (const k of ["qty", "unitPrice", "delivery", "paid"] as const) if (body[k] !== undefined && body[k] !== null && body[k] !== "") e[k] = Number(body[k]);
        const by = typeof body.by === "string" && body.by.trim() ? body.by.trim() : "admin";
        const order = await orderOut(await editOrder(id, e, { force: body.force === true, by }));
        refreshPaths(); // stock may have moved
        return NextResponse.json({ ok: true, order, message: `Order #${id} updated.` });
      }

      case "unit_delete": {
        const res = await unitDelete(String(body.unitId ?? "").trim());
        if (res.changed) refreshPaths();
        return NextResponse.json({ ok: true, changed: res.changed, unit: res.unit ? toApiUnit(res.unit) : null, stock: res.stock });
      }

      case "unit_add":
      case "unit_remove":
      case "unit_assign": {
        const unitId = String(body.unitId ?? "").trim();
        let res;
        if (action === "unit_add") {
          const { items } = await getCatalog();
          res = await unitAdd(unitId, String(body.variant ?? "").trim(), body.note === undefined ? undefined : String(body.note), items.map((i) => i.variant));
        } else if (action === "unit_remove") {
          res = await unitRemove(unitId, { sold: body.sold === true, note: body.note === undefined ? undefined : String(body.note) });
        } else {
          const orderId = Number(body.orderId);
          if (!Number.isInteger(orderId) || orderId <= 0) return bad("Missing orderId.");
          res = await unitAssign(unitId, orderId);
        }
        if (action !== "unit_assign" && res.changed) refreshPaths();
        return NextResponse.json({ ok: true, changed: res.changed, unit: res.unit ? toApiUnit(res.unit) : null, stock: res.stock });
      }

      case "delete_order": {
        const id = Number(body.id);
        if (!Number.isInteger(id) || id <= 0) return bad("Missing id.");
        const res = await deleteOrders({ ids: [id], restock: body.restock !== false });
        refreshPaths();
        return NextResponse.json({ ok: true, ...res, message: `Order #${id} deleted.` });
      }

      case "delete_all_orders": {
        // Irreversible: the caller must send the word DELETE as confirmation.
        if (body.confirm !== "DELETE") {
          return NextResponse.json(
            { ok: false, error: "bad_input", message: 'Send confirm: "DELETE" to delete every order.' },
            { status: 400 },
          );
        }
        const res = await deleteOrders({ restock: body.restock !== false });
        refreshPaths();
        return NextResponse.json({ ok: true, ...res, message: `${res.deleted} orders deleted.` });
      }

      case "create_preorder": {
        const name = String(body.name ?? "").trim().slice(0, 120);
        const email = String(body.email ?? "").trim().slice(0, 200);
        if (!name) return bad("Name is required.");
        const order = await placeOrder({
          name,
          email,
          phone: String(body.phone ?? "").trim().slice(0, 50),
          address: String(body.address ?? "").trim().slice(0, 300),
          location: body.location === "outside" ? "outside" : "dhaka",
          variant: String(body.variant ?? "").trim(),
          qty: Math.min(50, Math.max(1, Math.trunc(Number(body.qty)) || 1)),
          lang: body.lang === "en" ? "en" : "bn",
          note: String(body.note ?? "").trim().slice(0, 1000),
          source: "Added by admin",
        });
        return NextResponse.json({ ok: true, id: order.id, order: await orderOut(order), message: `Order #${order.id} created.` });
      }

      default:
        return NextResponse.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof UnitError) {
      const status = error.code === "unit_busy" ? 409 : error.code === "not_found" ? 404 : 400;
      return NextResponse.json({ ok: false, error: error.code, message: error.message }, { status });
    }
    if (error instanceof ShopError) {
      const status = error.code === "out_of_stock" || error.code === "order_locked" ? 409 : error.code === "not_found" ? 404 : 400;
      return NextResponse.json({ ok: false, error: error.code, message: error.message }, { status });
    }
    console.error("POST /api/web-admin failed:", error);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
