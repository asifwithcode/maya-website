"use client";

import { useState } from "react";
import MayaFace from "./MayaFace";
import { MOODS } from "./data";
import { useT } from "./i18n";

export default function Moods() {
  const { lang, t } = useT();
  const [i, setI] = useState(0);
  const [pokes, setPokes] = useState(0);
  const mood = MOODS[i];
  const isBn = lang === "bn";

  const handleTap = () => {
    const n = pokes + 1;
    setPokes(n);
    const target = n % 3 === 0 ? "annoyed" : n % 5 === 0 ? "dizzy" : "happy";
    const idx = MOODS.findIndex((m) => m.id === target);
    if (idx >= 0) setI(idx);
  };

  return (
    <section id="moods" className="bg-black px-6 py-14 text-[#f5f5f7] sm:py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <p className="text-[17px] font-semibold text-[#86868b]">{isBn ? "পার্সোনালিটি" : "Personality"}</p>
        <h2 className="headline mt-2">{t.moods.title}</h2>
        <p className="mx-auto mt-5 max-w-[640px] text-[19px] leading-relaxed text-[#86868b] sm:text-[21px]">
          {t.moods.text}
        </p>

        <div className="mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={handleTap}
            aria-label={isBn ? "মায়াকে ট্যাপ করুন" : "Tap Maya"}
            className="breathe relative aspect-square w-64 overflow-hidden rounded-full bg-black transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:w-80"
          >
            <MayaFace mood={mood.id} className="h-full w-full p-6" />
          </button>
          <p className="mt-6 text-[14px] text-[#86868b]">
            {isBn ? "মুখে ট্যাপ করে দেখুন।" : "Tap her face and see what happens."}
          </p>

          <p key={mood.id} className="pop mt-8 min-h-[4.5rem] whitespace-pre-line font-bangla text-[26px] font-semibold leading-snug text-white sm:text-[32px]">
            &ldquo;{mood.line}&rdquo;
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {MOODS.map((m, k) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setI(k)}
                className={`rounded-full px-4 py-2 text-[14px] transition-all duration-300 active:scale-95 ${
                  k === i ? "scale-105 bg-[#f5f5f7] text-black" : "bg-[#1d1d1f] text-[#f5f5f7] hover:bg-[#2d2d2f]"
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
