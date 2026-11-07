import { sql } from "drizzle-orm";
import { boolean, check, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/** Key/value site settings. `pricing` holds every price on the site, in taka. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** The boxed editions shown on the site and offered in the reserve form. */
export const editions = pgTable("editions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // matches the 3D look and /showcase/art/maya-<slug>.svg
  variant: text("variant").notNull().unique(), // value sent by the reserve form
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
  accessoryEn: text("accessory_en").notNull(),
  accessoryBn: text("accessory_bn").notNull(),
  eyesEn: text("eyes_en").notNull(),
  eyesBn: text("eyes_bn").notNull(),
  tint: text("tint").notNull().default("#f3f1ee"),
  price: integer("price"), // null = the standard Maya price
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export { ORDER_STATUSES, PREORDER_STATUSES } from "./statuses";

export type OrderHistoryEntry = { status: string; at: string; note?: string };

/** Orders (the table keeps its old name). Stock is taken when an order is placed. */
export const preorders = pgTable("preorders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  address: text("address").notNull().default(""),
  location: text("location").notNull().default("dhaka"), // dhaka | outside
  variant: text("variant").notNull(),
  qty: integer("qty").notNull().default(1),
  lang: text("lang").notNull().default("en"),
  status: text("status").notNull().default("new"),
  note: text("note").notNull().default(""), // admin note
  courier: text("courier").notNull().default(""),
  trackingNo: text("tracking_no").notNull().default(""),
  unitPrice: integer("unit_price").notNull().default(0),
  delivery: integer("delivery").notNull().default(0),
  total: integer("total").notNull().default(0), // cash to collect = unit_price * qty + delivery
  paid: integer("paid").notNull().default(0),
  stockHeld: boolean("stock_held").notNull().default(true), // false after cancel/return put it back
  history: jsonb("history").$type<OrderHistoryEntry[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Units on hand per orderable variant (the six editions + "Collector's Set"). */
export const stock = pgTable(
  "stock",
  {
    variant: text("variant").primaryKey(),
    qty: integer("qty").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("stock_qty_nonnegative", sql`${t.qty} >= 0`)],
);

export type Edition = typeof editions.$inferSelect;
export type Preorder = typeof preorders.$inferSelect;
export type StockRow = typeof stock.$inferSelect;
export type Pricing = {
  maya: number;
  collector: number;
  accessory: number;
  mini: number;
  delivery: { dhaka: number; outside: number };
};
