import { NextRequest, NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { allowLookup, findOrders, parseQuery, toPublic } from "@/lib/track";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/** Public order tracking: POST { q: order number or phone }. Rate limited per IP; personal data masked. */
export async function POST(request: NextRequest) {
  if (!hasDatabase()) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503, headers: noStore });
  let q = "";
  try {
    q = String((await request.json()).q ?? "").slice(0, 40);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400, headers: noStore });
  }
  const lookup = parseQuery(q);
  if (!lookup) return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400, headers: noStore });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  try {
    if (!(await allowLookup(ip))) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: { ...noStore, "Retry-After": "600" } });
    }
    const orders = await toPublic(await findOrders(lookup));
    return NextResponse.json({ ok: true, kind: lookup.kind, orders }, { headers: noStore });
  } catch (err) {
    console.error("POST /api/track failed", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503, headers: noStore });
  }
}
