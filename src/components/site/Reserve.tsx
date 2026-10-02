"use client";

import { useEffect, useState, type FormEvent } from "react";
import MayaFace from "./MayaFace";
import { COMBO, EDITIONS, PRICING } from "./data";
import { revealChildren, revealLines, useGsap } from "./motion";
import { takaFor, useT } from "./i18n";

export default function Reserve() {
  const { lang, t } = useT();
  const r = t.reserve;
  const taka = (n: number) => takaFor(lang, n);
  // values must stay in the API's VALID_VARIANTS list; only the labels are translated
  const VARIANTS: [string, string][] = [
    ...EDITIONS.map((e): [string, string] => [e.variant, `${t.editions.items[e.look][0]} · ${taka(PRICING.maya)}`]),
    [COMBO.variant, `${t.editions.combo.name} · ${taka(PRICING.collector)}`],
    ["Classic", `${r.classic} · ${taka(PRICING.maya)}`],
    ["Surprise me", `${r.surprise} · ${taka(PRICING.maya)}`],
  ];
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const ref = useGsap<HTMLElement>((root, reduce) => {
    revealLines(root.querySelector("h2")!, reduce);
    revealChildren(root, reduce);
  });

  useEffect(() => {
    fetch("/api/preorder")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(null));
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(lang === "en" && body.error ? body.error : r.error);
      setCount(body.count);
      setStatus("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : r.error);
      setStatus("error");
    }
  }

  return (
    <section ref={ref} id="reserve" className="bg-night px-5 py-28 text-white sm:px-8 md:py-40">
      <div data-reveal-group className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div data-reveal className="flex flex-col items-start">
          <div className="rounded-full border-[10px] border-[#f4efe9]">
            <MayaFace mood={status === "ok" ? "love" : "idle"} className="h-28 w-28" />
          </div>
          <h2 className="mt-10 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">{r.title}</h2>
          <p className="mt-5 max-w-sm text-white/55">
            {r.text}
          </p>
          {count !== null && count > 0 && (
            <p className="mt-6 text-sm text-white/45">
              {r.count(count)}
            </p>
          )}
        </div>

        <div data-reveal>
          {status === "ok" ? (
            <div className="rounded-[1.75rem] bg-white/[0.04] p-10 text-center ring-1 ring-white/10">
              <div className="text-3xl">{r.thanks}</div>
              <p className="mt-2 text-white/55">{r.thanksText}</p>
            </div>
          ) : (
            <form id="reserve-form" onSubmit={submit} className="space-y-7 rounded-[1.75rem] bg-white/[0.04] p-7 ring-1 ring-white/10 sm:p-9">
              <label className="block">
                <span className="text-xs text-white/45">{r.name}</span>
                <input name="name" required autoComplete="name" className="field-input" placeholder={r.namePh} />
              </label>
              <label className="block">
                <span className="text-xs text-white/45">{r.email}</span>
                <input name="email" type="email" required autoComplete="email" className="field-input" placeholder="you@example.com" />
              </label>
              <div className="grid grid-cols-[1fr_5rem] gap-4">
                <label className="block">
                  <span className="text-xs text-white/45">{r.edition}</span>
                  <select name="variant" defaultValue="Bunny" className="field-input">
                    {VARIANTS.map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-white/45">{r.qty}</span>
                  <input name="qty" type="number" min={1} max={10} defaultValue={1} className="field-input" />
                </label>
              </div>
              {status === "error" && <p className="text-sm text-eye">{error}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-eye py-4 text-sm font-semibold transition hover:bg-eye-deep disabled:opacity-60"
              >
                {status === "loading" ? r.loading : r.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
