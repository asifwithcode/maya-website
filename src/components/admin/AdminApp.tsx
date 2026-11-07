"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/db/statuses";
import {
  api,
  AuthError,
  clearToken,
  COURIERS,
  label,
  POLL_MS,
  readToken,
  saveToken,
  STATUS_TONE,
  taka,
  when,
  type Order,
  type SiteData,
  type StockItem,
  type Summary,
} from "./lib";
import { CopyPanel, EditionsPanel, NewOrderDialog, OverviewPanel, PricingPanel } from "./panels";
import { printInvoice } from "./invoice";

/* ------------------------------------------------------------------ app */

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null); // null = still reading storage
  useEffect(() => {
    const t = setTimeout(() => setToken(readToken()), 0); // storage exists only in the browser
    return () => clearTimeout(t);
  }, []);

  if (token === null) return <Shell />;
  if (!token) return <Login onToken={setToken} />;
  return (
    <Dashboard
      token={token}
      onLogout={() => {
        clearToken();
        setToken("");
      }}
    />
  );
}

function Shell({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">{children}</div>;
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const t = value.trim();
    if (!t) return;
    setBusy(true);
    setError("");
    try {
      await api(t, { view: "stock" });
      saveToken(t, remember);
      onToken(t);
    } catch (err) {
      setError(err instanceof AuthError ? "টোকেন সঠিক নয়।" : "সার্ভারে পৌঁছানো গেল না। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-[400px] rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#86868b]">Maya</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Admin লগইন</h1>
          <p className="mt-2 text-[15px] text-[#6e6e73]">অর্ডার, সেলস আর স্টক দেখতে admin token দিন।</p>
          <label className="mt-6 block">
            <span className="field-label">Admin token</span>
            <input
              type="password"
              autoComplete="current-password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="field"
              autoFocus
            />
          </label>
          <label className="mt-4 flex items-center gap-2 text-[14px] text-[#424245]">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            এই ডিভাইসে মনে রাখুন
          </label>
          {error && <p className="mt-4 rounded-xl bg-[#fff2f2] p-3 text-[14px] text-[#d70015]">{error}</p>}
          <button type="submit" disabled={busy || !value.trim()} className="btn-primary mt-6 w-full py-3 text-[16px] disabled:opacity-50">
            {busy ? "যাচাই হচ্ছে…" : "লগইন"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

type Tab = "overview" | "orders" | "stock" | "pricing" | "editions" | "copy";
const TABS: [Tab, string][] = [
  ["overview", "ড্যাশবোর্ড"],
  ["orders", "অর্ডার"],
  ["stock", "স্টক"],
  ["pricing", "দাম"],
  ["editions", "এডিশন"],
  ["copy", "সাইটের লেখা"],
];

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [site, setSite] = useState<SiteData | null>(null);
  const [adding, setAdding] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loadedAt, setLoadedAt] = useState<string>("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const [o, s] = await Promise.all([
        api<{ orders: Order[]; summary: Summary; serverTime: string }>(token, { view: "orders" }),
        api<{ items: StockItem[] }>(token, { view: "stock" }),
      ]);
      setOrders(o.orders);
      setSummary(o.summary);
      setStock(s.items);
      setLoadedAt(o.serverTime);
      setError("");
    } catch (err) {
      if (err instanceof AuthError) onLogout();
      else setError(err instanceof Error ? err.message : "লোড করা গেল না।");
    }
  }, [token, onLogout]);

  const loadSite = useCallback(async () => {
    try {
      setSite(await api<SiteData>(token));
    } catch (err) {
      if (err instanceof AuthError) onLogout();
    }
  }, [token, onLogout]);
  useEffect(() => {
    const t = setTimeout(loadSite, 0);
    return () => clearTimeout(t);
  }, [loadSite]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const id = setInterval(load, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [load]);

  const onOrderSaved = (o: Order) => {
    setOrders((list) => list.map((x) => (x.id === o.id ? o : x)));
    load(); // totals and stock follow status changes
  };

  const sel = orders.find((o) => o.id === selected) ?? null;
  const afterSiteSave = () => {
    loadSite();
    load(); // prices and names feed stock and new orders
  };
  const itemName = (variant: string) => {
    const s = stock.find((x) => x.variant === variant);
    return s ? (variant === "Collector's Set" ? s.name : `Maya · ${s.name}`) : `Maya · ${variant}`;
  };
  const company = site?.copy.company;
  const sender = {
    name: company?.brandName || "Xentoryx Labs",
    address: company?.address || "Dhaka, Bangladesh",
    phone: company?.phone || "",
    email: company?.email || "",
  };
  const newCount = summary?.byStatus.new ?? 0;

  return (
    <Shell>
      <header className="sticky top-0 z-20 overflow-hidden border-b border-[#d2d2d7]/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-4 sm:gap-3">
          <span className="whitespace-nowrap text-[17px] font-semibold">Maya<span className="max-sm:hidden"> Admin</span></span>
          <span className="ml-auto hidden text-[12px] text-[#86868b] md:inline">{loadedAt && `আপডেট ${when(loadedAt)}`}</span>
          <button onClick={() => setAdding(true)} className="ml-auto whitespace-nowrap rounded-full bg-[#0071e3] px-3 py-1.5 text-[14px] text-white md:ml-0">
            + <span className="max-sm:hidden">নতুন </span>অর্ডার
          </button>
          <button
            onClick={() => {
              load();
              loadSite();
            }}
            className="rounded-full px-2 py-1.5 text-[14px] text-[#0071e3] hover:bg-[#f5f5f7] sm:px-3"
          >
            রিফ্রেশ
          </button>
          <button onClick={onLogout} className="rounded-full px-2 py-1.5 text-[14px] text-[#424245] hover:bg-[#f5f5f7] sm:px-3">
            লগআউট
          </button>
        </div>
        <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map(([t, name]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[14px] ${tab === t ? "bg-[#1d1d1f] text-white" : "text-[#424245] hover:bg-[#f5f5f7]"}`}
            >
              {name}
              {t === "orders" && newCount > 0 && <span className="ml-1.5 rounded-full bg-[#0071e3] px-1.5 text-[11px] text-white">{newCount}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        {error && <p className="mb-4 rounded-xl bg-[#fff2f2] p-3 text-[14px] text-[#d70015]">{error}</p>}
        {summary && (tab === "overview" || tab === "orders") && <SummaryCards summary={summary} stock={stock} />}
        {tab === "overview" && summary && (
          <OverviewPanel
            orders={orders}
            summary={summary}
            stock={stock}
            onOpenOrder={(id) => {
              setSelected(id);
              setTab("orders");
            }}
          />
        )}
        {tab === "orders" && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_440px]">
            <OrderList orders={orders} selected={selected} onSelect={setSelected} />
            {sel ? (
              <OrderDetail
                key={sel.id}
                order={sel}
                token={token}
                itemName={itemName(sel.variant)}
                sender={sender}
                onSaved={onOrderSaved}
                onClose={() => setSelected(null)}
              />
            ) : (
              <div className="hidden h-fit rounded-[20px] bg-white p-8 text-center text-[15px] text-[#86868b] lg:block">
                বিস্তারিত দেখতে একটা অর্ডার বেছে নিন।
              </div>
            )}
          </div>
        )}
        {tab === "stock" && <StockPanel items={stock} summary={summary} token={token} onSaved={load} />}
        {(tab === "pricing" || tab === "editions" || tab === "copy") && !site && <p className="mt-6 text-[15px] text-[#86868b]">লোড হচ্ছে…</p>}
        {tab === "pricing" && site && <PricingPanel site={site} token={token} onSaved={afterSiteSave} />}
        {tab === "editions" && site && <EditionsPanel site={site} token={token} onSaved={afterSiteSave} />}
        {tab === "copy" && site && <CopyPanel site={site} token={token} onSaved={afterSiteSave} />}
      </main>
      {adding && (
        <NewOrderDialog
          stock={stock}
          site={site}
          token={token}
          onClose={() => setAdding(false)}
          onCreated={(o) => {
            setAdding(false);
            setSelected(o.id);
            setTab("orders");
            load();
          }}
        />
      )}
    </Shell>
  );
}

function SummaryCards({ summary, stock }: { summary: Summary; stock: StockItem[] }) {
  const inStock = stock.reduce((s, i) => s + i.qty, 0);
  const cards: [string, string, string?][] = [
    ["মোট অর্ডার", String(summary.orders), `${summary.activeOrders} চালু · ${summary.units} ইউনিট`],
    ["নতুন", String(summary.byStatus.new ?? 0), "কল করে কনফার্ম করুন"],
    ["বুকড সেলস", taka(summary.bookedRevenue), "বাতিল/ফেরত বাদে, ডেলিভারি সহ"],
    ["ডেলিভারড", taka(summary.deliveredRevenue), `${summary.byStatus.delivered ?? 0}টি অর্ডার`],
    ["আদায় হয়েছে", taka(summary.collected), "paid ফিল্ডের যোগফল"],
    ["স্টকে আছে", String(inStock), `${stock.filter((i) => i.qty === 0).length}টি ভ্যারিয়েন্ট শেষ`],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map(([k, v, sub]) => (
        <div key={k} className="rounded-[20px] bg-white p-4">
          <p className="text-[13px] text-[#6e6e73]">{k}</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight tabular-nums">{v}</p>
          {sub && <p className="mt-0.5 text-[12px] text-[#86868b]">{sub}</p>}
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium ${STATUS_TONE[status]}`}>{label(status)}</span>;
}

function OrderList({ orders, selected, onSelect }: { orders: Order[]; selected: number | null; onSelect: (id: number) => void }) {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "all" || o.status === filter) &&
        (!needle ||
          [o.name, o.phone, o.email, o.address, o.trackingNo, String(o.id), o.variant].some((f) => f.toLowerCase().includes(needle))),
    );
  }, [orders, filter, q]);

  return (
    <div className="min-w-0 rounded-[20px] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#f0f0f2] p-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="খুঁজুন: নাম, ফোন, #আইডি, ট্র্যাকিং" className="field !mt-0 min-w-[200px] flex-1 !py-2" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="field !mt-0 !w-auto !py-2">
          <option value="all">সব স্ট্যাটাস</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </div>
      {shown.length === 0 ? (
        <p className="p-10 text-center text-[15px] text-[#86868b]">{orders.length ? "কিছু পাওয়া যায়নি।" : "এখনো কোনো অর্ডার নেই।"}</p>
      ) : (
        <ul className="divide-y divide-[#f0f0f2]">
          {shown.map((o) => (
            <li key={o.id}>
              <button
                onClick={() => onSelect(o.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f9f9fb] ${selected === o.id ? "bg-[#f2f7fe]" : ""}`}
              >
                <span className="w-12 shrink-0 text-[13px] tabular-nums text-[#86868b]">#{o.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{o.name}</span>
                  <span className="block truncate text-[13px] text-[#6e6e73]">
                    {o.variant} × {o.qty} · {o.phone} · {o.location === "dhaka" ? "ঢাকা" : "ঢাকার বাইরে"}
                  </span>
                </span>
                <span className="hidden text-right sm:block">
                  <span className="block text-[14px] font-medium tabular-nums">{taka(o.total)}</span>
                  <span className="block text-[12px] text-[#86868b]">{when(o.createdAt)}</span>
                </span>
                <StatusPill status={o.status} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderDetail({
  order,
  token,
  itemName,
  sender,
  onSaved,
  onClose,
}: {
  order: Order;
  token: string;
  itemName: string;
  sender: { name: string; address: string; phone: string; email: string };
  onSaved: (o: Order) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const isKnownCourier = !order.courier || COURIERS.includes(order.courier);
  const [courier, setCourier] = useState(isKnownCourier ? order.courier : "__other");
  const [courierOther, setCourierOther] = useState(isKnownCourier ? "" : order.courier);
  const [trackingNo, setTrackingNo] = useState(order.trackingNo);
  const [paid, setPaid] = useState(String(order.paid || ""));
  const [note, setNote] = useState(order.note);
  const [historyNote, setHistoryNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const courierValue = courier === "__other" ? courierOther.trim() : courier;
  const statusChanged = status !== order.status;

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await api<{ order: Order }>(token, {
        body: {
          action: "set_fulfillment",
          id: order.id,
          ...(statusChanged ? { status, historyNote } : {}),
          courier: courierValue,
          trackingNo,
          paid: Number(paid) || 0,
          note,
        },
      });
      setMsg({ ok: true, text: "সেভ হয়েছে।" });
      onSaved(res.order);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "সেভ করা গেল না।" });
    } finally {
      setBusy(false);
    }
  }

  const due = Math.max(0, order.total - (Number(paid) || 0));
  const telHref = `tel:${order.phone.replace(/[^\d+]/g, "")}`;

  return (
    <form onSubmit={save} className="h-fit rounded-[20px] bg-white p-5 lg:sticky lg:top-20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#86868b]">অর্ডার #{order.id} · {when(order.createdAt)}</p>
          <h2 className="mt-0.5 text-[21px] font-semibold tracking-tight">{order.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-full px-2 text-[20px] leading-none text-[#86868b] hover:bg-[#f5f5f7]" aria-label="বন্ধ">
          ×
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-[96px_1fr] gap-x-3 gap-y-1.5 text-[14px]">
        <dt className="text-[#6e6e73]">ফোন</dt>
        <dd>
          <a href={telHref} className="text-[#0071e3]">{order.phone}</a>
        </dd>
        <dt className="text-[#6e6e73]">ইমেইল</dt>
        <dd className="break-all">{order.email}</dd>
        <dt className="text-[#6e6e73]">ঠিকানা</dt>
        <dd>
          {order.address} <span className="text-[#86868b]">({order.location === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"})</span>
        </dd>
        <dt className="text-[#6e6e73]">এডিশন</dt>
        <dd>
          {order.variant} × {order.qty} · {taka(order.unitPrice)} করে
        </dd>
        <dt className="text-[#6e6e73]">ডেলিভারি</dt>
        <dd>{taka(order.delivery)}</dd>
        <dt className="font-medium">মোট (COD)</dt>
        <dd className="font-semibold">{taka(order.total)}</dd>
        <dt className="text-[#6e6e73]">ভাষা</dt>
        <dd>{order.lang === "bn" ? "বাংলা" : "English"}</dd>
      </dl>

      <div className="mt-5 space-y-3 border-t border-[#f0f0f2] pt-4">
        <label className="block">
          <span className="field-label">স্ট্যাটাস</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="field">
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)} ({STATUS_LABELS[s].en})
              </option>
            ))}
          </select>
        </label>
        {statusChanged && (
          <label className="block">
            <span className="field-label">এই পরিবর্তনের নোট (ঐচ্ছিক)</span>
            <input value={historyNote} onChange={(e) => setHistoryNote(e.target.value)} className="field" placeholder="যেমন: কাস্টমার ফোনে কনফার্ম করেছেন" />
          </label>
        )}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="field-label">কুরিয়ার</span>
            <select value={courier} onChange={(e) => setCourier(e.target.value)} className="field">
              <option value="">—</option>
              {COURIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__other">অন্য…</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">ট্র্যাকিং / কনসাইনমেন্ট নং</span>
            <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} className="field" />
          </label>
        </div>
        {courier === "__other" && (
          <label className="block">
            <span className="field-label">কুরিয়ারের নাম</span>
            <input value={courierOther} onChange={(e) => setCourierOther(e.target.value)} className="field" />
          </label>
        )}
        <label className="block">
          <span className="field-label">আদায় (৳) · বাকি {taka(due)}</span>
          <input inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ""))} className="field" placeholder="0" />
        </label>
        <label className="block">
          <span className="field-label">ভেতরের নোট</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="field" />
        </label>
        {(status === "cancelled" || status === "returned") && statusChanged && (
          <p className="rounded-xl bg-[#f5f5f7] p-3 text-[13px] text-[#424245]">সেভ করলে এই অর্ডারের {order.qty}টি ইউনিট স্টকে ফেরত যাবে।</p>
        )}
        {msg && <p className={`rounded-xl p-3 text-[14px] ${msg.ok ? "bg-[#e7f6ea] text-[#1d7a33]" : "bg-[#fff2f2] text-[#d70015]"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-[16px] disabled:opacity-50">
          {busy ? "সেভ হচ্ছে…" : "সেভ"}
        </button>
      </div>

      <div className="mt-5 border-t border-[#f0f0f2] pt-4">
        <p className="text-[13px] font-medium text-[#6e6e73]">ইনভয়েস ও লেবেল</p>
        <p className="mt-0.5 text-[12px] text-[#86868b]">নতুন ট্যাবে খুলে প্রিন্ট হবে (PDF হিসেবেও সেভ করা যায়)। আগে সেভ করে নিন, যাতে কুরিয়ার আর ট্র্যাকিং ওঠে।</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["a4", "A4 ইনভয়েস"],
              ["label", "বক্স লেবেল 100×150"],
            ] as const
          ).map(([k, t]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (!printInvoice(k, order, itemName, sender)) setMsg({ ok: false, text: "পপআপ ব্লক হয়েছে; এই সাইটের জন্য পপআপ চালু করুন।" });
              }}
              className="rounded-full border border-[#d2d2d7] px-3 py-1.5 text-[13px] hover:border-[#86868b]"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[#f0f0f2] pt-4">
        <p className="text-[13px] font-medium text-[#6e6e73]">ইতিহাস</p>
        <ol className="mt-2 space-y-2">
          {[...order.history].reverse().map((h, i) => (
            <li key={i} className="flex gap-3 text-[13px]">
              <span className="w-[108px] shrink-0 tabular-nums text-[#86868b]">{when(h.at)}</span>
              <span>
                <StatusPill status={h.status as OrderStatus} />
                {h.note && <span className="ml-2 text-[#424245]">{h.note}</span>}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] text-[#86868b]">শেষ পরিবর্তন {when(order.updatedAt)}</p>
      </div>
    </form>
  );
}

function StockPanel({ items, summary, token, onSaved }: { items: StockItem[]; summary: Summary | null; token: string; onSaved: () => void }) {
  return (
    <div className="mt-6 rounded-[20px] bg-white">
      <div className="grid grid-cols-[1fr_90px_90px_150px] gap-3 border-b border-[#f0f0f2] px-4 py-3 text-[13px] text-[#6e6e73] max-sm:grid-cols-[1fr_130px]">
        <span>ভ্যারিয়েন্ট</span>
        <span className="text-right max-sm:hidden">দাম</span>
        <span className="text-right max-sm:hidden">বিক্রি</span>
        <span className="text-right">স্টক</span>
      </div>
      <ul className="divide-y divide-[#f0f0f2]">
        {items.map((i) => (
          <StockRow key={i.variant + i.qty} item={i} sold={summary?.byVariant[i.variant]?.units ?? 0} token={token} onSaved={onSaved} />
        ))}
      </ul>
      <p className="border-t border-[#f0f0f2] px-4 py-3 text-[12px] text-[#86868b]">
        অর্ডার দিলে স্টক কমে; বাতিল বা ফেরত হলে আবার যোগ হয়। এখানে হাতে থাকা ইউনিটের সংখ্যা দিন।
      </p>
    </div>
  );
}

function StockRow({ item, sold, token, onSaved }: { item: StockItem; sold: number; token: string; onSaved: () => void }) {
  const [qty, setQty] = useState(String(item.qty));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const dirty = qty !== String(item.qty);

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
    <li className="grid grid-cols-[1fr_90px_90px_150px] items-center gap-3 px-4 py-3 max-sm:grid-cols-[1fr_130px]">
      <span>
        <span className="block text-[15px] font-medium">{item.nameBn}</span>
        <span className="block text-[12px] text-[#86868b]">
          {item.name} · {item.variant}
        </span>
        {err && <span className="block text-[12px] text-[#d70015]">{err}</span>}
      </span>
      <span className="text-right text-[14px] tabular-nums max-sm:hidden">{taka(item.price)}</span>
      <span className="text-right text-[14px] tabular-nums max-sm:hidden">{sold}</span>
      <span className="flex items-center justify-end gap-2">
        <input
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))}
          className={`field !mt-0 !w-[64px] !py-1.5 text-right tabular-nums ${item.qty === 0 && !dirty ? "!border-[#d70015]" : ""}`}
          aria-label={`${item.name} stock`}
        />
        <button
          onClick={save}
          disabled={!dirty || busy}
          className="rounded-full bg-[#0071e3] px-3 py-1.5 text-[13px] text-white disabled:bg-[#d2d2d7]"
        >
          {busy ? "…" : "সেভ"}
        </button>
      </span>
    </li>
  );
}
