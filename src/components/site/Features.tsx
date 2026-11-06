"use client";

import type { ReactNode } from "react";
import MayaFace from "./MayaFace";
import { useT } from "./i18n";
import { useContent } from "./content";

const VISUALS: ReactNode[] = [
  <div key="face" className="h-28 w-28 overflow-hidden rounded-full bg-black shadow-[0_0_0_6px_#1d1d1f]">
    <MayaFace mood="idle" className="h-full w-full p-3" still />
  </div>,
  <div key="note" className="rounded-2xl bg-[#1d1d1f] px-5 py-4 text-left shadow-sm">
    <span className="text-[11px] text-[#86868b]">মায়া</span>
    <p className="mt-0.5 font-bangla text-[17px] font-semibold text-white">নিজের খেয়াল রাখো, পানি খাও!</p>
  </div>,
  <div key="touch" className="flex gap-3">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7] text-[13px] text-[#6e6e73]">L</span>
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0071e3] text-[13px] text-white">R</span>
  </div>,
  <div key="timer" className="relative flex h-28 w-28 items-center justify-center">
    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
      <circle cx="50" cy="50" r="42" fill="none" stroke="#e8e8ed" strokeWidth="7" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#0071e3" strokeWidth="7" strokeDasharray="263.9" strokeDashoffset="66" strokeLinecap="round" />
    </svg>
    <span className="absolute text-[20px] font-semibold tabular-nums text-[#1d1d1f]">25:00</span>
  </div>,
  <div key="pair" className="flex items-center gap-3 text-[13px] text-[#1d1d1f]">
    <span className="rounded-full bg-[#f5f5f7] px-4 py-2">Bluetooth</span>
    <span className="text-[#86868b]">→</span>
    <span className="rounded-full bg-[#f5f5f7] px-4 py-2">Wi‑Fi</span>
  </div>,
  <svg key="lock" viewBox="0 0 48 48" className="h-20 w-20 text-[#1d1d1f]" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="10" y="21" width="28" height="20" rx="5" />
    <path d="M16 21v-5a8 8 0 0 1 16 0v5" strokeLinecap="round" />
  </svg>,
];

export default function Features() {
  const { lang, t } = useT();
  const { copy } = useContent();
  const items = copy?.features?.items;

  return (
    <section id="features" className="bg-[#f5f5f7] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1024px]">
        <div className="text-center">
          <h2 className="headline text-[#1d1d1f]">
            {t.features.title} <span className="text-[#86868b]">{t.features.titleSoft}</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map(([fallbackTitle, fallbackDesc], k) => {
            const it = items?.[k];
            const title = it ? (lang === "bn" ? it.titleBn : it.titleEn) : fallbackTitle;
            const desc = it ? (lang === "bn" ? it.descBn : it.descEn) : fallbackDesc;
            return (
              <div key={k} className="lift flex flex-col rounded-[28px] bg-white p-8 sm:p-10">
                <div className="flex h-40 items-center justify-center">{VISUALS[k]}</div>
                <h3 className="mt-8 text-[24px] font-semibold leading-tight tracking-tight text-[#1d1d1f]">{title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-[#6e6e73]">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
