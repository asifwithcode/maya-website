import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export { PREORDER_STATUSES } from "./statuses";

export const preorders = pgTable("preorders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  variant: text("variant").notNull(),
  qty: integer("qty").notNull().default(1),
  lang: text("lang").notNull().default("en"),
  status: text("status").notNull().default("new"),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Edition = typeof editions.$inferSelect;
export type Preorder = typeof preorders.$inferSelect;
export type Pricing = {
  maya: number;
  collector: number;
  accessory: number;
  mini: number;
  delivery: { dhaka: number; outside: number };
};
