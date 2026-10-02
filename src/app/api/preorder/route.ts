import { NextRequest, NextResponse } from "next/server";
import { addPreorder, countPreorders, type Preorder } from "@/lib/store";

const VALID_VARIANTS = [
  "Classic", "Focus", "Hopper", "Panda", "Sprout", "Collector's Set", "Surprise me",
  // looks offered on /showcase
  "Bunny", "Crown", "Headphones", "Backpack",
];

export async function GET() {
  const count = await countPreorders();
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  let body: Partial<Preorder>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  const variant = (body.variant ?? "").toString().trim();
  const qty = Math.min(10, Math.max(1, Math.trunc(Number(body.qty)) || 1));

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!VALID_VARIANTS.includes(variant)) {
    return NextResponse.json({ error: "Pick a valid head." }, { status: 400 });
  }

  const count = await addPreorder({
    name,
    email,
    variant,
    qty,
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, count });
}
