"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/db/statuses";
import { api, COURIERS, taka, when, type Order } from "./lib";
import { printInvoice, orderRef, type Sender } from "./invoice";
import { Card, digits, Empty, Field, Icon, MsgBanner, PageHeader, PaymentBadge, StatusBadge, Thumb, type Msg } from "./ui";

/* ------------------------------------------------------------------ list */

type View = { key: string; label: string; match: (o: Order) => boolean };
const VIEWS: View[] = [
  { key: "all", label: "সব", match: () => true },
  { key: "new", label: "নতুন", match: (o) => o.status === "new" },
  { key: "unfulfilled", label: "প্রস্তুত হচ্ছে", match: (o) => o.status === "confirmed" || o.status === "packed" },
  { key: "shipping", label: "শিপিং-এ", match: (o) => o.status === "handed_to_courier" || o.status === "in_transit" },
  { key: "delivered", label: "ডেলিভারড", match: (o) => o.status === "delivered" },
  { key: "closed", label: "বাতিল / ফেরত", match: (o) => o.status === "cancelled" || o.status === "returned" },
];

export const variantSlug = (v: string) => (/collector/i.test(v) ? "plain" : v.toLowerCase());

export function OrdersPage({
  orders,
  query,
  setQuery,
  onOpen,
  onNew,
  onDeleteAll,
  itemName,
}: {
  orders: Order[];
  query: string;
  setQuery: (q: string) => void;
  onOpen: (id: number) => void;
  onNew: () => void;
  onDeleteAll: () => void;
  itemName: (variant: string) => string;
}) {
  const [view, setView] = useState("all");
  const counts = useMemo(() => Object.fromEntries(VIEWS.map((v) => [v.key, orders.filter(v.match).length])), [orders]);
  const shown = useMemo(() => {
    const m = VIEWS.find((v) => v.key === view)!.match;
    const needle = query.trim().toLowerCase().replace(/^#|^maya-0*/i, "");
    return orders.filter(
      (o) =>
        m(o) &&
        (!needle ||
          [o.name, o.phone, o.email, o.address, o.trackingNo, o.courier, String(o.id), o.variant].some((f) => (f ?? "").toLowerCase().includes(needle))),
    );
  }, [orders, view, query]);

  return (
    <>
      <PageHeader
        title="অর্ডার"
        sub={`${orders.length}টি অর্ডার · ${counts.new ?? 0}টি নতুন`}
        actions={
          <>
            {orders.length > 0 && (
              <button onClick={onDeleteAll} className="adm-btn text-[#b42318]">
                <Icon name="trash" className="h-4 w-4" /> সব মুছুন
              </button>
            )}
            <button onClick={onNew} className="adm-btn-primary">
              <Icon name="plus" className="h-4 w-4" /> অর্ডার তৈরি
            </button>
          </>
        }
      />
      <section className="adm-card overflow-hidden">
        <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-[#e1e3e5] px-2 pt-2">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`-mb-px whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px] font-medium ${
                view === v.key ? "border-[#303030] text-[#303030]" : "border-transparent text-[#616161] hover:text-[#303030]"
              }`}
            >
              {v.label}
              <span className="ml-1.5 rounded-full bg-[#f1f2f4] px-1.5 py-[1px] text-[11px] text-[#616161]">{counts[v.key]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-b border-[#e1e3e5] p-2">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="নাম, ফোন, অর্ডার নম্বর বা ট্র্যাকিং দিয়ে খুঁজুন"
              className="adm-input !pl-8"
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <Empty
            icon="orders"
            title={orders.length ? "কিছু পাওয়া যায়নি" : "এখনো কোনো অর্ডার নেই"}
            text={orders.length ? "অন্য ট্যাব বা অন্য শব্দ দিয়ে খুঁজে দেখুন।" : "ওয়েবসাইট থেকে অর্ডার এলে এখানে দেখাবে। ফোনে আসা অর্ডার নিজে যোগ করতে পারেন।"}
            action={!orders.length && <button onClick={onNew} className="adm-btn-primary">অর্ডার তৈরি</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr>
                  <th className="adm-th">অর্ডার</th>
                  <th className="adm-th">তারিখ</th>
                  <th className="adm-th">কাস্টমার</th>
                  <th className="adm-th">পণ্য</th>
                  <th className="adm-th text-right">মোট</th>
                  <th className="adm-th">পেমেন্ট</th>
                  <th className="adm-th">ফুলফিলমেন্ট</th>
                  <th className="adm-th">কুরিয়ার</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.id} onClick={() => onOpen(o.id)} className="cursor-pointer hover:bg-[#f7f7f8]">
                    <td className="adm-td whitespace-nowrap font-semibold text-[#303030]">
                      #{o.id}
                      {o.status === "new" && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-[#2b3fa8] align-middle" />}
                    </td>
                    <td className="adm-td whitespace-nowrap text-[#616161]">{when(o.createdAt)}</td>
                    <td className="adm-td">
                      <span className="block max-w-[180px] truncate font-medium">{o.name}</span>
                      <span className="block text-[12px] text-[#616161]">
                        {o.phone} · {o.location === "dhaka" ? "ঢাকা" : "ঢাকার বাইরে"}
                      </span>
                    </td>
                    <td className="adm-td">
                      <span className="flex items-center gap-2">
                        <Thumb slug={variantSlug(o.variant)} size={30} />
                        <span className="max-w-[170px] truncate">
                          {itemName(o.variant)} <span className="text-[#616161]">× {o.qty}</span>
                        </span>
                      </span>
                    </td>
                    <td className="adm-td text-right font-medium tabular-nums">{taka(o.total)}</td>
                    <td className="adm-td">
                      <PaymentBadge total={o.total} paid={o.paid} />
                    </td>
                    <td className="adm-td">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="adm-td text-[#616161]">
                      {o.courier ? (
                        <span className="block">
                          {o.courier}
                          {o.trackingNo && <span className="block font-mono text-[11.5px]">{o.trackingNo}</span>}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ detail drawer */

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "confirmed",
  confirmed: "packed",
  packed: "handed_to_courier",
  handed_to_courier: "in_transit",
  in_transit: "delivered",
};

export function OrderDrawer({
  order,
  token,
  itemName,
  sender,
  onSaved,
  onDeleted,
  onClose,
}: {
  order: Order;
  token: string;
  itemName: string;
  sender: Sender;
  onSaved: (o: Order) => void;
  onDeleted: (text: string) => void;
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
  const [msg, setMsg] = useState<Msg>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const courierValue = courier === "__other" ? courierOther.trim() : courier;
  const statusChanged = status !== order.status;
  const due = Math.max(0, order.total - (Number(paid) || 0));
  const telHref = `tel:${order.phone.replace(/[^\d+]/g, "")}`;
  const next = NEXT[order.status];

  async function save(e?: FormEvent, override?: OrderStatus) {
    e?.preventDefault();
    const s = override ?? status;
    setBusy(true);
    setMsg(null);
    try {
      const res = await api<{ order: Order }>(token, {
        body: {
          action: "set_fulfillment",
          id: order.id,
          ...(s !== order.status ? { status: s, historyNote } : {}),
          courier: courierValue,
          trackingNo,
          paid: Number(paid) || 0,
          note,
        },
      });
      setStatus(res.order.status);
      setHistoryNote("");
      setMsg({ ok: true, text: "সেভ হয়েছে।" });
      onSaved(res.order);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "সেভ করা গেল না।" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const holds = order.status !== "cancelled" && order.status !== "returned";
    if (!window.confirm(`অর্ডার #${order.id} (${order.name}) স্থায়ীভাবে মুছে ফেলবেন?${holds ? ` এর ${order.qty}টি ইউনিট স্টকে ফেরত যাবে।` : ""}`)) return;
    try {
      await api(token, { body: { action: "delete_order", id: order.id } });
      onDeleted(`অর্ডার #${order.id} মুছে ফেলা হয়েছে।`);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "মোছা গেল না।" });
    }
  }

  const print = (k: "a4" | "label") => {
    if (!printInvoice(k, order, itemName, sender)) setMsg({ ok: false, text: "পপআপ ব্লক হয়েছে; এই সাইটের জন্য পপআপ চালু করুন।" });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form onSubmit={save} className="relative flex h-full w-full max-w-[760px] flex-col bg-[#f1f2f4] shadow-2xl">
        {/* header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e1e3e5] bg-white px-4 py-3">
          <button type="button" onClick={onClose} className="rounded-md p-1 text-[#616161] hover:bg-[#f1f2f4]" aria-label="বন্ধ">
            <Icon name="close" className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center gap-2 text-[17px] font-bold text-[#303030]">
              #{order.id} <span className="text-[12.5px] font-normal text-[#616161]">{orderRef(order.id)}</span>
              <PaymentBadge total={order.total} paid={order.paid} />
              <StatusBadge status={order.status} />
            </h2>
            <p className="text-[12.5px] text-[#616161]">{when(order.createdAt)} · ওয়েবসাইট · {order.lang === "bn" ? "বাংলা" : "English"}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <button type="button" onClick={() => print("a4")} className="adm-btn">
              <Icon name="printer" className="h-4 w-4" /> ইনভয়েস
            </button>
            <button type="button" onClick={() => print("label")} className="adm-btn">
              <Icon name="truck" className="h-4 w-4" /> লেবেল
            </button>
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div className="min-w-0 space-y-4">
              <Card title={<span className="flex items-center gap-2"><StatusBadge status={order.status} /> পণ্য</span>} pad={false}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Thumb slug={variantSlug(order.variant)} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{itemName}</p>
                    <p className="text-[12.5px] text-[#616161]">
                      {order.variant}
                      {order.units && order.units.length > 0 && <span className="font-mono"> · {order.units.join(", ")}</span>}
                    </p>
                  </div>
                  <p className="whitespace-nowrap tabular-nums text-[#616161]">
                    {taka(order.unitPrice)} × {order.qty}
                  </p>
                  <p className="w-20 text-right font-medium tabular-nums">{taka(order.unitPrice * order.qty)}</p>
                </div>
                {next && (
                  <div className="flex justify-end border-t border-[#ebebeb] px-4 py-3">
                    <button type="button" disabled={busy} onClick={() => save(undefined, next)} className="adm-btn-primary">
                      <Icon name="check" className="h-4 w-4" /> {STATUS_LABELS[next].bn} হিসেবে চিহ্নিত করুন
                    </button>
                  </div>
                )}
              </Card>

              <Card title={<span className="flex items-center gap-2"><PaymentBadge total={order.total} paid={Number(paid) || 0} /> পেমেন্ট</span>}>
                <dl className="space-y-1.5 text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-[#616161]">সাবটোটাল · {order.qty}টি পণ্য</dt>
                    <dd className="tabular-nums">{taka(order.unitPrice * order.qty)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#616161]">ডেলিভারি · {order.location === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}</dt>
                    <dd className="tabular-nums">{taka(order.delivery)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-[#ebebeb] pt-1.5 font-semibold">
                    <dt>মোট</dt>
                    <dd className="tabular-nums">{taka(order.total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#616161]">আদায় হয়েছে</dt>
                    <dd className="tabular-nums">{taka(Number(paid) || 0)}</dd>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <dt>বাকি (COD)</dt>
                    <dd className="tabular-nums">{taka(due)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex items-end gap-2">
                  <Field label="আদায় (৳)" className="flex-1">
                    <input inputMode="numeric" value={paid} onChange={(e) => setPaid(digits(e.target.value))} className="adm-input tabular-nums" placeholder="0" />
                  </Field>
                  <button type="button" onClick={() => setPaid(String(order.total))} className="adm-btn">
                    পুরো টাকা
                  </button>
                </div>
              </Card>

              <Card title="ফুলফিলমেন্ট ও কুরিয়ার">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="স্ট্যাটাস">
                    <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="adm-input">
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s].bn} ({STATUS_LABELS[s].en})
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="কুরিয়ার">
                    <select value={courier} onChange={(e) => setCourier(e.target.value)} className="adm-input">
                      <option value="">—</option>
                      {COURIERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__other">অন্য…</option>
                    </select>
                  </Field>
                  {courier === "__other" && (
                    <Field label="কুরিয়ারের নাম">
                      <input value={courierOther} onChange={(e) => setCourierOther(e.target.value)} className="adm-input" />
                    </Field>
                  )}
                  <Field label="ট্র্যাকিং / কনসাইনমেন্ট নং">
                    <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} className="adm-input font-mono" />
                  </Field>
                  {statusChanged && (
                    <Field label="এই পরিবর্তনের নোট (ঐচ্ছিক)" className="sm:col-span-2">
                      <input value={historyNote} onChange={(e) => setHistoryNote(e.target.value)} className="adm-input" placeholder="যেমন: কাস্টমার ফোনে কনফার্ম করেছেন" />
                    </Field>
                  )}
                </div>
                {(status === "cancelled" || status === "returned") && statusChanged && (
                  <p className="mt-3 text-[12.5px] text-[#8a4a00]">সেভ করলে এই অর্ডারের {order.qty}টি ইউনিট স্টকে ফেরত যাবে।</p>
                )}
              </Card>

              <Card title="টাইমলাইন">
                <ol className="relative ml-1.5 space-y-3 border-l border-[#d4d4d4] pl-4">
                  {[...order.history].reverse().map((h, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[21.5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${i === 0 ? "bg-[#303030]" : "bg-[#b5b5b5]"}`} />
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={h.status as OrderStatus} />
                        <span className="text-[12px] text-[#616161]">{when(h.at)}</span>
                      </div>
                      {h.note && <p className="mt-0.5 text-[12.5px] text-[#303030]">{h.note}</p>}
                    </li>
                  ))}
                </ol>
              </Card>
            </div>

            <div className="min-w-0 space-y-4">
              <Card title="কাস্টমার">
                <p className="flex items-center gap-2 font-medium">
                  <Icon name="user" className="h-4 w-4 text-[#616161]" /> {order.name}
                </p>
                <p className="mt-3 text-[12px] font-semibold text-[#303030]">যোগাযোগ</p>
                <a href={telHref} className="mt-1 flex items-center gap-2 text-[#2c6ecb] hover:underline">
                  <Icon name="phone" className="h-4 w-4" /> {order.phone}
                </a>
                {order.email && (
                  <a href={`mailto:${order.email}`} className="mt-1 flex items-center gap-2 break-all text-[#2c6ecb] hover:underline">
                    <Icon name="mail" className="h-4 w-4 shrink-0" /> {order.email}
                  </a>
                )}
                <p className="mt-3 text-[12px] font-semibold text-[#303030]">ডেলিভারির ঠিকানা</p>
                <p className="mt-1 flex gap-2 text-[13px]">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#616161]" />
                  <span>
                    {order.address || "—"}
                    <span className="block text-[12px] text-[#616161]">{order.location === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}</span>
                  </span>
                </p>
              </Card>
              <Card title="ভেতরের নোট" sub="কাস্টমার দেখতে পায় না">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="adm-input" placeholder="নোট লিখুন…" />
              </Card>
              <button type="button" onClick={remove} className="adm-btn w-full text-[#b42318]">
                <Icon name="trash" className="h-4 w-4" /> অর্ডার মুছুন
              </button>
            </div>
          </div>
        </div>

        {/* save bar */}
        <div className="flex items-center gap-3 border-t border-[#e1e3e5] bg-white px-4 py-3">
          <div className="min-w-0 flex-1">
            <MsgBanner msg={msg} />
            {!msg && <p className="text-[12px] text-[#616161]">শেষ পরিবর্তন {when(order.updatedAt)}</p>}
          </div>
          <button type="button" onClick={onClose} className="adm-btn">
            বন্ধ
          </button>
          <button type="submit" disabled={busy} className="adm-btn-primary">
            {busy ? "সেভ হচ্ছে…" : "সেভ"}
          </button>
        </div>
      </form>
    </div>
  );
}

