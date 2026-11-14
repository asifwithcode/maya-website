"use client";

import { useState, type ReactNode } from "react";
import { STATUS_LABELS, type OrderStatus } from "@/db/statuses";

/* ------------------------------------------------------------------ icons (24×24 line set) */

const PATHS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  orders: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  products: "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01",
  inventory: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  pricing: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  store: "M3 9 4.5 4h15L21 9M3 9v11h18V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  refresh: "M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6 6 18M6 6l12 12",
  printer: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  chevronRight: "m9 18 6-6-6-6",
  alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  pin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  cash: "M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 12h.01M18 12h.01",
  chart: "M3 3v18h18M7 15l4-4 3 3 6-6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  check: "M20 6 9 17l-5-5",
  box: "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12",
  key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
} as const;
export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "h-[18px] w-[18px]" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ badges */

type Tone = "neutral" | "info" | "success" | "warning" | "critical" | "attention" | "new";
const TONES: Record<Tone, string> = {
  neutral: "bg-[#e4e5e7] text-[#4a4a4a]",
  info: "bg-[#e0f0ff] text-[#00527c]",
  success: "bg-[#cdfee1] text-[#0c5132]",
  warning: "bg-[#fff1e3] text-[#8a4a00]",
  attention: "bg-[#ffef9d] text-[#4f4700]",
  critical: "bg-[#fedad9] text-[#8e1f0b]",
  new: "bg-[#e3e8ff] text-[#2b3fa8]",
};
const DOT: Record<Tone, string> = {
  neutral: "border-[#8a8a8a]",
  info: "bg-[#0094d5] border-[#0094d5]",
  success: "bg-[#0c5132] border-[#0c5132]",
  warning: "border-[#8a4a00]",
  attention: "border-[#4f4700]",
  critical: "bg-[#8e1f0b] border-[#8e1f0b]",
  new: "bg-[#2b3fa8] border-[#2b3fa8]",
};

export function Badge({ tone = "neutral", children, dot = true }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-[2px] text-[12px] font-medium ${TONES[tone]}`}>
      {dot && <span className={`h-[7px] w-[7px] rounded-full border-[1.5px] ${DOT[tone]}`} />}
      {children}
    </span>
  );
}

export const STATUS_BADGE: Record<OrderStatus, Tone> = {
  new: "new",
  confirmed: "info",
  packed: "attention",
  handed_to_courier: "warning",
  in_transit: "warning",
  delivered: "success",
  returned: "critical",
  cancelled: "neutral",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={STATUS_BADGE[status] ?? "neutral"}>{STATUS_LABELS[status]?.bn ?? status}</Badge>;
}

export function PaymentBadge({ total, paid }: { total: number; paid: number }) {
  if (total > 0 && paid >= total) return <Badge tone="success">পরিশোধিত</Badge>;
  if (paid > 0) return <Badge tone="attention">আংশিক</Badge>;
  return <Badge tone="warning">বাকি (COD)</Badge>;
}

/* ------------------------------------------------------------------ layout bits */

export function Card({
  title,
  sub,
  right,
  children,
  pad = true,
  className = "",
}: {
  title?: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  pad?: boolean;
  className?: string;
}) {
  return (
    <section className={`adm-card min-w-0 ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-3 px-4 pt-4">
          <div className="min-w-0">
            {title && <h2 className="text-[14px] font-semibold text-[#303030]">{title}</h2>}
            {sub && <p className="mt-0.5 text-[12.5px] text-[#616161]">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={pad ? "p-4" : title || right ? "pt-3" : ""}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, sub, actions, back }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; back?: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {back && (
          <button onClick={back} className="rounded-md p-1 text-[#616161] hover:bg-[#e3e3e3]" aria-label="ফিরে যান">
            <Icon name="chevronRight" className="h-5 w-5 rotate-180" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold tracking-[-0.01em] text-[#303030]">{title}</h1>
          {sub && <p className="mt-0.5 text-[13px] text-[#616161]">{sub}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, children, className = "" }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="adm-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-[#616161]">{hint}</span>}
    </label>
  );
}

export function Banner({ tone, children, onClose }: { tone: "success" | "critical" | "info" | "warning"; children: ReactNode; onClose?: () => void }) {
  const c = {
    success: "border-[#95c9b4] bg-[#f1f8f5] text-[#0c5132]",
    critical: "border-[#fdb5ad] bg-[#fff4f4] text-[#8e1f0b]",
    info: "border-[#a4cbe8] bg-[#f0f7ff] text-[#00527c]",
    warning: "border-[#ffd79d] bg-[#fff8ed] text-[#8a4a00]",
  }[tone];
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[13px] ${c}`}>
      <Icon name={tone === "success" ? "check" : "alert"} className="mt-[1px] h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="rounded p-0.5 hover:bg-black/5" aria-label="বন্ধ">
          <Icon name="close" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export type Msg = { ok: boolean; text: string } | null;
export function MsgBanner({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return <Banner tone={msg.ok ? "success" : "critical"}>{msg.text}</Banner>;
}

/** Runs a save and keeps busy/message state. */
export function useSaver() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
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
  return { busy, msg, setMsg, run };
}

export function Empty({ icon, title, text, action }: { icon: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f2f4] text-[#8a8a8a]">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-[#303030]">{title}</p>
      {text && <p className="mt-1 max-w-[360px] text-[13px] text-[#616161]">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Edition art used as a product thumbnail. */
export function Thumb({ slug, size = 36 }: { slug: string; size?: number }) {
  const s = slug === "collection" || slug === "Collector's Set" ? "plain" : slug;
  return (
    <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e1e3e5] bg-[#f6f6f7]" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/showcase/art/maya-${s}.svg`} alt="" className="h-[86%] w-[86%] object-contain" />
    </span>
  );
}

export const digits = (v: string) => v.replace(/[^\d]/g, "");
