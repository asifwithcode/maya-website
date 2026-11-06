"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { COMBO } from "./data";
import { useContent } from "./content";
import { takaFor, useT } from "./i18n";

/** Order / checkout section (anchor: #order). Posts to the existing /api/preorder endpoint. */
export default function Reserve() {
  const { lang, t } = useT();
  const r = t.reserve;
  const isBn = lang === "bn";
  const taka = (n: number) => takaFor(lang, n);
  const { pricing: PRICING, editions } = useContent();

  const VARIANTS: { value: string; name: string; price: number; img: string }[] = [
    ...editions.map((e) => ({
      value: e.variant,
      name: e.name[lang],
      price: e.price ?? PRICING.maya,
      img: `/showcase/art/maya-${e.slug}.svg`,
    })),
    { value: COMBO.variant, name: t.editions.combo.name, price: PRICING.collector, img: "/showcase/art/maya-plain.svg" },
    { value: "Classic", name: r.classic, price: PRICING.maya, img: "/showcase/art/maya-plain.svg" },
  ];

  const [variant, setVariant] = useState(VARIANTS[0].value);
  const [qty, setQty] = useState(1);
  const [location, setLocation] = useState<"dhaka" | "outside">("dhaka");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onSelect = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if (typeof v === "string") setVariant(v);
    };
    window.addEventListener("maya:select-variant", onSelect);
    return () => window.removeEventListener("maya:select-variant", onSelect);
  }, []);

  const current = VARIANTS.find((v) => v.value === variant) ?? VARIANTS[0];
  const deliveryFee = location === "dhaka" ? (PRICING?.delivery?.dhaka ?? 70) : (PRICING?.delivery?.outside ?? 130);
  const subtotal = current.price * qty;
  const total = subtotal + deliveryFee;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone"),
          address: f.get("address"),
          variant,
          qty,
          location,
          lang,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(lang === "en" && body.error ? body.error : r.error);
      setStatus("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : r.error);
      setStatus("error");
    }
  }

  return (
    <section id="order" className="scroll-mt-12 bg-[#f5f5f7] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1024px]">
        <div className="text-center">
          <h2 className="headline text-[#1d1d1f]">{r.title}</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[19px] leading-relaxed text-[#6e6e73] sm:text-[21px]">{r.text}</p>
        </div>

        {status === "ok" ? (
          <div className="mx-auto mt-10 max-w-[560px] rounded-[28px] bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0071e3] text-white">
              <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-6 text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{r.thanks}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-[#6e6e73]">{r.thanksText}</p>
          </div>
        ) : (
          <form id="order-form" onSubmit={submit} className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5 rounded-[28px] bg-white p-6 sm:p-10">
              <div>
                <h3 className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">{isBn ? "এডিশন বেছে নিন" : "Choose your edition"}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {VARIANTS.map((v) => {
                    const sel = v.value === variant;
                    return (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => setVariant(v.value)}
                        aria-pressed={sel}
                        className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                          sel ? "border-[#0071e3] bg-[#0071e3]/[0.04] ring-1 ring-[#0071e3]" : "border-[#d2d2d7] hover:border-[#86868b]"
                        }`}
                      >
                        <span className="relative h-16 w-16">
                          <Image src={v.img} alt="" fill unoptimized className="object-contain" />
                        </span>
                        <span className="mt-2 text-[13px] font-medium leading-tight text-[#1d1d1f]">{v.name}</span>
                        <span className="mt-0.5 text-[12px] text-[#6e6e73]">{taka(v.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#d2d2d7] pt-6">
                <h3 className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">{isBn ? "ডেলিভারির তথ্য" : "Delivery details"}</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>
                    <span className="field-label">{r.name}</span>
                    <input name="name" required autoComplete="name" placeholder={r.namePh} className="field" />
                  </label>
                  <label>
                    <span className="field-label">{isBn ? "ফোন নম্বর" : "Phone"}</span>
                    <input name="phone" type="tel" required autoComplete="tel" placeholder="01XXXXXXXXX" className="field" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="field-label">{r.email}</span>
                    <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="field" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="field-label">{isBn ? "ঠিকানা" : "Address"}</span>
                    <input
                      name="address"
                      required
                      autoComplete="street-address"
                      placeholder={isBn ? "বাসা, রোড, এলাকা, শহর" : "House, road, area, city"}
                      className="field"
                    />
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {(["dhaka", "outside"] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      aria-pressed={location === loc}
                      className={`rounded-2xl border px-4 py-3.5 text-left transition ${
                        location === loc ? "border-[#0071e3] ring-1 ring-[#0071e3]" : "border-[#d2d2d7] hover:border-[#86868b]"
                      }`}
                    >
                      <span className="block text-[15px] font-medium text-[#1d1d1f]">
                        {loc === "dhaka" ? (isBn ? "ঢাকার ভেতরে" : "Inside Dhaka") : isBn ? "ঢাকার বাইরে" : "Outside Dhaka"}
                      </span>
                      <span className="text-[13px] text-[#6e6e73]">
                        {taka(loc === "dhaka" ? (PRICING?.delivery?.dhaka ?? 70) : (PRICING?.delivery?.outside ?? 130))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="h-fit rounded-[28px] bg-white p-6 sm:p-8 lg:sticky lg:top-20">
              <h3 className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">{isBn ? "অর্ডার সারাংশ" : "Order summary"}</h3>
              <div className="mt-5 flex items-center gap-4">
                <span key={current.value} className="pop relative h-16 w-16 shrink-0 rounded-xl bg-[#f5f5f7]">
                  <Image src={current.img} alt="" fill unoptimized className="object-contain p-1.5" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-[#1d1d1f]">{current.name}</p>
                  <p className="text-[13px] text-[#6e6e73]">{taka(current.price)}</p>
                </div>
                <div className="flex items-center rounded-full border border-[#d2d2d7]">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 text-[17px] text-[#1d1d1f]" aria-label="−">
                    −
                  </button>
                  <span className="w-5 text-center text-[15px] tabular-nums">{qty}</span>
                  <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} className="h-8 w-8 text-[17px] text-[#1d1d1f]" aria-label="+">
                    +
                  </button>
                </div>
              </div>

              <dl className="mt-6 space-y-2 border-t border-[#d2d2d7] pt-5 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-[#6e6e73]">{isBn ? "সাবটোটাল" : "Subtotal"}</dt>
                  <dd className="text-[#1d1d1f]">{taka(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6e6e73]">{isBn ? "ডেলিভারি" : "Delivery"}</dt>
                  <dd className="text-[#1d1d1f]">{taka(deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-[#d2d2d7] pt-3 text-[19px] font-semibold">
                  <dt className="text-[#1d1d1f]">{isBn ? "মোট" : "Total"}</dt>
                  <dd key={total} className="pop text-[#1d1d1f]">{taka(total)}</dd>
                </div>
              </dl>

              {error && <p className="mt-4 rounded-xl bg-[#fff2f2] p-3 text-[14px] text-[#d70015]">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full py-3.5 text-[17px] transition-transform hover:scale-[1.02] active:scale-[0.98]">
                {status === "loading" ? r.loading : r.submit}
              </button>
              <p className="mt-3 text-center text-[12px] text-[#86868b]">
                {isBn ? "ক্যাশ অন ডেলিভারি বা bKash · সারা বাংলাদেশে ডেলিভারি" : "Cash on delivery or bKash · Delivery across Bangladesh"}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
