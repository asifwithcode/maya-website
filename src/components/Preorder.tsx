"use client";

import { useEffect, useState, type FormEvent } from "react";
import Reveal from "./Reveal";

const VARIANTS = ["Classic", "Focus", "Hopper", "Panda", "Sprout", "Collector's Set", "Surprise me"];

export default function Preorder() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/preorder")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(null));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      variant: (form.elements.namedItem("variant") as HTMLSelectElement).value,
      qty: (form.elements.namedItem("qty") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong.");
      setCount(body.count);
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="preorder" className="scroll-mt-20 bg-bg-2 py-24 sm:py-32">
      <div className="mx-auto max-w-xl px-6 text-center sm:px-10">
        <Reveal>
          <span className="text-base font-medium text-ink-faint">Season One &middot; Limited Run</span>
          <h2 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">Reserve your MAYA</h2>
          <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink-soft">
            No payment today &mdash; just a spot on the list. We&rsquo;ll email
            when Season One is ready to ship, in the order reservations came in.
          </p>

          <div className="mx-auto mt-8 flex max-w-[220px] justify-between text-left">
            <div>
              <b className="block text-2xl font-semibold">{count ?? "—"}</b>
              <span className="text-xs uppercase tracking-wide text-ink-faint">Reserved</span>
            </div>
            <div>
              <b className="block text-2xl font-semibold">5</b>
              <span className="text-xs uppercase tracking-wide text-ink-faint">Heads</span>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-sm text-left">
            {status === "ok" ? (
              <div className="py-6 text-center">
                <div className="mb-2 text-3xl">&#10003;</div>
                <h3 className="text-lg font-semibold">You&rsquo;re on the list.</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  We&rsquo;ll email you the moment Season One opens for real orders.
                </p>
              </div>
            ) : (
              <form id="preorderForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input name="name" type="text" required placeholder="Name" className="field-input-light" />
                <input name="email" type="email" required placeholder="Email" className="field-input-light" />
                <div className="grid grid-cols-2 gap-5">
                  <select name="variant" defaultValue="Classic" className="field-input-light">
                    {VARIANTS.map((v) => (
                      <option key={v} value={v}>
                        {v === "Focus" ? "Focus (headphones)" : v === "Hopper" ? "Hopper (bunny)" : v}
                      </option>
                    ))}
                  </select>
                  <input name="qty" type="number" min={1} max={10} defaultValue={1} className="field-input-light" />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 rounded-full bg-eye py-3.5 text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-progress disabled:opacity-60"
                >
                  {status === "loading" ? "Reserving…" : "Reserve my spot"}
                </button>
                <p className="text-xs text-ink-faint">
                  We&rsquo;ll only use this to email you about Season One &mdash; no spam, no sharing.
                </p>
                {status === "error" && (
                  <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
