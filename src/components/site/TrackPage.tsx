"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import HtmlLang from "./HtmlLang";
import { LangProvider } from "./i18n";
import { pathFor } from "./paths";
import { STATUS_LABELS, type OrderStatus } from "@/db/statuses";

type PublicOrder = {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  timeline: { status: string; at: string }[];
  courier: string;
  trackingNo: string;
  item: { en: string; bn: string };
  qty: number;
  total: number;
  due: number;
  name: string;
  phone: string;
  area: string;
  zone: "dhaka" | "outside";
};

const T = {
  bn: {
    title: "অর্ডার ট্র্যাক করুন",
    intro: "অর্ডার নম্বর (যেমন MAYA-0012) অথবা অর্ডারের সময় দেওয়া ফোন নম্বর লিখুন।",
    label: "অর্ডার নম্বর বা ফোন নম্বর",
    ph: "MAYA-0012 বা 01XXXXXXXXX",
    go: "খুঁজুন",
    busy: "খুঁজছে…",
    none: "এই তথ্যে কোনো অর্ডার পাওয়া যায়নি। নম্বরটা আবার দেখে নিন।",
    bad: "ঠিকমতো একটা অর্ডার নম্বর বা ১০–১৫ অঙ্কের ফোন নম্বর লিখুন।",
    limited: "অনেকবার খোঁজা হয়েছে। ১০ মিনিট পরে আবার চেষ্টা করুন।",
    error: "এখন খোঁজা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।",
    placed: "অর্ডারের তারিখ",
    courier: "কুরিয়ার",
    tracking: "ট্র্যাকিং নম্বর",
    pending: "এখনো ঠিক হয়নি",
    total: "মোট",
    due: "ডেলিভারিতে দিতে হবে",
    to: "যার কাছে যাবে",
    privacy: "আপনার গোপনীয়তার জন্য নাম, ফোন আর ঠিকানার বেশিরভাগ অংশ লুকানো থাকে।",
    help: "কোনো প্রশ্ন থাকলে",
    zone: { dhaka: "ঢাকার ভেতরে", outside: "ঢাকার বাইরে" },
    closed: { returned: "অর্ডারটি ফেরত এসেছে।", cancelled: "অর্ডারটি বাতিল হয়েছে।" },
  },
  en: {
    title: "Track your order",
    intro: "Type your order number (like MAYA-0012) or the phone number you ordered with.",
    label: "Order number or phone number",
    ph: "MAYA-0012 or 01XXXXXXXXX",
    go: "Find",
    busy: "Searching…",
    none: "No order found for that. Please check the number.",
    bad: "Type an order number or a phone number with 10–15 digits.",
    limited: "Too many searches. Please try again in 10 minutes.",
    error: "Tracking is not available right now. Please try again shortly.",
    placed: "Ordered on",
    courier: "Courier",
    tracking: "Tracking no.",
    pending: "Not assigned yet",
    total: "Total",
    due: "To pay on delivery",
    to: "Deliver to",
    privacy: "For your privacy, most of the name, phone and address is hidden.",
    help: "Questions?",
    zone: { dhaka: "Inside Dhaka", outside: "Outside Dhaka" },
    closed: { returned: "This order was returned.", cancelled: "This order was cancelled." },
  },
} as const;

/** The happy path shown as steps; returned/cancelled end it early. */
const STEPS: OrderStatus[] = ["new", "confirmed", "packed", "handed_to_courier", "in_transit", "delivered"];

const taka = (n: number, bn: boolean) => {
  const s = n.toLocaleString("en-IN");
  return "৳" + (bn ? s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : s);
};
const date = (iso: string, bn: boolean) =>
  new Date(iso).toLocaleDateString(bn ? "bn-BD" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" });
const dateTime = (iso: string, bn: boolean) =>
  new Date(iso).toLocaleString(bn ? "bn-BD" : "en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Dhaka" });

