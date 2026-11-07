import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { getPublicStock } from "@/lib/shop";

export const dynamic = "force-dynamic";

/** Stock state per variant for the order form: in / low (with how many left) / out. */
export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ ok: false, items: [] }, { status: 503 });
  try {
    return NextResponse.json({ ok: true, items: await getPublicStock() }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/stock failed", err);
    return NextResponse.json({ ok: false, items: [] }, { status: 503 });
  }
}
