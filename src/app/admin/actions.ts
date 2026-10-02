"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { editions, preorders, settings, type Pricing } from "@/db/schema";
import { PREORDER_STATUSES } from "@/db/statuses";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";

const refreshSite = () => {
  revalidatePath("/");
  revalidatePath("/bn");
};
const str = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").trim().slice(0, max);
const int = (f: FormData, k: string) => {
  const n = Math.trunc(Number(f.get(k)));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function login(form: FormData) {
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    redirect("/admin/login?e=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function setPreorderStatus(form: FormData) {
  await requireAdmin();
  const id = int(form, "id");
  const status = str(form, "status");
  if (id === null || !(PREORDER_STATUSES as readonly string[]).includes(status)) return;
  await db().update(preorders).set({ status }).where(eq(preorders.id, id));
  revalidatePath("/admin");
}

export async function setPreorderNote(form: FormData) {
  await requireAdmin();
  const id = int(form, "id");
  if (id === null) return;
  await db().update(preorders).set({ note: str(form, "note", 1000) }).where(eq(preorders.id, id));
  revalidatePath("/admin");
}

export async function saveEdition(form: FormData) {
  await requireAdmin();
  const id = int(form, "id");
  if (id === null) return;
  const tint = str(form, "tint", 7);
  const price = String(form.get("price") ?? "").trim() === "" ? null : int(form, "price");
  await db()
    .update(editions)
    .set({
      nameEn: str(form, "nameEn"),
      nameBn: str(form, "nameBn"),
      accessoryEn: str(form, "accessoryEn"),
      accessoryBn: str(form, "accessoryBn"),
      eyesEn: str(form, "eyesEn"),
      eyesBn: str(form, "eyesBn"),
      tint: /^#[0-9a-f]{6}$/i.test(tint) ? tint : "#f3f1ee",
      price,
      sortOrder: int(form, "sortOrder") ?? 0,
      active: form.get("active") === "on",
      updatedAt: new Date(),
    })
    .where(eq(editions.id, id));
  refreshSite();
  revalidatePath("/admin/editions");
}

export async function savePricing(form: FormData) {
  await requireAdmin();
  const n = (k: string) => int(form, k) ?? 0;
  const value: Pricing = {
    maya: n("maya"),
    collector: n("collector"),
    accessory: n("accessory"),
    mini: n("mini"),
    delivery: { dhaka: n("dhaka"), outside: n("outside") },
  };
  await db()
    .insert(settings)
    .values({ key: "pricing", value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  refreshSite();
  revalidatePath("/admin/pricing");
}
