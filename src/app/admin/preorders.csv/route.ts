import { desc } from "drizzle-orm";
import { db } from "@/db";
import { preorders } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  // quote, and defuse spreadsheet formulas
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const rows = await db().select().from(preorders).orderBy(desc(preorders.createdAt));
  const lines = [
    ["id", "created_at", "name", "email", "edition", "qty", "lang", "status", "note"].join(","),
    ...rows.map((r) => [r.id, r.createdAt.toISOString(), r.name, r.email, r.variant, r.qty, r.lang, r.status, r.note].map(cell).join(",")),
  ];
  return new Response("\uFEFF" + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="maya-preorders-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
