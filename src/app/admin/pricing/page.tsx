import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings, type Pricing } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { PRICING as DEFAULTS } from "@/components/site/data";
import { savePricing } from "../actions";

export default async function PricingPage() {
  await requireAdmin();
  const [row] = await db().select().from(settings).where(eq(settings.key, "pricing"));
  const p = { ...DEFAULTS, ...((row?.value as Partial<Pricing>) ?? {}) };
  const fields: [string, string, number][] = [
    ["maya", "Maya, one edition", p.maya],
    ["collector", "Complete Collection", p.collector],
    ["accessory", "Extra accessory", p.accessory],
    ["mini", "Extra mini keychain", p.mini],
    ["dhaka", "Delivery inside Dhaka", p.delivery.dhaka],
    ["outside", "Delivery outside Dhaka", p.delivery.outside],
  ];
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-1 text-sm text-ink-soft">All prices in taka. Saving updates the live site.</p>
      <form action={savePricing} className="mt-6 space-y-4 rounded-2xl bg-card p-6 ring-1 ring-ink/10">
        {fields.map(([k, label, v]) => (
          <label key={k} className="grid grid-cols-[1fr_8rem] items-center gap-4">
            <span className="text-sm">{label}</span>
            <input name={k} type="number" min={0} required defaultValue={v} className="field-input-light text-right" />
          </label>
        ))}
        <div className="flex justify-end pt-2">
          <button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-eye-deep hover:text-white">Save prices</button>
        </div>
      </form>
    </div>
  );
}