export default function TrackPage({ lang }: { lang: "bn" | "en" }) {
  const t = T[lang];
  const bn = lang === "bn";
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<PublicOrder[] | null>(null);

  async function find(value: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: value }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error(t.limited);
      if (res.status === 400) throw new Error(t.bad);
      if (!res.ok || !body.ok) throw new Error(t.error);
      setOrders(body.orders);
      if (!body.orders.length) setError(t.none);
    } catch (err) {
      setOrders(null);
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  // /track?order=MAYA-0012 (link from the order confirmation) searches right away
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("order");
    if (ref && /^MAYA-\d{1,6}$/i.test(ref)) {
      const id = setTimeout(() => {
        setQ(ref);
        find(ref);
      }, 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) find(q.trim());
  }

  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} />
      <Nav home={false} />
      <main className="min-h-[70vh] bg-[#f5f5f7] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-center text-[34px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[44px]">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-[520px] text-center text-[17px] text-[#6e6e73]">{t.intro}</p>

          <form onSubmit={submit} className="mt-8 rounded-[28px] bg-white p-5 sm:p-7">
            <label className="block">
              <span className="field-label">{t.label}</span>
              <div className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.ph}
                  inputMode="text"
                  autoComplete="off"
                  maxLength={40}
                  className="field flex-1"
                />
                <button type="submit" disabled={busy || !q.trim()} className="btn-primary mt-1.5 shrink-0 px-6 disabled:opacity-50">
                  {busy ? t.busy : t.go}
                </button>
              </div>
            </label>
            {error && <p className="mt-4 rounded-xl bg-[#fff2f2] p-3 text-[14px] text-[#d70015]">{error}</p>}
          </form>

          {orders?.map((o) => <OrderCard key={o.ref} o={o} lang={lang} />)}

          {orders && orders.length > 0 && <p className="mt-4 text-center text-[12px] text-[#86868b]">{t.privacy}</p>}
          <p className="mt-8 text-center text-[14px] text-[#6e6e73]">
            {t.help}{" "}
            <Link href={`${pathFor(lang, "docs")}#help`} className="text-[#0071e3]">
              {bn ? "সাহায্য" : "Help"}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </LangProvider>
  );
}

function OrderCard({ o, lang }: { o: PublicOrder; lang: "bn" | "en" }) {
  const t = T[lang];
  const bn = lang === "bn";
  const closed = o.status === "returned" || o.status === "cancelled";
  const reached = (s: OrderStatus) => o.timeline.some((h) => h.status === s) || STEPS.indexOf(s) <= STEPS.indexOf(o.status);
  const when = (s: OrderStatus) => [...o.timeline].reverse().find((h) => h.status === s)?.at;

  return (
    <section className="mt-5 rounded-[28px] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#86868b]">
            {t.placed} {date(o.createdAt, bn)}
          </p>
          <h2 className="mt-0.5 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">{o.ref}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[13px] font-medium ${
            o.status === "delivered" ? "bg-[#e7f6ea] text-[#1d7a33]" : closed ? "bg-[#efeff1] text-[#6e6e73]" : "bg-[#e8f1fd] text-[#0058b0]"
          }`}
        >
          {STATUS_LABELS[o.status][lang]}
        </span>
      </div>

      {closed ? (
        <p className="mt-5 rounded-2xl bg-[#f5f5f7] p-4 text-[15px] text-[#424245]">{t.closed[o.status as "returned" | "cancelled"]}</p>
      ) : (
        <ol className="mt-6 space-y-0">
          {STEPS.map((s, i) => {
            const done = reached(s);
            const current = s === o.status;
            const at = when(s);
            return (
              <li key={s} className="relative flex gap-4 pb-5 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-[2px] ${reached(STEPS[i + 1]) ? "bg-[#0071e3]" : "bg-[#e5e5ea]"}`} />
                )}
                <span
                  className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    done ? "bg-[#0071e3] text-white" : "border-2 border-[#d2d2d7] bg-white"
                  } ${current ? "ring-4 ring-[#0071e3]/20" : ""}`}
                >
                  {done && (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <p className={`text-[16px] ${done ? "font-medium text-[#1d1d1f]" : "text-[#86868b]"}`}>{STATUS_LABELS[s][lang]}</p>
                  {at && <p className="text-[13px] text-[#86868b]">{dateTime(at, bn)}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-[#f0f0f2] pt-5 text-[15px] sm:grid-cols-2">
        <div>
          <dt className="text-[13px] text-[#86868b]">{bn ? "এডিশন" : "Edition"}</dt>
          <dd className="text-[#1d1d1f]">
            {o.item[lang]} × {bn ? String(o.qty).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : o.qty}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#86868b]">{t.total}</dt>
          <dd className="text-[#1d1d1f]">
            {taka(o.total, bn)}
            {o.due > 0 && o.status !== "delivered" && !closed && (
              <span className="text-[13px] text-[#6e6e73]">
                {" "}
                · {t.due} {taka(o.due, bn)}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#86868b]">{t.courier}</dt>
          <dd className="text-[#1d1d1f]">{o.courier || t.pending}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#86868b]">{t.tracking}</dt>
          <dd className="font-mono text-[#1d1d1f]">{o.trackingNo || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[13px] text-[#86868b]">{t.to}</dt>
          <dd className="text-[#1d1d1f]">
            {o.name} · {o.phone} · {o.area} <span className="text-[#86868b]">({t.zone[o.zone]})</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
