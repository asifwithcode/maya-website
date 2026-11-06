"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap, useGsap } from "./motion";
import { scrollToId } from "./SmoothScroll";
import type { LookId } from "./three/mayaModel";
import { takaFor, useT } from "./i18n";
import { useContent } from "./content";

const MayaCanvas = dynamic(() => import("./three/MayaCanvas"), { ssr: false });

const LOOKS: { id: LookId; label: string; swatch: string }[] = [
  { id: "plain", label: "Classic", swatch: "#ece9e2" },
  { id: "headphones", label: "Beats", swatch: "#d65680" },
  { id: "bunny", label: "Bunny", swatch: "#f6c1cc" },
  { id: "panda", label: "Panda", swatch: "#1b1718" },
  { id: "crown", label: "Royal", swatch: "#e8b42c" },
  { id: "sprout", label: "Sprout", swatch: "#6baf5b" },
  { id: "backpack", label: "Explorer", swatch: "#c9d8ec" },
];

export default function Hero() {
  const { lang, t } = useT();
  const { pricing } = useContent();
  const isBn = lang === "bn";
  const [selectedLook, setSelectedLook] = useState<LookId>("plain");
  const progress = useRef(0);
  const lookLabel = t.hero.looks[selectedLook as keyof typeof t.hero.looks] ?? selectedLook;
  const current = LOOKS.find((l) => l.id === selectedLook) ?? LOOKS[0];

  const ref = useGsap<HTMLElement>((root, reduce) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: reduce ? false : 0.8,
        onUpdate: (s) => {
          progress.current = reduce ? 0 : s.progress;
        },
      },
    });
  });

  return (
    <section ref={ref} id="top" className="relative w-full overflow-hidden bg-white px-4 pt-20 pb-12 text-center sm:pt-24">
      {/* soft accent glow behind the product */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: `radial-gradient(circle, ${current.swatch}55 0%, transparent 65%)`, transition: "background 0.6s ease" }}
      />

      <div className="hero-in relative flex flex-col items-center">
        <p className="text-[17px] font-semibold text-[#bf4800] sm:text-[19px]">{isBn ? "নতুন" : "New"}</p>
        <h1 className="text-shine mt-1 text-[56px] font-semibold leading-none tracking-[-0.03em] sm:text-[80px] md:text-[96px]">
          Maya
        </h1>
        <p className="mt-3 max-w-xl text-[21px] leading-snug text-[#1d1d1f] sm:text-[24px] md:text-[28px]">
          {isBn ? "জীবন্ত মুখের ছোট্ট ডেস্ক রোবট।" : "A tiny desk robot with a living face."}
        </p>
        <p className="mt-2 text-[15px] text-[#6e6e73] sm:text-[17px]">
          {isBn ? `${takaFor(lang, pricing.maya)} থেকে শুরু` : `From ${takaFor(lang, pricing.maya)}`}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={() => scrollToId("order")} className="btn-primary transition-transform hover:scale-[1.04] active:scale-95">
            {t.nav.order}
          </button>
          <button type="button" onClick={() => scrollToId("moods")} className="link-more group">
            {isBn ? "আরও জানুন" : "Learn more"} <span aria-hidden className="transition-transform group-hover:translate-x-1">›</span>
          </button>
        </div>

        <div className="mt-2 aspect-square w-[min(520px,90vw,44svh)]">
          <div className="float h-full w-full">
            <MayaCanvas look={selectedLook} progress={progress} className="h-full w-full" />
          </div>
        </div>

        {/* Look picker with names */}
        <div>
          <p key={selectedLook} className="pop mb-3 text-[17px] font-semibold text-[#1d1d1f]">
            {lookLabel}
            <span className="ml-2 text-[14px] font-normal text-[#6e6e73]">{isBn ? "এডিশন" : "Edition"}</span>
          </p>
          <div className="flex max-w-[680px] flex-wrap items-center justify-center gap-2">
            {LOOKS.map((l) => {
              const sel = selectedLook === l.id;
              const name = t.hero.looks[l.id as keyof typeof t.hero.looks] ?? l.label;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLook(l.id)}
                  aria-pressed={sel}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[13px] transition-all duration-300 ${
                    sel
                      ? "border-[#0071e3] bg-[#0071e3]/[0.06] text-[#1d1d1f] shadow-[0_0_0_1px_#0071e3]"
                      : "border-[#d2d2d7] text-[#6e6e73] hover:border-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform duration-300 ${sel ? "scale-110" : ""}`}
                    style={{ backgroundColor: l.swatch }}
                  />
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
