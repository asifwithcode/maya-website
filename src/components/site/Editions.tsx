"use client";

import Image from "next/image";
import { COMBO } from "./data";
import { separately, useContent } from "./content";
import { revealChildren, revealLines, useGsap } from "./motion";
import { scrollToId } from "./SmoothScroll";
import { takaFor, useT } from "./i18n";

const ACCESSORIES = ["bunny", "panda", "crown", "sprout", "headphones", "backpack"] as const;

/** Picks this option in the reserve form and scrolls there. */
export function reserve(variant: string) {
  const form = document.getElementById("reserve-form") as HTMLFormElement | null;
  const select = form?.elements.namedItem("variant") as HTMLSelectElement | null;
  if (select) select.value = variant;
  scrollToId("reserve");
  window.setTimeout(() => (form?.elements.namedItem("name") as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
}

export default function Editions() {
  const { lang, t } = useT();
  const taka = (n: number) => takaFor(lang, n);
  const e9 = t.editions;
  const { pricing: PRICING, editions } = useContent();
  const SEPARATELY = separately(PRICING, editions.length);
  const ref = useGsap<HTMLElement>((root, reduce) => {
    revealLines(root.querySelector("h2")!, reduce);
    revealChildren(root, reduce);
  });

  return (
    <section ref={ref} id="editions" className="bg-paper px-5 py-28 sm:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">{e9.kicker}</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
              {e9.title} <span className="text-ink-faint">{e9.titleSoft}</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">{e9.text}</p>
        </div>

        <ul data-reveal-group className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((e) => {
            const name = e.name[lang];
            const accessory = e.accessory[lang];
            const eyes = e.eyes[lang];
            return (
              <li key={e.slug} data-reveal>
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-ink/[0.06]">
                  <div className="relative aspect-[5/4] overflow-hidden" style={{ background: e.tint }}>
                    <Image
                      src={`/showcase/art/maya-${e.slug}.svg`}
                      alt={`Maya, ${name}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 90vw, 380px"
                      className="object-contain object-bottom px-[24%] pb-[7%] pt-[9%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {accessory} · {eyes} · {e9.mini}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      <span className="text-2xl font-semibold tracking-tight">{taka(e.price ?? PRICING.maya)}</span>
                      <button
                        type="button"
                        onClick={() => reserve(e.variant)}
                        className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-eye-deep hover:text-white"
                      >
                        {e9.reserve}
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div data-reveal-group>
          <article data-reveal className="relative mt-4 grid overflow-hidden rounded-[1.75rem] bg-night text-white ring-1 ring-white/[0.06] lg:grid-cols-[1.15fr_1fr]">
            <div className="grid grid-cols-[0.85fr_1fr] items-end gap-5 bg-white/[0.03] p-6 sm:p-10">
              <div className="relative aspect-[220/336] w-full">
                <Image src="/showcase/art/maya-plain.svg" alt="Maya" fill unoptimized sizes="280px" className="object-contain object-bottom" />
              </div>
              <ul className="grid grid-cols-2 gap-2.5 self-center">
                {ACCESSORIES.map((id) => (
                  <li key={id} className="rounded-2xl bg-[#f4efe9] p-2 text-center">
                    <div className="relative aspect-[4/3]">
                      <Image src={`/showcase/art/acc-${id}.svg`} alt="" fill unoptimized sizes="120px" className="object-contain" />
                    </div>
                    <div className="mt-1 text-[0.7rem] font-medium text-[#6e6e73]">{e9.accessories[id]}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye">{e9.combo.kicker}</span>
                <span className="rounded-full bg-eye px-3 py-1 text-xs font-semibold">{e9.combo.best}</span>
              </div>
              <h3 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">{e9.combo.name}</h3>
              <p className="mt-2 text-white/55">{e9.combo.text}</p>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="text-5xl font-semibold tracking-tight">{taka(PRICING.collector)}</span>
                <span className="text-sm text-white/35 line-through">{taka(SEPARATELY)}</span>
              </div>
              <p className="mt-1 text-sm text-eye">
                {e9.combo.save} {taka(SEPARATELY - PRICING.collector)}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[0.95rem] text-white/75">
                {e9.combo.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="text-eye">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => reserve(COMBO.variant)}
                className="mt-8 rounded-full bg-eye py-3.5 text-sm font-semibold transition hover:bg-eye-deep"
              >
                {e9.combo.button}
              </button>
            </div>
          </article>

          <div data-reveal className="mt-4 grid gap-4 sm:grid-cols-3">
            {[taka(PRICING.accessory), taka(PRICING.mini), `${taka(PRICING.delivery.dhaka)} / ${taka(PRICING.delivery.outside)}`].map((v, i) => (
              <div key={i} className="rounded-[1.5rem] bg-card p-6 ring-1 ring-ink/[0.06]">
                <div className="text-sm text-ink-soft">{e9.extras[i][0]}</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">{v}</div>
                <div className="mt-1 text-xs text-ink-faint">{e9.extras[i][1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
