"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap, SplitText, useGsap } from "./motion";
import { scrollToId } from "./SmoothScroll";
import type { LookId } from "./three/mayaModel";
import { useT } from "./i18n";

const MayaCanvas = dynamic(() => import("./three/MayaCanvas"), { ssr: false });

const LOOK_CHIPS: [LookId, string][] = [
  ["plain", "#f3f1ee"],
  ["bunny", "#f6c1cc"],
  ["panda", "#1b1718"],
  ["crown", "#e8b42c"],
  ["sprout", "#6baf5b"],
  ["headphones", "#d65680"],
  ["backpack", "#f6c1cc"],
];

export default function Hero() {
  const { t } = useT();
  const [look, setLook] = useState<LookId>("plain");
  const progress = useRef(0);

  const ref = useGsap<HTMLElement>((root, reduce) => {
    const word = root.querySelector<HTMLElement>("[data-word]")!;
    const split = SplitText.create(word, { type: "chars" });
    if (!reduce) {
      gsap.from(split.chars, { yPercent: 60, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.07, delay: 0.15 });
      gsap.from(root.querySelectorAll("[data-intro]"), { y: 24, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.55 });
      gsap.from(root.querySelector("[data-stage]"), { opacity: 0, scale: 0.94, duration: 1.8, ease: "expo.out", delay: 0.1 });
    }
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: reduce ? false : 0.8,
          onUpdate: (s) => (progress.current = reduce ? 0 : s.progress),
        },
      })
      .fromTo(split.chars, { xPercent: 0, opacity: 1 }, { xPercent: (i) => (i - 1.5) * 38, opacity: 0.25, ease: "none", immediateRender: false }, 0)
      .fromTo(root.querySelectorAll("[data-fade]"), { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: "none", immediateRender: false }, 0)
      .to(root.querySelector("[data-caption]"), { opacity: 1, y: 0, ease: "none" }, 0.45);
  });

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-paper">
      <h1 className="sr-only">{t.hero.srTitle}</h1>
      <div
        data-word
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[15%] select-none whitespace-nowrap text-center font-script text-[33vw] leading-[0.9] text-blush/55 md:top-[14%] md:text-[30vw] dark:text-blush/[0.16]"
      >
        maya
      </div>

      <div data-stage className="absolute inset-x-0 bottom-[40%] top-[9%] md:bottom-[6%] md:top-[6%]">
        <MayaCanvas look={look} progress={progress} className="h-full w-full" />
      </div>

      <p
        data-caption
        className="pointer-events-none absolute inset-x-0 bottom-[30%] translate-y-6 md:bottom-[12%] text-center text-lg font-medium tracking-tight text-ink opacity-0 md:text-2xl"
      >
        {t.hero.caption}
      </p>

      <div data-fade className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 md:pb-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <p data-intro className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">
              {t.hero.kicker}
            </p>
            <p data-intro className="mt-3 text-[1.35rem] font-medium leading-snug tracking-tight sm:text-2xl">
              {t.hero.line}
            </p>
            <div data-intro className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => scrollToId("reserve")}
                className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-eye-deep hover:text-white"
              >
                {t.hero.reserve}
              </button>
              <button
                type="button"
                onClick={() => scrollToId("moods")}
                className="rounded-full border border-ink/15 px-5 py-3 text-sm font-medium transition hover:border-ink/40"
              >
                {t.hero.moods}
              </button>
            </div>
          </div>

          <div data-intro>
            <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-faint">{t.hero.dress}</p>
            <div className="flex flex-wrap gap-1.5 md:justify-end" role="radiogroup" aria-label={t.hero.dress}>
              {LOOK_CHIPS.map(([id, sw]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={look === id}
                  onClick={() => setLook(id)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition ${
                    look === id ? "border-ink bg-ink text-paper" : "border-ink/10 bg-card/70 hover:border-ink/30"
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: sw }} />
                  {t.hero.looks[id]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
