/** Order flow. Shared by the server, the admin page and the web-admin API. */
export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "packed",
  "handed_to_courier",
  "in_transit",
  "delivered",
  "returned",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses where the order no longer holds stock. */
export const RELEASES_STOCK: readonly OrderStatus[] = ["returned", "cancelled"];

/** Old values from before the courier flow. */
const LEGACY: Record<string, OrderStatus> = { contacted: "confirmed", paid: "confirmed", shipped: "in_transit" };

export function normalizeStatus(s: unknown): OrderStatus | null {
  const v = String(s ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if ((ORDER_STATUSES as readonly string[]).includes(v)) return v as OrderStatus;
  return LEGACY[v] ?? null;
}

export const STATUS_LABELS: Record<OrderStatus, { en: string; bn: string }> = {
  new: { en: "New", bn: "নতুন" },
  confirmed: { en: "Confirmed", bn: "কনফার্মড" },
  packed: { en: "Packed", bn: "প্যাক করা" },
  handed_to_courier: { en: "Handed to courier", bn: "কুরিয়ারে দেওয়া" },
  in_transit: { en: "In transit", bn: "পথে আছে" },
  delivered: { en: "Delivered", bn: "ডেলিভারড" },
  returned: { en: "Returned", bn: "ফেরত" },
  cancelled: { en: "Cancelled", bn: "বাতিল" },
};

/** @deprecated old name */
export const PREORDER_STATUSES = ORDER_STATUSES;
