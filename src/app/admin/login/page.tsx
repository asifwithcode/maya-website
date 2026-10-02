import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { login } from "../actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { e } = await searchParams;
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-3xl bg-card p-8 ring-1 ring-ink/10">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-ink-soft">Maya content and preorders.</p>
      <form action={login} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs text-ink-faint">Password</span>
          <input name="password" type="password" required autoFocus autoComplete="current-password" className="field-input-light" />
        </label>
        {e && <p className="text-sm text-eye-deep">Wrong password.</p>}
        <button className="w-full rounded-full bg-ink py-3 text-sm font-medium text-paper hover:bg-eye-deep hover:text-white">Sign in</button>
      </form>
    </div>
  );
}
