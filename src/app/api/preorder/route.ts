import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasDatabase } from "@/db";
import { placeOrder, ShopError } from "@/lib/shop";

export const dynamic = "force-dynamic";

/** Places a cash-on-delivery order. Price and stock are checked on the server. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 50);
  const address = String(body.address ?? "").trim().slice(0, 300);
  const location = body.location === "outside" ? "outside" : "dhaka";
  const variant = String(body.variant ?? "").trim().slice(0, 60);
  const qty = Math.min(10, Math.max(1, Math.trunc(Number(body.qty)) || 1));
  const lang = body.lang === "en" ? "en" : "bn";

  if (!name || !email || !phone || !address) {
    return NextResponse.json({ error: "Name, phone, email and address are required." }, { status: 400 });
  }
  // Cash on delivery needs a phone we can call: 7-15 digits, + - spaces allowed.
  if (!/^\d{7,15}$/.test(phone.replace(/[\s()+-]/g, ""))) {
    return NextResponse.json({ error: "That phone number doesn't look right." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Could not save right now. Please try again." }, { status: 503 });
  }

  try {
    const order = await placeOrder({ name, email, phone, address, location, variant, qty, lang });
    try {
      revalidatePath("/"); // structured data shows stock
      revalidatePath("/en");
    } catch {}
    return NextResponse.json({ ok: true, id: order.id, total: order.total });
  } catch (err) {
    if (err instanceof ShopError && err.code === "out_of_stock") {
      return NextResponse.json({ error: "out_of_stock", message: "Not enough stock for this edition." }, { status: 409 });
    }
    if (err instanceof ShopError && err.code === "invalid_variant") {
      return NextResponse.json({ error: "Pick a valid edition." }, { status: 400 });
    }
    console.error("order insert failed", err);
    return NextResponse.json({ error: "Could not save right now. Please try again." }, { status: 503 });
  }
}
