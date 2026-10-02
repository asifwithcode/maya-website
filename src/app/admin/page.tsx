import { desc } from "drizzle-orm";
import { db } from "@/db";
import { preorders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { setPreorderNote } from "./actions";
import StatusSelect from "./StatusSelect";

export default async function PreordersPage() {
  await requireAdmin();
  const rows = await db().select().from(preorders).orderBy(desc(preorders.createdAt));
  const units = rows.filter((r) => r.status !== "cancelled").reduce((n, r) => n + r.qty, 0);
  const byVariant = Object.entries(
    rows.filter((r) => r.status !== "cancelled").reduce<Record<string, number>>((m, r) => ((m[r.variant] = (m[r.variant] ?? 0) + r.qty), m), {}),
  ).sort((a, b) => b[1] - a[1]);
  const byStatus = rows.reduce<Record<string, number>>((m, r) => ((m[r.status] = (m[r.status] ?? 0) + 1), m), {});

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Preorders</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {rows.length} reservations · {units} units (cancelled not counted)
          </p>
        </div>
        <a href="/admin/preorders.csv" className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-ink/40">
          Download CSV
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-ink/10">
          <div className="text-xs uppercase tracking-[0.16em] text-ink-faint">Units by edition</div>
          <ul className="mt-3 space-y-1 text-sm">
            {byVariant.length === 0 && <li className="text-ink-faint">Nothing yet.</li>}
            {byVariant.map(([v, n]) => (
              <li key={v} className="flex justify-between">
                <span>{v}</span>
                <span className="font-medium">{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-card p-5 ring-1 ring-ink/10">
          <div className="text-xs uppercase tracking-[0.16em] text-ink-faint">By status</div>
          <ul className="mt-3 space-y-1 text-sm">
            {Object.keys(byStatus).length === 0 && <li className="text-ink-faint">Nothing yet.</li>}
            {Object.entries(byStatus).map(([s, n]) => (
              <li key={s} className="flex justify-between capitalize">
                <span>{s}</span>
                <span className="font-medium">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-card ring-1 ring-ink/10">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-ink-faint">
            <tr className="border-b border-ink/10">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Edition</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-faint">
                  No reservations yet. They appear here as soon as someone reserves on the site.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                  {r.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Dhaka" })}
                </td>
                <td className="px-4 py-3 font-medium">
                  {r.name}
                  {r.lang === "bn" && <span className="ml-1.5 rounded bg-ink/5 px-1 text-[0.65rem] text-ink-faint">বাংলা</span>}
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${r.email}`} className="hover:underline">
                    {r.email}
                  </a>
                </td>
                <td className="px-4 py-3">{r.variant}</td>
                <td className="px-4 py-3">{r.qty}</td>
                <td className="px-4 py-3">
                  <StatusSelect id={r.id} status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <form action={setPreorderNote} className="flex gap-1.5">
                    <input type="hidden" name="id" value={r.id} />
                    <input name="note" defaultValue={r.note} placeholder="Add a note" className="w-44 rounded-lg border border-ink/10 bg-transparent px-2 py-1 text-xs" />
                    <button className="rounded-lg px-2 text-xs text-ink-soft hover:bg-ink/5">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
