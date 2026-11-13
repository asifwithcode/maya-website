"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { api, AuthError, clearToken, POLL_MS, readToken, saveToken, when, type Order, type SiteData, type StockItem, type Summary } from "./lib";
import { DeleteAllDialog, HomePage, InventoryPage, NewOrderDialog, PricingPage, ProductsPage, SettingsPage, StorePage } from "./panels";
import { OrderDrawer, OrdersPage } from "./orders";
import { Banner, Icon, type IconName } from "./ui";

/* ------------------------------------------------------------------ app */

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null); // null = still reading storage
  useEffect(() => {
    const t = setTimeout(() => setToken(readToken()), 0); // storage exists only in the browser
    return () => clearTimeout(t);
  }, []);

  if (token === null) return <div className="adm" />;
  if (!token) return <Login onToken={setToken} />;
  return (
    <Console
      token={token}
      onLogout={() => {
        clearToken();
        setToken("");
      }}
    />
  );
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${dark ? "bg-white text-[#1a1a1a]" : "bg-[#1a1a1a] text-white"}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <circle cx="8.5" cy="12" r="2.6" />
          <circle cx="15.5" cy="12" r="2.6" />
        </svg>
      </span>
      <span className={`text-[15px] font-semibold tracking-tight ${dark ? "text-white" : "text-[#303030]"}`}>Maya</span>
    </span>
  );
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
    <div className="adm flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e3e8ff,transparent_55%)] px-4">
      <form onSubmit={submit} className="adm-card w-full max-w-[400px] p-7">
        <Logo />
        <h1 className="mt-6 text-[22px] font-bold text-[#303030]">লগইন</h1>
        <p className="mt-1 text-[13px] text-[#616161]">Maya স্টোর অ্যাডমিনে যেতে admin token দিন।</p>
        <label className="mt-5 block">
          <span className="adm-label">Admin token</span>
          <input type="password" autoComplete="current-password" value={value} onChange={(e) => setValue(e.target.value)} className="adm-input !py-2" autoFocus />
        </label>
        <label className="mt-3 flex items-center gap-2 text-[13px] text-[#303030]">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          এই ডিভাইসে মনে রাখুন
        </label>
        {error && (
          <div className="mt-4">
            <Banner tone="critical">{error}</Banner>
          </div>
        )}
        <button type="submit" disabled={busy || !value.trim()} className="adm-btn-primary mt-5 w-full !py-2.5 !text-[14px]">
          {busy ? "যাচাই হচ্ছে…" : "চালিয়ে যান"}
        </button>
        <p className="mt-5 text-center text-[12px] text-[#8a8a8a]">Xentoryx Labs · themaya.site</p>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ console */

type Page = "home" | "orders" | "products" | "inventory" | "pricing" | "store" | "settings";
const NAV: { page: Page; label: string; icon: IconName }[] = [
  { page: "home", label: "হোম", icon: "home" },
  { page: "orders", label: "অর্ডার", icon: "orders" },
  { page: "products", label: "পণ্য", icon: "products" },
  { page: "inventory", label: "ইনভেন্টরি", icon: "inventory" },
  { page: "pricing", label: "দাম ও শিপিং", icon: "pricing" },
];

