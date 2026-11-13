"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ORDER_STATUSES } from "@/db/statuses";
import { api, taka, when, type Edition, type Order, type SiteCopy, type SiteData, type StockItem, type Summary } from "./lib";
import { variantSlug } from "./orders";
import { Badge, Banner, Card, digits, Empty, Field, Icon, MsgBanner, PageHeader, StatusBadge, Thumb, useSaver, type IconName } from "./ui";

/* ------------------------------------------------------------------ home / dashboard */

const DAY = 24 * 3600 * 1000;
const dhakaDay = (d: Date) => new Date(d.getTime() + 6 * 3600 * 1000).toISOString().slice(0, 10);

function Kpi({ icon, label, value, sub, onClick }: { icon: IconName; label: string; value: string; sub?: ReactNode; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`adm-card flex min-w-0 flex-col p-4 text-left ${onClick ? "hover:bg-[#fafafa]" : ""}`}>
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#616161]">
        <Icon name={icon} className="h-4 w-4" /> {label}
      </span>
      <span className="mt-1.5 text-[22px] font-bold tabular-nums tracking-[-0.01em] text-[#303030]">{value}</span>
      {sub && <span className="mt-0.5 text-[12px] text-[#616161]">{sub}</span>}
    </Tag>
  );
}

export function HomePage({
  orders,
  summary,
  stock,
  onOpenOrder,
  go,
}: {
  orders: Order[];
  summary: Summary;
  stock: StockItem[];
  onOpenOrder: (id: number) => void;
  go: (page: "orders" | "inventory") => void;
}) {
  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const nameOf = (v: string) => stock.find((s) => s.variant === v)?.nameBn ?? v;

  // sales per day, last 14 days (Dhaka time)
  const [today] = useState(() => Date.now());
  const days = useMemo(() => {
    const list = Array.from({ length: 14 }, (_, i) => dhakaDay(new Date(today - (13 - i) * DAY)));
    const sums: Record<string, { sales: number; orders: number }> = Object.fromEntries(list.map((d) => [d, { sales: 0, orders: 0 }]));
    for (const o of live) {
      const d = dhakaDay(new Date(o.createdAt));
      if (sums[d]) {
        sums[d].sales += o.total;
        sums[d].orders += 1;
      }
    }
    return list.map((d) => ({ day: d, ...sums[d] }));
  }, [live, today]);
  const maxSales = Math.max(1, ...days.map((d) => d.sales));
  const sales14 = days.reduce((s, d) => s + d.sales, 0);
  const orders14 = days.reduce((s, d) => s + d.orders, 0);

  const toShip = orders.filter((o) => o.status === "confirmed" || o.status === "packed").length;
  const inStock = stock.reduce((s, i) => s + i.qty, 0);
  const soldOut = stock.filter((s) => s.qty === 0);
  const variants = Object.entries(summary.byVariant).sort((a, b) => b[1].units - a[1].units);
  const maxUnits = Math.max(1, ...variants.map(([, v]) => v.units));

  return (
    <>
      <PageHeader title="হোম" sub="আপনার স্টোরের আজকের অবস্থা" />

      {(summary.byStatus.new ?? 0) + toShip > 0 && (
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          {(summary.byStatus.new ?? 0) > 0 && (
            <button onClick={() => go("orders")} className="adm-card flex items-center gap-3 p-3 text-left hover:bg-[#fafafa]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3e8ff] text-[#2b3fa8]">
                <Icon name="orders" />
              </span>
              <span className="flex-1">
                <b>{summary.byStatus.new}টি নতুন অর্ডার</b>
                <span className="block text-[12.5px] text-[#616161]">কাস্টমারকে ফোন করে কনফার্ম করুন</span>
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-[#8a8a8a]" />
            </button>
          )}
          {toShip > 0 && (
            <button onClick={() => go("orders")} className="adm-card flex items-center gap-3 p-3 text-left hover:bg-[#fafafa]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff1e3] text-[#8a4a00]">
                <Icon name="truck" />
              </span>
              <span className="flex-1">
                <b>{toShip}টি অর্ডার পাঠানো বাকি</b>
                <span className="block text-[12.5px] text-[#616161]">প্যাক করে কুরিয়ারে দিন</span>
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-[#8a8a8a]" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon="cash" label="মোট বিক্রি" value={taka(summary.bookedRevenue)} sub={`${summary.activeOrders}টি চালু অর্ডার · বাতিল/ফেরত বাদে`} />
        <Kpi icon="orders" label="অর্ডার" value={String(summary.orders)} sub={`${summary.units}টি ইউনিট`} onClick={() => go("orders")} />
        <Kpi icon="check" label="ডেলিভারড" value={taka(summary.deliveredRevenue)} sub={`আদায় ${taka(summary.collected)}`} />
        <Kpi
          icon="inventory"
          label="স্টকে আছে"
          value={String(inStock)}
          sub={soldOut.length ? <span className="text-[#8e1f0b]">{soldOut.length}টি এডিশন শেষ</span> : "সব এডিশনে স্টক আছে"}
          onClick={() => go("inventory")}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card title="গত ১৪ দিনের বিক্রি" sub={`${taka(sales14)} · ${orders14}টি অর্ডার`}>
          <div className="flex h-[180px] items-end gap-1.5">
            {days.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className={`rounded-t-[3px] ${d.sales ? "bg-[#2c6ecb]" : "bg-[#e3e3e3]"} transition group-hover:opacity-80`}
                  style={{ height: `${d.sales ? Math.max(6, (d.sales / maxSales) * 100) : 2}%` }}
                />
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-[#303030] px-2 py-1 text-[11.5px] text-white group-hover:block">
                  {d.day.slice(5)} · {taka(d.sales)} · {d.orders}টি
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-[#8a8a8a]">
            <span>{days[0].day.slice(5)}</span>
            <span>আজ</span>
          </div>
        </Card>

        <Card title="ফুলফিলমেন্ট" sub="কোন ধাপে কয়টা অর্ডার">
          <ul className="space-y-1.5">
            {ORDER_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between">
                <StatusBadge status={s} />
                <span className="tabular-nums font-medium">{summary.byStatus[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card
          title="সাম্প্রতিক অর্ডার"
          right={
            <button onClick={() => go("orders")} className="text-[13px] text-[#2c6ecb] hover:underline">
              সব দেখুন
            </button>
          }
          pad={false}
        >
          {orders.length === 0 ? (
            <Empty icon="orders" title="এখনো কোনো অর্ডার নেই" />
          ) : (
            <ul>
              {orders.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <button onClick={() => onOpenOrder(o.id)} className="flex w-full items-center gap-3 border-t border-[#ebebeb] px-4 py-2.5 text-left hover:bg-[#f7f7f8]">
                    <Thumb slug={variantSlug(o.variant)} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        #{o.id} · {o.name}
                      </span>
                      <span className="block text-[12px] text-[#616161]">
                        {nameOf(o.variant)} × {o.qty} · {when(o.createdAt)}
                      </span>
                    </span>
                    <span className="hidden tabular-nums sm:block">{taka(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="এডিশন অনুযায়ী বিক্রি" sub="বাতিল আর ফেরত বাদে">
          {variants.length === 0 ? (
            <p className="text-[13px] text-[#616161]">এখনো কোনো বিক্রি নেই।</p>
          ) : (
            <ul className="space-y-3">
              {variants.map(([v, d]) => (
                <li key={v}>
                  <div className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="flex items-center gap-2">
                      <Thumb slug={variantSlug(v)} size={24} />
                      {nameOf(v)}
                    </span>
                    <span className="tabular-nums text-[#616161]">
                      {d.units} · {taka(d.revenue)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[#f1f2f4]">
                    <div className="h-1.5 rounded-full bg-[#2c6ecb]" style={{ width: `${(d.units / maxUnits) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ inventory */

export function InventoryPage({ items, summary, token, onSaved }: { items: StockItem[]; summary: Summary | null; token: string; onSaved: () => void }) {
  const total = items.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      <PageHeader title="ইনভেন্টরি" sub={`${total}টি ইউনিট বিক্রির জন্য তৈরি · ${items.filter((i) => i.qty === 0).length}টি এডিশন শেষ`} />
      <section className="adm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="adm-th">পণ্য</th>
                <th className="adm-th">SKU</th>
                <th className="adm-th text-right">দাম</th>
                <th className="adm-th">Maya Studio ইউনিট</th>
                <th className="adm-th text-right">বিক্রি</th>
                <th className="adm-th text-right">Available</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <StockRow key={i.variant + i.qty} item={i} sold={summary?.byVariant[i.variant]?.units ?? 0} token={token} onSaved={onSaved} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[#ebebeb] px-4 py-3 text-[12.5px] text-[#616161]">
          অর্ডার দিলে স্টক কমে, বাতিল বা ফেরত হলে আবার যোগ হয়। Maya Studio-তে বানানো ইউনিট স্টকে যোগ করলে এখানেও নিজে থেকে বাড়ে। হাতে গোনা সংখ্যা ঠিক করতে Available বদলে সেভ করুন।
        </p>
      </section>
    </>
  );
}

function StockRow({ item, sold, token, onSaved }: { item: StockItem; sold: number; token: string; onSaved: () => void }) {
  const [qty, setQty] = useState(String(item.qty));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const dirty = qty !== String(item.qty);
  const u = item.units;

  async function save() {
    setBusy(true);
    setErr("");
    try {
      await api(token, { body: { action: "set_stock", variant: item.variant, qty: Number(qty) || 0 } });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "সেভ হয়নি");
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="hover:bg-[#f7f7f8]">
      <td className="adm-td">
        <span className="flex items-center gap-3">
          <Thumb slug={variantSlug(item.variant)} size={40} />
          <span>
            <span className="block font-medium">{item.nameBn}</span>
            <span className="block text-[12px] text-[#616161]">{item.name}</span>
            {err && <span className="block text-[12px] text-[#8e1f0b]">{err}</span>}
          </span>
        </span>
      </td>
      <td className="adm-td font-mono text-[12px] text-[#616161]">{item.variant}</td>
      <td className="adm-td text-right tabular-nums">{taka(item.price)}</td>
      <td className="adm-td">
        {u && u.in_stock + u.reserved + u.sold > 0 ? (
          <span className="flex flex-wrap gap-1">
            <Badge tone="success" dot={false}>{u.in_stock} স্টকে</Badge>
            {u.reserved > 0 && <Badge tone="info" dot={false}>{u.reserved} রিজার্ভ</Badge>}
            {u.sold > 0 && <Badge tone="neutral" dot={false}>{u.sold} বিক্রি</Badge>}
          </span>
        ) : (
          <span className="text-[#8a8a8a]">—</span>
        )}
      </td>
      <td className="adm-td text-right tabular-nums">{sold}</td>
      <td className="adm-td">
        <span className="flex items-center justify-end gap-2">
          {item.qty === 0 && !dirty && <Badge tone="critical">শেষ</Badge>}
          <input
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(digits(e.target.value))}
            className="adm-input !w-[72px] text-right tabular-nums"
            aria-label={`${item.name} stock`}
          />
          <button onClick={save} disabled={!dirty || busy} className="adm-btn-primary">
            {busy ? "…" : "সেভ"}
          </button>
        </span>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ products (editions) */

export function ProductsPage({ site, stock, token, onSaved }: { site: SiteData; stock: StockItem[]; token: string; onSaved: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const qtyOf = (v: string) => stock.find((s) => s.variant === v)?.qty ?? 0;
  const edit = site.editions.find((e) => e.id === open);
  if (edit) return <EditionEditor key={edit.id} edition={edit} basePrice={site.pricing.maya} token={token} onSaved={onSaved} onBack={() => setOpen(null)} />;

  const collection = stock.find((s) => /collector/i.test(s.variant));
  return (
    <>
      <PageHeader title="পণ্য" sub="ছয়টা এডিশন আর কমপ্লিট কালেকশন। নাম, দাম আর সাইটে দেখানো এখান থেকে।" />
      <section className="adm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="adm-th">পণ্য</th>
                <th className="adm-th">স্ট্যাটাস</th>
                <th className="adm-th">ইনভেন্টরি</th>
                <th className="adm-th text-right">দাম</th>
                <th className="adm-th" />
              </tr>
            </thead>
            <tbody>
              {site.editions.map((e) => {
                const q = qtyOf(e.variant);
                return (
                  <tr key={e.id} onClick={() => setOpen(e.id)} className="cursor-pointer hover:bg-[#f7f7f8]">
                    <td className="adm-td">
                      <span className="flex items-center gap-3">
                        <Thumb slug={e.slug} size={40} />
                        <span>
                          <span className="block font-medium">{e.nameBn}</span>
                          <span className="block text-[12px] text-[#616161]">
                            {e.nameEn} · {e.accessoryEn}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="adm-td">{e.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">লুকানো</Badge>}</td>
                    <td className="adm-td">{q > 0 ? `${q}টি স্টকে` : <span className="text-[#8e1f0b]">স্টক নেই</span>}</td>
                    <td className="adm-td text-right tabular-nums">
                      {taka(e.price ?? site.pricing.maya)}
                      {e.price == null && <span className="block text-[11.5px] text-[#8a8a8a]">সাধারণ দাম</span>}
                    </td>
                    <td className="adm-td text-right text-[#8a8a8a]">
                      <Icon name="chevronRight" className="ml-auto h-4 w-4" />
                    </td>
                  </tr>
                );
              })}
              {collection && (
                <tr className="bg-[#fafafa]">
                  <td className="adm-td">
                    <span className="flex items-center gap-3">
                      <Thumb slug="plain" size={40} />
                      <span>
                        <span className="block font-medium">{collection.nameBn}</span>
                        <span className="block text-[12px] text-[#616161]">{collection.name} · সব ছয়টা এক্সেসরি</span>
                      </span>
                    </span>
                  </td>
                  <td className="adm-td">
                    <Badge tone="success">Active</Badge>
                  </td>
                  <td className="adm-td">{collection.qty > 0 ? `${collection.qty}টি স্টকে` : <span className="text-[#8e1f0b]">স্টক নেই</span>}</td>
                  <td className="adm-td text-right tabular-nums">
                    {taka(collection.price)}
                    <span className="block text-[11.5px] text-[#8a8a8a]">দাম পাতায় বদলান</span>
                  </td>
                  <td className="adm-td" />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function EditionEditor({ edition, basePrice, token, onSaved, onBack }: { edition: Edition; basePrice: number; token: string; onSaved: () => void; onBack: () => void }) {
  const [e, setE] = useState({ ...edition, price: edition.price == null ? "" : String(edition.price) });
  const { busy, msg, run } = useSaver();
  const set = (k: keyof typeof e) => (ev: { target: { value: string } }) => setE({ ...e, [k]: ev.target.value });

  async function save(ev: FormEvent) {
    ev.preventDefault();
    const ok = await run(() =>
      api(token, {
        body: {
          action: "save_edition",
          id: e.id,
          nameEn: e.nameEn,
          nameBn: e.nameBn,
          accessoryEn: e.accessoryEn,
          accessoryBn: e.accessoryBn,
          eyesEn: e.eyesEn,
          eyesBn: e.eyesBn,
          tint: e.tintHex,
          price: e.price === "" ? null : Number(e.price),
          sortOrder: e.sortOrder,
          active: e.active,
        },
      }),
    );
    if (ok) onSaved();
  }

  return (
    <form onSubmit={save}>
      <PageHeader
        back={onBack}
        title={
          <span className="flex items-center gap-2">
            {e.nameBn || e.nameEn} {e.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">লুকানো</Badge>}
          </span>
        }
        sub={`ফর্মের variant: ${e.variant}`}
        actions={
          <button type="submit" disabled={busy} className="adm-btn-primary">
            {busy ? "সেভ হচ্ছে…" : "সেভ"}
          </button>
        }
      />
      <div className="mb-3">
        <MsgBanner msg={msg} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card title="নাম ও বিবরণ">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="নাম (বাংলা)">
                <input value={e.nameBn} onChange={set("nameBn")} className="adm-input" required />
              </Field>
              <Field label="Name (English)">
                <input value={e.nameEn} onChange={set("nameEn")} className="adm-input" required />
              </Field>
              <Field label="এক্সেসরি (বাংলা)">
                <input value={e.accessoryBn} onChange={set("accessoryBn")} className="adm-input" />
              </Field>
              <Field label="Accessory (English)">
                <input value={e.accessoryEn} onChange={set("accessoryEn")} className="adm-input" />
              </Field>
              <Field label="চোখ (বাংলা)">
                <input value={e.eyesBn} onChange={set("eyesBn")} className="adm-input" />
              </Field>
              <Field label="Eyes (English)">
                <input value={e.eyesEn} onChange={set("eyesEn")} className="adm-input" />
              </Field>
            </div>
          </Card>
          <Card title="দাম">
            <Field label="দাম (৳)" hint={`খালি রাখলে সাধারণ দাম ${taka(basePrice)}`}>
              <input inputMode="numeric" value={e.price} onChange={(x) => setE({ ...e, price: digits(x.target.value) })} className="adm-input max-w-[200px] tabular-nums" placeholder={String(basePrice)} />
            </Field>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="স্ট্যাটাস">
            <select value={e.active ? "1" : "0"} onChange={(x) => setE({ ...e, active: x.target.value === "1" })} className="adm-input">
              <option value="1">Active (সাইটে দেখায়)</option>
              <option value="0">লুকানো</option>
            </select>
          </Card>
          <Card title="দেখতে কেমন">
            <div className="flex items-center gap-3">
              <span className="flex h-20 w-20 items-center justify-center rounded-lg border border-[#e1e3e5]" style={{ background: /^#[0-9a-f]{6}$/i.test(e.tintHex) ? e.tintHex : "#f3f1ee" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/showcase/art/maya-${e.slug}.svg`} alt="" className="h-16 w-16 object-contain" />
              </span>
              <div className="flex-1 space-y-2">
                <Field label="রং (tint)">
                  <span className="flex items-center gap-2">
                    <input
                      type="color"
                      value={/^#[0-9a-f]{6}$/i.test(e.tintHex) ? e.tintHex : "#f3f1ee"}
                      onChange={(x) => setE({ ...e, tintHex: x.target.value })}
                      className="h-8 w-9 shrink-0 cursor-pointer rounded border border-[#c9cccf]"
                    />
                    <input value={e.tintHex} onChange={(x) => setE({ ...e, tintHex: x.target.value })} className="adm-input font-mono" />
                  </span>
                </Field>
                <Field label="ক্রম">
                  <input inputMode="numeric" value={String(e.sortOrder)} onChange={(x) => setE({ ...e, sortOrder: Number(digits(x.target.value)) || 0 })} className="adm-input w-20" />
                </Field>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ pricing & shipping */

export function PricingPage({ site, token, onSaved }: { site: SiteData; token: string; onSaved: () => void }) {
  const p = site.pricing;
  const [v, setV] = useState({
    maya: String(p.maya),
    collector: String(p.collector),
    accessory: String(p.accessory),
    mini: String(p.mini),
    deliveryDhaka: String(p.deliveryDhaka),
    deliveryOutside: String(p.deliveryOutside),
  });
  const { busy, msg, run } = useSaver();
  const valid = Object.values(v).every((x) => x !== "" && Number(x) >= 0) && Number(v.maya) > 0 && Number(v.collector) > 0;
  const input = (k: keyof typeof v) => (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]">৳</span>
      <input inputMode="numeric" value={v[k]} onChange={(e) => setV({ ...v, [k]: digits(e.target.value) })} className="adm-input !pl-7 tabular-nums" />
    </span>
  );

  async function save(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() => api(token, { body: { action: "save_pricing", ...Object.fromEntries(Object.entries(v).map(([k, x]) => [k, Number(x)])) } }));
    if (ok) onSaved();
  }

  return (
    <form onSubmit={save} className="max-w-[860px]">
      <PageHeader
        title="দাম ও শিপিং"
        sub="সেভ করলে সাথে সাথে সাইটে আর নতুন অর্ডারে কাজ করে; আগের অর্ডারের দাম বদলায় না।"
        actions={
          <button type="submit" disabled={busy || !valid} className="adm-btn-primary">
            {busy ? "সেভ হচ্ছে…" : "সেভ"}
          </button>
        }
      />
      <div className="mb-3">
        <MsgBanner msg={msg} />
      </div>
      <div className="space-y-4">
        <Card title="পণ্যের দাম" sub="যে এডিশনের নিজস্ব দাম নেই, সেটা এই সাধারণ দাম নেয়।">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="মায়া (এক এডিশন)">{input("maya")}</Field>
            <Field label="কমপ্লিট কালেকশন">{input("collector")}</Field>
            <Field label="আলাদা এক্সেসরি" hint="সাইটে দেখানো দাম">
              {input("accessory")}
            </Field>
            <Field label="আলাদা মিনি কি-চেইন" hint="সাইটে দেখানো দাম">
              {input("mini")}
            </Field>
          </div>
        </Card>
        <Card title="শিপিং জোন ও চার্জ" sub="অর্ডারের সময় কাস্টমার জোন বাছেন; চার্জ অর্ডারের মোটে যোগ হয়।">
          <div className="divide-y divide-[#ebebeb] rounded-lg border border-[#e1e3e5]">
            {(
              [
                ["deliveryDhaka", "ঢাকার ভেতরে", "Dhaka"],
                ["deliveryOutside", "ঢাকার বাইরে", "সারা বাংলাদেশ"],
              ] as const
            ).map(([k, name, area]) => (
              <div key={k} className="flex items-center gap-3 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f2f4] text-[#616161]">
                  <Icon name="truck" />
                </span>
                <span className="flex-1">
                  <b>{name}</b>
                  <span className="block text-[12px] text-[#616161]">{area} · ক্যাশ অন ডেলিভারি</span>
                </span>
                <span className="w-[140px]">{input(k)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ online store (site copy) */

export function StorePage({ site, token, onSaved }: { site: SiteData; token: string; onSaved: () => void }) {
  const [copy, setCopy] = useState<SiteCopy>(() => structuredClone(site.copy));
  const { busy, msg, run } = useSaver();
  const setItem = (i: number, k: "titleBn" | "titleEn" | "descBn" | "descEn", val: string) =>
    setCopy({ ...copy, features: { ...copy.features, items: copy.features.items.map((it, j) => (j === i ? { ...it, [k]: val } : it)) } });

  async function save(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() => api(token, { body: { action: "save_site_copy", copy } }));
    if (ok) onSaved();
  }

  return (
    <form onSubmit={save}>
      <PageHeader
        title="অনলাইন স্টোর"
        sub="হোমপেজের ‘ভেতরে কী আছে’ অংশের ছয়টা ফিচার কার্ড। ছবি একই থাকে, শুধু লেখা বদলায়।"
        actions={
          <>
            <a href="/" target="_blank" rel="noreferrer" className="adm-btn">
              <Icon name="external" className="h-4 w-4" /> স্টোর দেখুন
            </a>
            <button type="submit" disabled={busy} className="adm-btn-primary">
              {busy ? "পাবলিশ হচ্ছে…" : "পাবলিশ"}
            </button>
          </>
        }
      />
      <div className="mb-3">
        <MsgBanner msg={msg} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {copy.features.items.map((it, i) => (
          <Card key={i} title={`কার্ড ${i + 1}`} sub={it.titleBn}>
            <div className="grid gap-3">
              <Field label="শিরোনাম (বাংলা)">
                <input value={it.titleBn} onChange={(e) => setItem(i, "titleBn", e.target.value)} className="adm-input" />
              </Field>
              <Field label="বিবরণ (বাংলা)">
                <textarea value={it.descBn} onChange={(e) => setItem(i, "descBn", e.target.value)} rows={2} className="adm-input" />
              </Field>
              <Field label="Title (English)">
                <input value={it.titleEn} onChange={(e) => setItem(i, "titleEn", e.target.value)} className="adm-input" />
              </Field>
              <Field label="Description (English)">
                <textarea value={it.descEn} onChange={(e) => setItem(i, "descEn", e.target.value)} rows={2} className="adm-input" />
              </Field>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ settings */

export function SettingsPage({
  site,
  token,
  orders,
  onSaved,
  onDeleteAll,
  onLogout,
}: {
  site: SiteData;
  token: string;
  orders: Order[];
  onSaved: () => void;
  onDeleteAll: () => void;
  onLogout: () => void;
}) {
  const [copy, setCopy] = useState<SiteCopy>(() => structuredClone(site.copy));
  const { busy, msg, run } = useSaver();
  const company = copy.company;
  const setCompany = (k: keyof SiteCopy["company"]) => (e: { target: { value: string } }) =>
    setCopy({ ...copy, company: { ...company, [k]: e.target.value } });

  async function save(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() => api(token, { body: { action: "save_site_copy", copy } }));
    if (ok) onSaved();
  }

  return (
    <div className="max-w-[860px]">
      <PageHeader title="সেটিংস" />
      <form onSubmit={save} className="space-y-4">
        <SettingsRow title="স্টোরের তথ্য" text="ফুটার, ইনভয়েস, বক্স লেবেল আর সার্চ ইঞ্জিনের তথ্যে দেখায়। ফোন খালি থাকলে সাইটে লুকানো থাকে।">
          <Card>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="ব্র্যান্ড / কোম্পানির নাম">
                <input value={company.brandName} onChange={setCompany("brandName")} className="adm-input" />
              </Field>
              <Field label="ইমেইল">
                <input type="email" value={company.email} onChange={setCompany("email")} className="adm-input" />
              </Field>
              <Field label="ফোন">
                <input value={company.phone} onChange={setCompany("phone")} className="adm-input" placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="ঠিকানা">
                <input value={company.address} onChange={setCompany("address")} className="adm-input" />
              </Field>
              <Field label="ট্যাগলাইন (বাংলা)">
                <input value={company.taglineBn} onChange={setCompany("taglineBn")} className="adm-input" />
              </Field>
              <Field label="Tagline (English)">
                <input value={company.taglineEn} onChange={setCompany("taglineEn")} className="adm-input" />
              </Field>
              <Field label="কপিরাইট লাইন" className="sm:col-span-2">
                <input value={company.copyright} onChange={setCompany("copyright")} className="adm-input" />
              </Field>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <div className="flex-1">
                <MsgBanner msg={msg} />
              </div>
              <button type="submit" disabled={busy} className="adm-btn-primary">
                {busy ? "সেভ হচ্ছে…" : "সেভ"}
              </button>
            </div>
          </Card>
        </SettingsRow>
      </form>

      <div className="mt-6 space-y-4">
        <SettingsRow title="সেশন" text="এই ব্রাউজারে admin token রাখা আছে। অন্যের কম্পিউটারে কাজ শেষে লগআউট করুন।">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f2f4] text-[#616161]">
                <Icon name="key" />
              </span>
              <span className="flex-1 text-[13px]">Admin token দিয়ে লগইন করা</span>
              <button onClick={onLogout} className="adm-btn">
                <Icon name="logout" className="h-4 w-4" /> লগআউট
              </button>
            </div>
          </Card>
        </SettingsRow>
        <SettingsRow title="বিপজ্জনক কাজ" text="এগুলো আর ফেরানো যায় না।">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <span className="min-w-[200px] flex-1">
                <b>সব অর্ডার মুছুন</b>
                <span className="block text-[12.5px] text-[#616161]">
                  {orders.length}টি অর্ডার, কুরিয়ার, পেমেন্ট আর ইতিহাস মুছে যাবে। অর্ডার নম্বর আবার ১ থেকে শুরু হবে।
                </span>
              </span>
              <button onClick={onDeleteAll} disabled={!orders.length} className="adm-btn-danger">
                <Icon name="trash" className="h-4 w-4" /> সব অর্ডার মুছুন
              </button>
            </div>
          </Card>
        </SettingsRow>
      </div>
    </div>
  );
}

function SettingsRow({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-[240px_1fr]">
      <div>
        <h2 className="text-[14px] font-semibold text-[#303030]">{title}</h2>
        <p className="mt-1 text-[12.5px] text-[#616161]">{text}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ dialogs */

function Modal({ title, onClose, children, footer, danger }: { title: string; onClose: () => void; children: ReactNode; footer: ReactNode; danger?: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[580px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className={`flex items-center justify-between border-b border-[#e1e3e5] px-4 py-3 ${danger ? "bg-[#fff4f4]" : "bg-[#f7f7f8]"}`}>
          <h2 className={`text-[15px] font-semibold ${danger ? "text-[#8e1f0b]" : "text-[#303030]"}`}>{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-[#616161] hover:bg-black/5" aria-label="বন্ধ">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex justify-end gap-2 border-t border-[#e1e3e5] px-4 py-3">{footer}</div>
      </div>
    </div>
  );
}

export function DeleteAllDialog({ orders, token, onClose, onDone }: { orders: Order[]; token: string; onClose: () => void; onDone: (text: string) => void }) {
  const [word, setWord] = useState("");
  const [restock, setRestock] = useState(true);
  const { busy, msg, run } = useSaver();
  const holding = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const units = holding.reduce((s, o) => s + o.qty, 0);

  async function go() {
    let text = "";
    const ok = await run(async () => {
      const r = await api<{ deleted: number; restocked: Record<string, number> }>(token, {
        body: { action: "delete_all_orders", confirm: "DELETE", restock },
      });
      const back = Object.values(r.restocked).reduce((a, b) => a + b, 0);
      text = `${r.deleted}টি অর্ডার মুছে ফেলা হয়েছে${restock ? `, ${back}টি ইউনিট স্টকে ফেরত গেছে` : ""}।`;
    }, "মুছে ফেলা হয়েছে।");
    if (ok) onDone(text);
  }

  return (
    <Modal
      danger
      title="সব অর্ডার মুছে ফেলবেন?"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="adm-btn">
            থাক
          </button>
          <button type="button" onClick={go} disabled={busy || word !== "DELETE" || orders.length === 0} className="adm-btn-danger">
            {busy ? "মুছছে…" : "সব মুছে ফেলুন"}
          </button>
        </>
      }
    >
      <Banner tone="critical">
        {orders.length}টি অর্ডার, তাদের কুরিয়ার, পেমেন্ট আর ইতিহাস স্থায়ীভাবে মুছে যাবে। এটা আর ফেরানো যাবে না। অর্ডার নম্বর আবার ১ থেকে শুরু হবে।
      </Banner>
      <label className="mt-3 flex items-start gap-2 rounded-lg border border-[#e1e3e5] p-3">
        <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} className="mt-0.5" />
        <span>
          চালু অর্ডারের স্টক ফেরত দিন ({holding.length}টি অর্ডার, {units}টি ইউনিট)
          <span className="block text-[12px] text-[#616161]">বাতিল আর ফেরত অর্ডারের স্টক আগেই ফেরত গেছে। সত্যিই বিক্রি হওয়া অর্ডার মুছলে টিক তুলে দিন।</span>
        </span>
      </label>
      <Field label="নিশ্চিত করতে DELETE লিখুন" className="mt-3">
        <input value={word} onChange={(e) => setWord(e.target.value)} className="adm-input font-mono" autoComplete="off" autoFocus />
      </Field>
      <div className="mt-3">
        <MsgBanner msg={msg} />
      </div>
    </Modal>
  );
}

export function NewOrderDialog({
  stock,
  site,
  token,
  onClose,
  onCreated,
}: {
  stock: StockItem[];
  site: SiteData | null;
  token: string;
  onClose: () => void;
  onCreated: (o: Order) => void;
}) {
  const firstInStock = stock.find((s) => s.qty > 0)?.variant ?? stock[0]?.variant ?? "";
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", location: "dhaka", variant: firstInStock, qty: "1", note: "" });
  const { busy, msg, run } = useSaver();
  const item = stock.find((s) => s.variant === f.variant);
  const qty = Math.max(1, Number(f.qty) || 1);
  const fee = f.location === "outside" ? (site?.pricing.deliveryOutside ?? 0) : (site?.pricing.deliveryDhaka ?? 0);
  const total = (item?.price ?? 0) * qty + fee;
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const ready = !!item && item.qty >= qty && f.name.trim() && f.phone.trim() && f.address.trim();

  async function save(e?: FormEvent) {
    e?.preventDefault();
    let created: Order | null = null;
    const ok = await run(async () => {
      const res = await api<{ order: Order }>(token, { body: { action: "create_preorder", ...f, qty } });
      created = res.order;
    }, "অর্ডার তৈরি হয়েছে।");
    if (ok && created) onCreated(created);
  }

  return (
    <Modal
      title="অর্ডার তৈরি"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="adm-btn">
            বাতিল
          </button>
          <button type="button" onClick={() => save()} disabled={busy || !ready} className="adm-btn-primary">
            {busy ? "তৈরি হচ্ছে…" : item && item.qty < qty ? "যথেষ্ট স্টক নেই" : "অর্ডার তৈরি করুন"}
          </button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <p className="text-[12.5px] text-[#616161]">ফোন, মেসেজ বা দোকান থেকে আসা অর্ডার। স্টক থেকে কমবে।</p>
        <div>
          <p className="adm-label">পণ্য</p>
          <div className="flex items-center gap-3 rounded-lg border border-[#e1e3e5] p-2">
            <Thumb slug={variantSlug(f.variant)} size={40} />
            <select value={f.variant} onChange={set("variant")} className="adm-input flex-1">
              {stock.map((s) => (
                <option key={s.variant} value={s.variant} disabled={s.qty <= 0}>
                  {s.nameBn} · {taka(s.price)} · {s.qty > 0 ? `${s.qty}টি আছে` : "স্টক নেই"}
                </option>
              ))}
            </select>
            <input inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: digits(e.target.value) })} className="adm-input !w-16 text-center" aria-label="সংখ্যা" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="কাস্টমারের নাম">
            <input value={f.name} onChange={set("name")} required className="adm-input" />
          </Field>
          <Field label="ফোন">
            <input value={f.phone} onChange={set("phone")} required className="adm-input" placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="ইমেইল (ঐচ্ছিক)">
            <input type="email" value={f.email} onChange={set("email")} className="adm-input" />
          </Field>
          <Field label="শিপিং জোন">
            <select value={f.location} onChange={set("location")} className="adm-input">
              <option value="dhaka">ঢাকার ভেতরে ({taka(site?.pricing.deliveryDhaka ?? 0)})</option>
              <option value="outside">ঢাকার বাইরে ({taka(site?.pricing.deliveryOutside ?? 0)})</option>
            </select>
          </Field>
          <Field label="ঠিকানা" className="sm:col-span-2">
            <input value={f.address} onChange={set("address")} required className="adm-input" />
          </Field>
          <Field label="নোট (ঐচ্ছিক)" className="sm:col-span-2">
            <input value={f.note} onChange={set("note")} className="adm-input" placeholder="যেমন: ফেসবুক পেজ থেকে" />
          </Field>
        </div>
        <div className="rounded-lg bg-[#f7f7f8] p-3 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#616161]">সাবটোটাল</span>
            <span className="tabular-nums">{taka((item?.price ?? 0) * qty)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#616161]">ডেলিভারি</span>
            <span className="tabular-nums">{taka(fee)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-[#e1e3e5] pt-1 font-semibold">
            <span>মোট (COD)</span>
            <span className="tabular-nums">{taka(total)}</span>
          </div>
        </div>
        <MsgBanner msg={msg} />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

