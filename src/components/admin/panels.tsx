"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ORDER_STATUSES, STATUS_LABELS } from "@/db/statuses";
import { api, label, taka, type Edition, type Order, type SiteCopy, type SiteData, type StockItem, type Summary } from "./lib";

/* ------------------------------------------------------------------ shared bits */

export function Card({ title, sub, children, right }: { title: string; sub?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="min-w-0 rounded-[20px] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight">{title}</h2>
          {sub && <p className="mt-0.5 text-[13px] text-[#6e6e73]">{sub}</p>}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return <p className={`rounded-xl p-3 text-[14px] ${msg.ok ? "bg-[#e7f6ea] text-[#1d7a33]" : "bg-[#fff2f2] text-[#d70015]"}`}>{msg.text}</p>;
}

/** Runs a save and keeps busy/message state. */
function useSaver() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function run(fn: () => Promise<unknown>, okText = "সেভ হয়েছে, ওয়েবসাইটে চলে গেছে।") {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ ok: true, text: okText });
      return true;
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "সেভ করা গেল না।" });
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { busy, msg, run };
}

function Field({ label: l, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{l}</span>
      {children}
    </label>
  );
}

const digits = (v: string) => v.replace(/[^\d]/g, "");

/* ------------------------------------------------------------------ overview */

