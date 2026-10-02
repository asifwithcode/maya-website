import { NextRequest, NextResponse } from "next/server";
import { addPreorder, countPreorders } from "@/lib/store";
import { getSiteContent } from "@/db/content";

// always fresh: the count and the list of editions change from the admin
export const dynamic = "force-dynamic";

const FIXED_VARIANTS = ["Collector's Set", "Classic", "Surprise me"];

export async function GET() {
  try {
    return NextResponse.json({ count: await countPreorders() });
  } catch {
    return NextResponse.json({ count: null });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const variant = String(body.variant ?? "").trim();
  const qty = Math.min(10, Math.max(1, Math.trunc(Number(body.qty)) || 1));
  const lang = body.lang === "bn" ? "bn" : "en";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  const { editions } = await getSiteContent();
  if (![...editions.map((e) => e.variant), ...FIXED_VARIANTS].includes(variant)) {
    return NextResponse.json({ error: "Pick a valid edition." }, { status: 400 });
  }

  try {
    const count = await addPreorder({ name, email, variant, qty, lang });
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    console.error("preorder insert failed", err);
    return NextResponse.json({ error: "Could not save right now. Please try again." }, { status: 503 });
  }
}
