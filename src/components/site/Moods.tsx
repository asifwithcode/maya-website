"use client";

import { useState } from "react";
import MayaFace from "./MayaFace";
import { MOODS } from "./data";
import { gsap, ScrollTrigger, useGsap } from "./motion";
import { useT } from "./i18n";

export default function Moods() {
  const { t } = useT();
  const [i, setI] = useState(0);
  const mood = MOODS[i];

  const ref = useGsap<HTMLElement>((root, reduce) => {
    gsap.from(root.querySelector("[data-face]"), {
      scale: 0.7,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: root, start: "top 70%" },
    });
    if (reduce) return;
    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: `+=${MOODS.length * 55}%`,
      pin: true,
      onUpdate: (s) => setI(Math.min(MOODS.length - 1, Math.floor(s.progress * MOODS.length))),
    });
  });

  return (
    <section ref={ref} id="moods" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-white">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1fr] md:gap-20 md:py-24">
        <div data-face className="relative mx-auto aspect-square w-[min(56vw,30rem)] md:w-[min(78vw,30rem)]">
          <div className="absolute inset-[-6%] rounded-full bg-eye/20 blur-3xl" />
          <div className="relative h-full w-full rounded-full border-[14px] border-[#f4efe9] shadow-[0_40px_120px_-30px_rgba(225,137,155,0.45)]">
            <MayaFace mood={mood.id} className="h-full w-full" />
          </div>
        </div>

        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye">{t.moods.kicker}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-6xl">{t.moods.title}</h2>
          <p className="mt-4 hidden max-w-md text-white/55 sm:block">
            {t.moods.text}
          </p>

          <div className="mt-6 flex items-baseline gap-4 sm:mt-12">
            <span className="font-mono text-sm text-white/40">
              {String(i + 1).padStart(2, "0")} / {String(MOODS.length).padStart(2, "0")}
            </span>
            <span key={mood.id} className="animate-[moodIn_.6s_cubic-bezier(.16,1,.3,1)] text-5xl font-semibold tracking-tight sm:text-7xl">
              {t.moods.labels[mood.id] ?? mood.label}
            </span>
          </div>
          <p key={mood.bn} className="mt-4 animate-[moodIn_.6s_.05s_cubic-bezier(.16,1,.3,1)_both] whitespace-pre-line font-bangla text-xl text-white/70">
            {mood.line}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5 sm:mt-10" role="tablist" aria-label={t.nav.moods}>
            {MOODS.map((m, k) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={k === i}
                onClick={() => setI(k)}
                className={`rounded-full px-3.5 py-1.5 text-[0.8rem] transition ${
                  k === i ? "bg-white text-[#1d1d1f]" : "bg-white/[0.06] text-white/60 hover:bg-white/10"
                }`}
              >
                {t.moods.labels[m.id] ?? m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