export function OverviewPanel({
  orders,
  summary,
  stock,
  onOpenOrder,
}: {
  orders: Order[];
  summary: Summary;
  stock: StockItem[];
  onOpenOrder: (id: number) => void;
}) {
  const nameOf = (v: string) => stock.find((s) => s.variant === v)?.nameBn ?? v;
  const variants = Object.entries(summary.byVariant).sort((a, b) => b[1].units - a[1].units);
  const maxUnits = Math.max(1, ...variants.map(([, v]) => v.units));
  const maxStatus = Math.max(1, ...ORDER_STATUSES.map((s) => summary.byStatus[s] ?? 0));
  const low = stock.filter((s) => s.qty <= 3);

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="এডিশন অনুযায়ী বিক্রি" sub="বাতিল আর ফেরত বাদে">
        {variants.length === 0 ? (
          <p className="text-[14px] text-[#86868b]">এখনো কোনো অর্ডার নেই।</p>
        ) : (
          <ul className="space-y-3">
            {variants.map(([v, d]) => (
              <li key={v}>
                <div className="flex justify-between text-[14px]">
                  <span>{nameOf(v)}</span>
                  <span className="tabular-nums text-[#6e6e73]">
                    {d.units} ইউনিট · {taka(d.revenue)}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[#f0f0f2]">
                  <div className="h-2 rounded-full bg-[#0071e3]" style={{ width: `${(d.units / maxUnits) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="ফুলফিলমেন্ট পাইপলাইন" sub="কোন ধাপে কয়টা অর্ডার">
        <ul className="space-y-2">
          {ORDER_STATUSES.map((s) => {
            const n = summary.byStatus[s] ?? 0;
            return (
              <li key={s} className="grid grid-cols-[112px_1fr_32px] items-center sm:grid-cols-[140px_1fr_32px] gap-3 text-[14px]">
                <span>{STATUS_LABELS[s].bn}</span>
                <div className="h-2 rounded-full bg-[#f0f0f2]">
                  <div className="h-2 rounded-full bg-[#1d1d1f]" style={{ width: `${(n / maxStatus) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title="সাম্প্রতিক অর্ডার">
        {orders.length === 0 ? (
          <p className="text-[14px] text-[#86868b]">এখনো কোনো অর্ডার নেই।</p>
        ) : (
          <ul className="divide-y divide-[#f0f0f2]">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id}>
                <button onClick={() => onOpenOrder(o.id)} className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-[#f9f9fb]">
                  <span className="w-10 text-[13px] text-[#86868b]">#{o.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[14px]">
                    {o.name} · {nameOf(o.variant)} × {o.qty}
                  </span>
                  <span className="text-[12px] text-[#86868b]">{label(o.status)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="স্টক সতর্কতা" sub="৩টি বা তার কম বাকি">
        {low.length === 0 ? (
          <p className="text-[14px] text-[#86868b]">সব এডিশনে যথেষ্ট স্টক আছে।</p>
        ) : (
          <ul className="space-y-1.5 text-[14px]">
            {low.map((s) => (
              <li key={s.variant} className="flex justify-between">
                <span>{s.nameBn}</span>
                <span className={s.qty === 0 ? "font-medium text-[#d70015]" : "text-[#bf4800]"}>{s.qty === 0 ? "শেষ" : `${s.qty}টি`}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ pricing */

export function PricingPanel({ site, token, onSaved }: { site: SiteData; token: string; onSaved: () => void }) {
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
  const rows: [keyof typeof v, string, string][] = [
    ["maya", "মায়া (এক এডিশন)", "যে এডিশনের আলাদা দাম নেই, সেটার দাম"],
    ["collector", "কমপ্লিট কালেকশন", "Collector's Set"],
    ["accessory", "আলাদা এক্সেসরি", "সাইটে দেখানো দাম"],
    ["mini", "আলাদা মিনি কি-চেইন", "সাইটে দেখানো দাম"],
    ["deliveryDhaka", "ডেলিভারি: ঢাকার ভেতরে", ""],
    ["deliveryOutside", "ডেলিভারি: ঢাকার বাইরে", ""],
  ];
  const valid = Object.values(v).every((x) => x !== "" && Number(x) >= 0) && Number(v.maya) > 0 && Number(v.collector) > 0;

  async function save(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() => api(token, { body: { action: "save_pricing", ...Object.fromEntries(Object.entries(v).map(([k, x]) => [k, Number(x)])) } }));
    if (ok) onSaved();
  }

  return (
    <form onSubmit={save} className="mt-6 max-w-[720px]">
      <Card title="দাম আর ডেলিভারি চার্জ" sub="সব টাকায় (৳)। সেভ করলে সাথে সাথে সাইট আর নতুন অর্ডারে কাজ করবে; আগের অর্ডারের দাম বদলায় না।">
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map(([k, l, hint]) => (
            <Field key={k} label={l}>
              <input inputMode="numeric" value={v[k]} onChange={(e) => setV({ ...v, [k]: digits(e.target.value) })} className="field tabular-nums" />
              {hint && <span className="mt-1 block text-[12px] text-[#86868b]">{hint}</span>}
            </Field>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          <Msg msg={msg} />
          <button type="submit" disabled={busy || !valid} className="btn-primary px-6 py-2.5 text-[15px] disabled:opacity-50">
            {busy ? "সেভ হচ্ছে…" : "দাম সেভ করুন"}
          </button>
        </div>
      </Card>
    </form>
  );
}

/* ------------------------------------------------------------------ editions */

export function EditionsPanel({ site, token, onSaved }: { site: SiteData; token: string; onSaved: () => void }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {site.editions.map((e) => (
        <EditionCard key={e.id} edition={e} basePrice={site.pricing.maya} token={token} onSaved={onSaved} />
      ))}
    </div>
  );
}

function EditionCard({ edition, basePrice, token, onSaved }: { edition: Edition; basePrice: number; token: string; onSaved: () => void }) {
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
      <Card
        title={e.nameBn || e.nameEn}
        sub={`ফর্মের variant: ${e.variant}`}
        right={
          <label className="flex items-center gap-2 text-[13px] text-[#424245]">
            <input type="checkbox" checked={e.active} onChange={(x) => setE({ ...e, active: x.target.checked })} />
            সাইটে দেখান
          </label>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="নাম (বাংলা)">
            <input value={e.nameBn} onChange={set("nameBn")} className="field" required />
          </Field>
          <Field label="Name (English)">
            <input value={e.nameEn} onChange={set("nameEn")} className="field" required />
          </Field>
          <Field label="এক্সেসরি (বাংলা)">
            <input value={e.accessoryBn} onChange={set("accessoryBn")} className="field" />
          </Field>
          <Field label="Accessory (English)">
            <input value={e.accessoryEn} onChange={set("accessoryEn")} className="field" />
          </Field>
          <Field label="চোখ (বাংলা)">
            <input value={e.eyesBn} onChange={set("eyesBn")} className="field" />
          </Field>
          <Field label="Eyes (English)">
            <input value={e.eyesEn} onChange={set("eyesEn")} className="field" />
          </Field>
          <Field label={`দাম (৳) · খালি = ${taka(basePrice)}`}>
            <input inputMode="numeric" value={e.price} onChange={(x) => setE({ ...e, price: digits(x.target.value) })} className="field" placeholder={String(basePrice)} />
          </Field>
          <div className="grid grid-cols-[1fr_88px] gap-3 sm:col-span-2">
            <Field label="রং (tint)">
              <span className="flex items-center gap-2">
                <input type="color" value={/^#[0-9a-f]{6}$/i.test(e.tintHex) ? e.tintHex : "#f3f1ee"} onChange={(x) => setE({ ...e, tintHex: x.target.value })} className="mt-1.5 h-10 w-12 rounded-lg border border-[#d2d2d7]" />
                <input value={e.tintHex} onChange={(x) => setE({ ...e, tintHex: x.target.value })} className="field" />
              </span>
            </Field>
            <Field label="ক্রম">
              <input inputMode="numeric" value={String(e.sortOrder)} onChange={(x) => setE({ ...e, sortOrder: Number(digits(x.target.value)) || 0 })} className="field" />
            </Field>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <Msg msg={msg} />
          <button type="submit" disabled={busy} className="btn-primary px-5 py-2 text-[14px] disabled:opacity-50">
            {busy ? "সেভ হচ্ছে…" : "সেভ"}
          </button>
        </div>
      </Card>
    </form>
  );
}

/* ------------------------------------------------------------------ site copy */

export function CopyPanel({ site, token, onSaved }: { site: SiteData; token: string; onSaved: () => void }) {
  const [copy, setCopy] = useState<SiteCopy>(() => structuredClone(site.copy));
  const { busy, msg, run } = useSaver();
  const company = copy.company;
  const setCompany = (k: keyof SiteCopy["company"]) => (e: { target: { value: string } }) =>
    setCopy({ ...copy, company: { ...company, [k]: e.target.value } });
  const setItem = (i: number, k: "titleBn" | "titleEn" | "descBn" | "descEn", val: string) =>
    setCopy({ ...copy, features: { ...copy.features, items: copy.features.items.map((it, j) => (j === i ? { ...it, [k]: val } : it)) } });

  async function save(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() => api(token, { body: { action: "save_site_copy", copy } }));
    if (ok) onSaved();
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-4">
      <Card title="কোম্পানির তথ্য" sub="ফুটার, ইনভয়েস আর সার্চ ইঞ্জিনের তথ্যে দেখায়। ফোন খালি থাকলে সাইটে লুকানো থাকে।">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ব্র্যান্ড / কোম্পানির নাম">
            <input value={company.brandName} onChange={setCompany("brandName")} className="field" />
          </Field>
          <Field label="ইমেইল">
            <input type="email" value={company.email} onChange={setCompany("email")} className="field" />
          </Field>
          <Field label="ফোন">
            <input value={company.phone} onChange={setCompany("phone")} className="field" placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="ঠিকানা">
            <input value={company.address} onChange={setCompany("address")} className="field" />
          </Field>
          <Field label="ট্যাগলাইন (বাংলা)">
            <input value={company.taglineBn} onChange={setCompany("taglineBn")} className="field" />
          </Field>
          <Field label="Tagline (English)">
            <input value={company.taglineEn} onChange={setCompany("taglineEn")} className="field" />
          </Field>
          <Field label="কপিরাইট লাইন" className="sm:col-span-2">
            <input value={company.copyright} onChange={setCompany("copyright")} className="field" />
          </Field>
        </div>
      </Card>

      <Card title="ফিচার কার্ড" sub="হোমপেজের ‘ভেতরে কী আছে’ অংশের ছয়টা কার্ড। ছবি একই থাকে, শুধু লেখা বদলায়।">
        <div className="grid gap-4 lg:grid-cols-2">
          {copy.features.items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[#e5e5ea] p-4">
              <p className="text-[12px] font-medium text-[#86868b]">কার্ড {i + 1}</p>
              <div className="mt-2 grid gap-3">
                <Field label="শিরোনাম (বাংলা)">
                  <input value={it.titleBn} onChange={(e) => setItem(i, "titleBn", e.target.value)} className="field" />
                </Field>
                <Field label="বিবরণ (বাংলা)">
                  <textarea value={it.descBn} onChange={(e) => setItem(i, "descBn", e.target.value)} rows={2} className="field" />
                </Field>
                <Field label="Title (English)">
                  <input value={it.titleEn} onChange={(e) => setItem(i, "titleEn", e.target.value)} className="field" />
                </Field>
                <Field label="Description (English)">
                  <textarea value={it.descEn} onChange={(e) => setItem(i, "descEn", e.target.value)} rows={2} className="field" />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-[20px] bg-white/90 p-3 shadow-sm backdrop-blur">
        <button type="submit" disabled={busy} className="btn-primary px-6 py-2.5 text-[15px] disabled:opacity-50">
          {busy ? "পাবলিশ হচ্ছে…" : "সাইটে পাবলিশ করুন"}
        </button>
        <div className="flex-1">
          <Msg msg={msg} />
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ delete all orders */

export function DeleteAllDialog({
  orders,
  token,
  onClose,
  onDone,
}: {
  orders: Order[];
  token: string;
  onClose: () => void;
  onDone: (text: string) => void;
}) {
  const [word, setWord] = useState("");
  const [restock, setRestock] = useState(true);
  const { busy, msg, run } = useSaver();
  const holding = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const units = holding.reduce((s, o) => s + o.qty, 0);

  async function go(e: FormEvent) {
    e.preventDefault();
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
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 p-4 sm:items-center" onClick={onClose}>
      <form onSubmit={go} onClick={(e) => e.stopPropagation()} className="w-full max-w-[480px] rounded-[24px] bg-white p-6">
        <h2 className="text-[21px] font-semibold tracking-tight text-[#d70015]">সব অর্ডার মুছে ফেলবেন?</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#424245]">
          {orders.length}টি অর্ডার, তাদের কুরিয়ার, পেমেন্ট আর ইতিহাস স্থায়ীভাবে মুছে যাবে। এটা আর ফেরানো যাবে না। অর্ডার নম্বর আবার ১ থেকে শুরু হবে।
        </p>
        <label className="mt-4 flex items-start gap-2 rounded-xl bg-[#f5f5f7] p-3 text-[14px]">
          <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} className="mt-1" />
          <span>
            চালু অর্ডারের স্টক ফেরত দিন ({holding.length}টি অর্ডার, {units}টি ইউনিট)।
            <span className="block text-[12px] text-[#6e6e73]">বাতিল আর ফেরত অর্ডারের স্টক আগেই ফেরত গেছে। সত্যিই বিক্রি হওয়া অর্ডার মুছলে টিক তুলে দিন।</span>
          </span>
        </label>
        <label className="mt-4 block">
          <span className="field-label">নিশ্চিত করতে DELETE লিখুন</span>
          <input value={word} onChange={(e) => setWord(e.target.value)} className="field font-mono" autoComplete="off" autoFocus />
        </label>
        <div className="mt-4 space-y-3">
          <Msg msg={msg} />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[#d2d2d7] py-2.5 text-[15px]">
              থাক
            </button>
            <button
              type="submit"
              disabled={busy || word !== "DELETE" || orders.length === 0}
              className="flex-1 rounded-full bg-[#d70015] py-2.5 text-[15px] font-medium text-white disabled:opacity-40"
            >
              {busy ? "মুছছে…" : "সব মুছে ফেলুন"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ manual order */

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

  async function save(e: FormEvent) {
    e.preventDefault();
    let created: Order | null = null;
    const ok = await run(async () => {
      const res = await api<{ order: Order }>(token, { body: { action: "create_preorder", ...f, qty } });
      created = res.order;
    }, "অর্ডার যোগ হয়েছে।");
    if (ok && created) onCreated(created);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 p-4 sm:items-center" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-[560px] rounded-[24px] bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[21px] font-semibold tracking-tight">হাতে অর্ডার যোগ করুন</h2>
            <p className="mt-0.5 text-[13px] text-[#6e6e73]">ফোন, মেসেজ বা দোকান থেকে আসা অর্ডার। স্টক থেকে কমবে।</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-2 text-[22px] leading-none text-[#86868b]" aria-label="বন্ধ">
            ×
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="নাম">
            <input value={f.name} onChange={set("name")} required className="field" />
          </Field>
          <Field label="ফোন">
            <input value={f.phone} onChange={set("phone")} required className="field" placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="ইমেইল (ঐচ্ছিক)">
            <input type="email" value={f.email} onChange={set("email")} className="field" />
          </Field>
          <Field label="এলাকা">
            <select value={f.location} onChange={set("location")} className="field">
              <option value="dhaka">ঢাকার ভেতরে ({taka(site?.pricing.deliveryDhaka ?? 0)})</option>
              <option value="outside">ঢাকার বাইরে ({taka(site?.pricing.deliveryOutside ?? 0)})</option>
            </select>
          </Field>
          <Field label="ঠিকানা" className="sm:col-span-2">
            <input value={f.address} onChange={set("address")} required className="field" />
          </Field>
          <Field label="এডিশন">
            <select value={f.variant} onChange={set("variant")} className="field">
              {stock.map((s) => (
                <option key={s.variant} value={s.variant} disabled={s.qty <= 0}>
                  {s.nameBn} · {taka(s.price)} · {s.qty > 0 ? `${s.qty}টি আছে` : "স্টক নেই"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="সংখ্যা">
            <input inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: digits(e.target.value) })} className="field" />
          </Field>
          <Field label="নোট (ঐচ্ছিক)" className="sm:col-span-2">
            <input value={f.note} onChange={set("note")} className="field" placeholder="যেমন: ফেসবুক পেজ থেকে" />
          </Field>
        </div>
        <p className="mt-4 text-[15px]">
          মোট (COD): <b>{taka(total)}</b> <span className="text-[13px] text-[#86868b]">ডেলিভারি সহ</span>
        </p>
        <div className="mt-4 space-y-3">
          <Msg msg={msg} />
          <button type="submit" disabled={busy || !item || item.qty < qty} className="btn-primary w-full py-3 text-[16px] disabled:opacity-50">
            {busy ? "যোগ হচ্ছে…" : item && item.qty < qty ? "যথেষ্ট স্টক নেই" : "অর্ডার যোগ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}

