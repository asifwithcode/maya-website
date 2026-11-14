"use client";

import Image from "next/image";
import { COMBO } from "./data";
import { separately, useContent } from "./content";
import { scrollToId } from "./SmoothScroll";
import { takaFor, useT } from "./i18n";

const ACCESSORIES = ["bunny", "panda", "crown", "sprout", "headphones", "backpack"] as const;

/** Preselects an edition in the order form and scrolls to it. */
export function orderVariant(variant: string) {
  window.dispatchEvent(new CustomEvent("maya:select-variant", { detail: variant }));
  scrollToId("order");
  window.setTimeout(() => (document.querySelector("#order-form input[name=name]") as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
}
/** @deprecated kept for older imports */
export const reserve = orderVariant;

export default function Editions() {
  const { lang, t } = useT();
  const taka = (n: number) => takaFor(lang, n);
  const e9 = t.editions;
  const { pricing: PRICING, editions } = useContent();
  const SEPARATELY = separately(PRICING, editions.length);
  const isBn = lang === "bn";

  return (
    <section id="editions" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1024px]">
        <div className="text-center">
          <h2 className="headline text-[#1d1d1f]">
            {e9.title} <span className="text-[#86868b]">{e9.titleSoft}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[19px] leading-relaxed text-[#6e6e73] sm:text-[21px]">{e9.text}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((e) => (
            <div key={e.slug} className="lift group flex flex-col rounded-[28px] bg-[#f5f5f7] p-8 text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[240px]">
                <Image
                  src={`/showcase/art/maya-${e.slug}.svg`}
                  alt={`Maya ${e.name[lang]}`}
                  fill
                  unoptimized
                  sizes="240px"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-6 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">{e.name[lang]}</h3>
              <p className="mt-1 text-[14px] text-[#6e6e73]">
                {e.accessory[lang]} · {e.eyes[lang]}
              </p>
              <p className="mt-4 text-[17px] text-[#1d1d1f]">{taka(e.price ?? PRICING.maya)}</p>
              <div className="mt-5">
                <button type="button" onClick={() => orderVariant(e.variant)} className="btn-primary">
                  {e9.reserve}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Complete collection */}
        <div className="mt-5 overflow-hidden rounded-[28px] bg-[#f5f5f7] p-8 sm:p-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <p className="eyebrow">{e9.combo.best}</p>
              <h3 className="mt-1 text-[32px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[40px]">{e9.combo.name}</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-[#6e6e73]">{e9.combo.text}</p>
              <ul className="mt-6 space-y-2 text-[17px] text-[#1d1d1f]">
                {e9.combo.features.map((f) => (
                  <li key={f} className="flex items-center justify-center gap-2 lg:justify-start">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#0071e3]" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                <div>
                  <span className="text-[24px] font-semibold text-[#1d1d1f]">{taka(PRICING.collector)}</span>
                  <span className="ml-2 text-[15px] text-[#86868b] line-through">{taka(SEPARATELY)}</span>
                </div>
                <button type="button" onClick={() => orderVariant(COMBO.variant)} className="btn-primary">
                  {e9.combo.button}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="relative aspect-[3/4] w-36 shrink-0 sm:w-44">
                <Image src="/showcase/art/maya-plain.svg" alt="Maya" fill unoptimized className="object-contain" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ACCESSORIES.map((id) => (
                  <div key={id} className="flex flex-col items-center rounded-2xl bg-white p-3">
                    <div className="relative h-12 w-12">
                      <Image src={`/showcase/art/acc-${id}.svg`} alt={e9.accessories[id]} fill unoptimized className="object-contain" />
                    </div>
                    <span className="mt-1 text-center text-[11px] text-[#6e6e73]">{e9.accessories[id]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
          {isBn
            ? `ডেলিভারি: ঢাকার ভেতরে ${taka(PRICING.delivery.dhaka)}, ঢাকার বাইরে ${taka(PRICING.delivery.outside)}। ক্যাশ অন ডেলিভারি।`
            : `Delivery ${taka(PRICING.delivery.dhaka)} inside Dhaka, ${taka(PRICING.delivery.outside)} elsewhere. Cash on delivery.`}
        </p>
      </div>
    </section>
  );
}
