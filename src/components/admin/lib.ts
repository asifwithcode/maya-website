import { STATUS_LABELS, type OrderStatus } from "@/db/statuses";
import type { Pricing, SiteCopy } from "@/components/site/content";

export type { Pricing, SiteCopy };

export type HistoryEntry = { status: string; at: string; note?: string; edit?: boolean; by?: string; changes?: string[] };
export type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  variant: string;
  qty: number;
  lang: string;
  status: OrderStatus;
  note: string;
  address: string;
  location: "dhaka" | "outside";
  createdAt: string;
  updatedAt: string;
  courier: string;
  trackingNo: string;
  unitPrice: number;
  delivery: number;
  total: number;
  paid: number;
  history: HistoryEntry[];
  units?: string[];
};
export type Summary = {
  orders: number;
  activeOrders: number;
  units: number;
  bookedRevenue: number;
  deliveredRevenue: number;
  collected: number;
  byStatus: Record<string, number>;
  byVariant: Record<string, { orders: number; units: number; revenue: number }>;
};
export type StockItem = {
  variant: string;
  name: string;
  nameBn: string;
  price: number;
  qty: number;
  active: boolean;
  units?: { in_stock: number; reserved: number; sold: number };
};
export type Edition = {
  id: number;
  slug: string;
  variant: string;
  nameEn: string;
  nameBn: string;
  accessoryEn: string;
  accessoryBn: string;
  eyesEn: string;
  eyesBn: string;
  tintHex: string;
  price: number | null;
  sortOrder: number;
  active: boolean;
};
/** What the full GET /api/web-admin sends besides orders and stock. */
export type SiteData = {
  editions: Edition[];
  pricing: { maya: number; collector: number; accessory: number; mini: number; deliveryDhaka: number; deliveryOutside: number };
  copy: SiteCopy;
};

export const TOKEN_KEY = "maya_admin_token";
export const COURIERS = ["Steadfast", "Pathao", "RedX", "Sundarban", "Paperfly", "eCourier", "SA Paribahan"];
export const POLL_MS = 60_000;

export const taka = (n: number) => "৳" + (n ?? 0).toLocaleString("en-IN");
export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" });
export const label = (s: string) => STATUS_LABELS[s as OrderStatus]?.bn ?? s;

export const STATUS_TONE: Record<OrderStatus, string> = {
  new: "bg-[#0071e3] text-white",
  confirmed: "bg-[#e8f1fd] text-[#0058b0]",
  packed: "bg-[#f2ecfd] text-[#6b3fc4]",
  handed_to_courier: "bg-[#fdf3e6] text-[#a35200]",
  in_transit: "bg-[#fff6d6] text-[#8a6100]",
  delivered: "bg-[#e7f6ea] text-[#1d7a33]",
  returned: "bg-[#fdecec] text-[#b3261e]",
  cancelled: "bg-[#efeff1] text-[#6e6e73]",
};

export function readToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}
export function saveToken(t: string, remember: boolean) {
  try {
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, t);
  } catch {
    /* private mode: the token lives only in memory */
  }
}
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export class AuthError extends Error {}

const ERROR_TEXT: Record<string, string> = {
  out_of_stock: "স্টক নেই, এই পরিবর্তন করা গেল না।",
  not_found: "অর্ডারটা পাওয়া যায়নি।",
  bad_status: "স্ট্যাটাস সঠিক নয়।",
  invalid_variant: "এই এডিশন অর্ডার করা যায় না।",
  order_locked: "অর্ডারটি ডেলিভারড বা ফেরত; পণ্য বা দাম বদলাতে নিশ্চিতকরণ টিক দিন।",
};

export async function api<T>(token: string, init?: { view?: string; body?: unknown }): Promise<T> {
  const url = init?.view ? `/api/web-admin?view=${init.view}` : "/api/web-admin";
  const res = await fetch(url, {
    method: init?.body ? "POST" : "GET",
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, ...(init?.body ? { "Content-Type": "application/json" } : {}) },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  // A wrong token gets a plain 404; a missing order gets 404 with error "not_found".
  if (res.status === 401 || res.status === 403 || (res.status === 404 && data.error !== "not_found")) throw new AuthError();
  if (!res.ok || data.ok === false) {
    throw new Error(ERROR_TEXT[data.error] ?? data.message ?? data.error ?? `Error ${res.status}`);
  }
  return data as T;
}
