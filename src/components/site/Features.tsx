"use client";

import type { ReactNode } from "react";
import MayaFace from "./MayaFace";
import { gsap, revealChildren, revealLines, useGsap } from "./motion";
import { useT } from "./i18n";

// texts live in i18n.tsx (features.items), in the same order
const ART: ReactNode[] = [
  (
      <div key="art0" className="rounded-full border-[6px] border-[#f4efe9] shadow-lg">
        <MayaFace mood="idle" className="h-20 w-20" still />
      </div>
  ),
  (
      <div key="art1" className="rounded-2xl bg-night px-4 py-3 font-bangla text-sm leading-snug text-white shadow-lg">
        <span className="text-eye">নিজের খেয়াল রাখো</span>
        <br />
        পানি খাও!
      </div>
  ),
  (
      <div key="art2" className="flex gap-2">
        <span className="grid h-12 w-16 place-items-center rounded-xl bg-eye text-xs font-semibold text-white">T1</span>
        <span className="grid h-12 w-16 place-items-center rounded-xl bg-ink text-xs font-semibold text-paper">T2</span>
      </div>
  ),
  (
      <svg key="art3" viewBox="0 0 80 80" className="h-20 w-20" aria-hidden="true">
        <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="7" />
        <circle data-ring cx="40" cy="40" r="32" fill="none" stroke="#e1899b" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0.3" transform="rotate(-90 40 40)" />
        <text x="40" y="46" textAnchor="middle" fontSize="18" fontWeight="600" fill="currentColor">25</text>
      </svg>
  ),
  (
      <svg key="art4" viewBox="0 0 80 60" className="h-16 w-20" aria-hidden="true">
        <path d="M8 26a46 46 0 0 1 64 0M18 36a32 32 0 0 1 44 0M28 46a18 18 0 0 1 24 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="54" r="4" fill="#e1899b" />
      </svg>
  ),
  (
      <svg key="art5" viewBox="0 0 64 72" className="h-16 w-14" aria-hidden="true">
        <path d="M18 30v-8a14 14 0 0 1 28 0v8" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="8" y="30" width="48" height="36" rx="10" fill="currentColor" />
        <circle cx="32" cy="46" r="5" fill="#e1899b" />
      </svg>
  ),
];

export default function Features() {
  const { t } = useT();
  const ref = useGsap<HTMLElement>((root, reduce) => {
    revealLines(root.querySelector("h2")!, reduce);
    revealChildren(root, reduce);
    if (reduce) return;
    gsap.fromTo(
      root.querySelector("[data-ring]"),
      { attr: { "stroke-dashoffset": 1 } },
      { attr: { "stroke-dashoffset": 0.3 }, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-ring]"), start: "top 85%" } },
    );
  });

  return (
    <section ref={ref} id="features" className="bg-paper px-5 py-28 sm:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">{t.features.kicker}</p>
          <h2 className="mt-3 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
            {t.features.title} <span className="text-ink-faint">{t.features.titleSoft}</span>
          </h2>
        </div>
        <ol data-reveal-group className="border-t border-ink/10">
          {ART.map((art, i) => (
            <li key={i} data-reveal className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-ink/10 py-9 sm:grid-cols-[3rem_1fr_7rem] sm:items-center">
              <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{t.features.items[i][0]}</h3>
                <p className="mt-2 max-w-md text-ink-soft">{t.features.items[i][1]}</p>
              </div>
              <div className="col-start-2 mt-5 flex sm:col-start-3 sm:mt-0 sm:justify-end">{art}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