function Console({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [page, setPage] = useState<Page>("home");
  const [navOpen, setNavOpen] = useState(false);
  const [site, setSite] = useState<SiteData | null>(null);
  const [adding, setAdding] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [notice, setNotice] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loadedAt, setLoadedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  const go = (p: Page) => {
    setPage(p);
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };
  const onOrderSaved = (o: Order) => {
    setOrders((list) => list.map((x) => (x.id === o.id ? o : x)));
    load(); // totals and stock follow status changes
  };
  const afterSiteSave = () => {
    loadSite();
    load(); // prices and names feed stock and new orders
  };
  const itemName = (variant: string) => {
    const s = stock.find((x) => x.variant === variant);
    return s ? (/collector/i.test(variant) ? s.name : `Maya · ${s.name}`) : `Maya · ${variant}`;
  };
  const company = site?.copy.company;
  const sender = {
    name: company?.brandName || "Xentoryx Labs",
    address: company?.address || "Chittagong, Bangladesh",
    phone: company?.phone || "",
    email: company?.email || "",
  };
  const sel = orders.find((o) => o.id === selected) ?? null;
  const newCount = summary?.byStatus.new ?? 0;
  const lowCount = stock.filter((s) => s.qty === 0).length;

  const navItem = (p: Page, label: string, icon: IconName, badge?: ReactNode) => (
    <button
      key={p}
      onClick={() => go(p)}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] font-medium transition ${
        page === p ? "bg-white text-[#303030] shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "text-[#4a4a4a] hover:bg-[#e3e3e3]"
      }`}
    >
      <Icon name={icon} className={`h-[18px] w-[18px] ${page === p ? "text-[#303030]" : "text-[#616161]"}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge}
    </button>
  );

  const sidebar = (
    <nav className="flex h-full flex-col gap-0.5 p-3">
      {NAV.map((n) =>
        navItem(
          n.page,
          n.label,
          n.icon,
          n.page === "orders" && newCount > 0 ? (
            <span className="rounded-full bg-[#303030] px-1.5 py-[1px] text-[11px] font-semibold text-white">{newCount}</span>
          ) : n.page === "inventory" && lowCount > 0 ? (
            <span className="rounded-full bg-[#fedad9] px-1.5 py-[1px] text-[11px] font-semibold text-[#8e1f0b]">{lowCount}</span>
          ) : undefined,
        ),
      )}
      <p className="mb-1 mt-4 px-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#8a8a8a]">সেলস চ্যানেল</p>
      {navItem("store", "অনলাইন স্টোর", "store")}
      <a href="/" target="_blank" rel="noreferrer" className="ml-8 flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12.5px] text-[#616161] hover:bg-[#e3e3e3]">
        themaya.site <Icon name="external" className="h-3.5 w-3.5" />
      </a>
      <div className="mt-auto pt-4">{navItem("settings", "সেটিংস", "settings")}</div>
    </nav>
  );

  return (
    <div className="adm">
      {/* top bar */}
      <header className="sticky top-0 z-40 flex h-[56px] items-center gap-3 bg-[#1a1a1a] px-3 text-white">
        <button onClick={() => setNavOpen(true)} className="rounded-md p-1.5 hover:bg-white/10 lg:hidden" aria-label="মেনু">
          <Icon name="menu" />
        </button>
        <button onClick={() => go("home")} className="lg:w-[216px]">
          <Logo dark />
        </button>
        <div className="relative mx-auto hidden w-full max-w-[560px] sm:block">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b5b5b5]" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (page !== "orders") setPage("orders");
            }}
            placeholder="অর্ডার খুঁজুন: নাম, ফোন, #নম্বর, ট্র্যাকিং"
            className="w-full rounded-lg border border-[#4a4a4a] bg-[#303030] py-[7px] pl-9 pr-3 text-[13px] text-white placeholder:text-[#a8a8a8] focus:border-[#8a8a8a] focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <span className="hidden text-[11.5px] text-[#a8a8a8] xl:inline">{loadedAt && `আপডেট ${when(loadedAt)}`}</span>
          <button
            onClick={() => {
              load();
              loadSite();
            }}
            className="rounded-md p-1.5 hover:bg-white/10"
            aria-label="রিফ্রেশ"
            title="রিফ্রেশ"
          >
            <Icon name="refresh" className={`h-[18px] w-[18px] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-[6px] text-[13px] font-medium text-[#1a1a1a] hover:bg-[#e3e3e3]">
            <Icon name="plus" className="h-4 w-4" />
            <span className="hidden sm:inline">অর্ডার</span>
          </button>
          <button onClick={() => go("settings")} className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#36fba1] text-[12px] font-bold text-[#1a1a1a]" title="সেটিংস">
            XL
          </button>
        </div>
      </header>

      <div className="flex">
        {/* sidebar (desktop) */}
        <aside className="sticky top-[56px] hidden h-[calc(100vh-56px)] w-[240px] shrink-0 border-r border-[#e1e3e5] bg-[#ebebeb] lg:block">{sidebar}</aside>

        {/* sidebar (mobile drawer) */}
        {navOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setNavOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-[260px] bg-[#ebebeb] shadow-2xl">
              <div className="flex h-[56px] items-center justify-between bg-[#1a1a1a] px-3">
                <Logo dark />
                <button onClick={() => setNavOpen(false)} className="rounded-md p-1.5 text-white hover:bg-white/10" aria-label="বন্ধ">
                  <Icon name="close" />
                </button>
              </div>
              <div className="h-[calc(100%-56px)]">{sidebar}</div>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1140px]">
            {/* search on phones */}
            <div className="relative mb-4 sm:hidden">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (page !== "orders") setPage("orders");
                }}
                placeholder="অর্ডার খুঁজুন"
                className="adm-input !pl-9"
              />
            </div>

            {(error || notice) && (
              <div className="mb-4 space-y-2">
                {error && <Banner tone="critical">{error}</Banner>}
                {notice && (
                  <Banner tone="success" onClose={() => setNotice("")}>
                    {notice}
                  </Banner>
                )}
              </div>
            )}

            {page === "home" &&
              (summary ? (
                <HomePage
                  orders={orders}
                  summary={summary}
                  stock={stock}
                  onOpenOrder={(id) => setSelected(id)}
                  go={(p) => go(p)}
                />
              ) : (
                <Skeleton />
              ))}
            {page === "orders" && (
              <OrdersPage
                orders={orders}
                query={query}
                setQuery={setQuery}
                onOpen={setSelected}
                onNew={() => setAdding(true)}
                onDeleteAll={() => setWiping(true)}
                itemName={itemName}
              />
            )}
            {page === "inventory" && <InventoryPage items={stock} summary={summary} token={token} onSaved={load} />}
            {(page === "products" || page === "pricing" || page === "store" || page === "settings") && !site && <Skeleton />}
            {page === "products" && site && <ProductsPage site={site} stock={stock} token={token} onSaved={afterSiteSave} />}
            {page === "pricing" && site && <PricingPage site={site} token={token} onSaved={afterSiteSave} />}
            {page === "store" && site && <StorePage site={site} token={token} onSaved={afterSiteSave} />}
            {page === "settings" && site && (
              <SettingsPage site={site} token={token} orders={orders} onSaved={afterSiteSave} onDeleteAll={() => setWiping(true)} onLogout={onLogout} />
            )}
          </div>
        </main>
      </div>

      {sel && (
        <OrderDrawer
          key={sel.id}
          order={sel}
          token={token}
          itemName={itemName(sel.variant)}
          sender={sender}
          onSaved={onOrderSaved}
          onDeleted={(text) => {
            setSelected(null);
            setNotice(text);
            load();
          }}
          onClose={() => setSelected(null)}
        />
      )}
      {wiping && (
        <DeleteAllDialog
          orders={orders}
          token={token}
          onClose={() => setWiping(false)}
          onDone={(text) => {
            setWiping(false);
            setSelected(null);
            setNotice(text);
            load();
          }}
        />
      )}
      {adding && (
        <NewOrderDialog
          stock={stock}
          site={site}
          token={token}
          onClose={() => setAdding(false)}
          onCreated={(o) => {
            setAdding(false);
            go("orders");
            setSelected(o.id);
            load();
          }}
        />
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-48 rounded bg-[#e3e3e3]" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-[#e3e3e3]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[#e3e3e3]" />
    </div>
  );
}
