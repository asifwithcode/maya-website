import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "maya_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // a week

const secret = () => {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SECRET must be set (32+ characters)");
  return s;
};
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");
const sameBytes = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

/** Constant-time password check against ADMIN_PASSWORD. */
export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return sameBytes(h(input), h(expected));
}

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || Number(exp) < Date.now() / 1000) return false;
  return sameBytes(Buffer.from(mac), Buffer.from(sign(exp)));
}

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
