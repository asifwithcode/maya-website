import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, hasDatabase } from "@/db";
import { editions, preorders, settings, type Pricing } from "@/db/schema";
import { DEFAULT_COPY, getSiteContent } from "@/db/content";
import type { SiteCopy } from "@/components/site/content";
import { parsePreorderNote } from "@/lib/orders";

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


// GET /api/web-admin - Sync all database state to MAYA Studio
export async function GET(request: NextRequest) {
  if (!adminAllowed(request)) return forbidden();
  try {
    const site = await getSiteContent();

    let orderList: unknown[] = [];
    let editionsList: unknown[] = [];

    if (hasDatabase()) {
      try {
        const [ordersRows, allEditions] = await Promise.all([
          db().select().from(preorders).orderBy(desc(preorders.createdAt)),
          db().select().from(editions).orderBy(asc(editions.sortOrder), asc(editions.id)),
        ]);

        orderList = ordersRows.map((r) => {
          const { phone, address, location, adminNote } = parsePreorderNote(r.note);
          const isDhaka = !location || location.toLowerCase().includes("dhaka") || (address ?? "").toLowerCase().includes("dhaka");
          return {
            id: r.id,
            name: sanitizeText(r.name, "Customer"),
            email: sanitizeText(r.email, ""),
            phone: phone ?? "",
            variant: sanitizeText(r.variant, "Classic"),
            qty: r.qty ?? 1,
            lang: r.lang ?? "en",
            status: r.status ?? "new",
            note: sanitizeText(adminNote || (r.note ?? ""), ""),
            address: sanitizeText(address ?? "", ""),
            location: sanitizeText(location ?? (isDhaka ? "dhaka" : "outside"), isDhaka ? "dhaka" : "outside"),
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
            isDhaka,
          };
        });

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

// POST /api/web-admin - Receive and commit updates from MAYA Studio
export async function POST(request: NextRequest) {
  if (!adminAllowed(request)) return forbidden();
  try {
    const body = await request.json();
    const action = String(body.action ?? "").trim();

    if (!hasDatabase()) {
      return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
    }

    switch (action) {
      case "set_status": {
        const id = Number(body.id);
        const status = String(body.status ?? "").toLowerCase();
        if (!id || !status) {
          return NextResponse.json({ ok: false, error: "Missing id or status." }, { status: 400 });
        }
        await db().update(preorders).set({ status }).where(eq(preorders.id, id));
        refreshPaths();
        return NextResponse.json({ ok: true, message: `Order #${id} status updated to ${status}.` });
      }

      case "set_note": {
        const id = Number(body.id);
        if (!id) {
          return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
        }
        const newAdminNote = String(body.note ?? "").trim().slice(0, 1000);

        const existing = await db().select().from(preorders).where(eq(preorders.id, id)).limit(1);
        const currentNote = existing[0]?.note ?? "";
        const { phone, address, location } = parsePreorderNote(currentNote);

        const parts = [
          phone ? `Phone: ${phone}` : "",
          address ? `Address: ${address}` : "",
          location ? `Location: ${location}` : "",
          newAdminNote ? newAdminNote : "",
        ].filter(Boolean);

        const combined = parts.join(" | ");
        await db().update(preorders).set({ note: combined }).where(eq(preorders.id, id));
        refreshPaths();
        return NextResponse.json({ ok: true, message: `Internal notes saved for order #${id}.` });
      }

      case "save_pricing": {
        const pricingData: Pricing = {
          maya: Number(body.maya) || 3490,
          collector: Number(body.collector) || 4490,
          accessory: Number(body.accessory) || 390,
          mini: Number(body.mini) || 490,
          delivery: {
            dhaka: Number(body.deliveryDhaka) ?? 70,
            outside: Number(body.deliveryOutside) ?? 130,
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

      case "create_preorder": {
        const name = String(body.name ?? "").trim();
        const email = String(body.email ?? "").trim();
        const phone = String(body.phone ?? "").trim();
        const address = String(body.address ?? "").trim();
        const location = String(body.location ?? "dhaka").trim();
        const variant = String(body.variant ?? "Classic").trim();
        const qty = Number(body.qty) || 1;
        const lang = String(body.lang ?? "en").trim();

        if (!name || !email) {
          return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
        }

        const noteParts = [
          phone ? `Phone: ${phone}` : "",
          address ? `Address: ${address}` : "",
          location ? `Location: ${location}` : "",
          "Added from MAYA Studio",
        ].filter(Boolean).join(" | ");

        const [created] = await db()
          .insert(preorders)
          .values({
            name,
            email,
            variant,
            qty,
            lang,
            status: "new",
            note: noteParts,
          })
          .returning({ id: preorders.id });

        refreshPaths();
        return NextResponse.json({ ok: true, id: created?.id, message: `Reservation created #${created?.id}.` });
      }

      default:
        return NextResponse.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("POST /api/web-admin failed:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
