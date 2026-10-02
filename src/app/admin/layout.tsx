import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Maya CMS", robots: { index: false, follow: false } };

const TABS = [
  ["/admin", "Preorders"],
  ["/admin/editions", "Editions"],
  ["/admin/pricing", "Pricing"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-script text-xl">maya</span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">CMS</span>
          </Link>
          {authed && (
            <nav className="flex items-center gap-1 text-sm">
              {TABS.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-ink/5 hover:text-ink">
                  {label}
                </Link>
              ))}
              <Link href="/" className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-ink/5 hover:text-ink">
                View site
              </Link>
              <form action={logout}>
                <button className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-ink/5 hover:text-ink">Log out</button>
              </form>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
