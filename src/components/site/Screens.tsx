"use client";

import { useState } from "react";
import { GAMES, SCREENS } from "./data";
import { GLYPH } from "./glyphs";
import { useT } from "./i18n";

export default function Screens() {
  const { lang, t } = useT();
  const [activeId, setActiveId] = useState<string>("clock");
  const isBn = lang === "bn";

  const all = [...SCREENS, ...GAMES];
  const active = all.find((s) => s.id === activeId) ?? SCREENS[0];
  const [activeName, activeDesc] = t.screens.items[active.id] ?? [active.name, active.text];

  const Tile = ({ id, name }: { id: string; name: string }) => {
    const sel = id === activeId;
    return (
      <button
        type="button"
        onClick={() => setActiveId(id)}
        className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${sel ? "bg-[#1d1d1f]" : "hover:bg-[#1d1d1f]/60"}`}
      >
        <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-black ring-1 ${sel ? "ring-white/60" : "ring-white/15"}`}>
          <svg viewBox="0 0 100 100" className="h-7 w-7 text-white">{GLYPH[id]}</svg>
        </span>
        <span className={`max-w-full truncate text-[12px] ${sel ? "text-white" : "text-[#86868b]"}`}>{name}</span>
      </button>
    );
  };

  return (
    <section id="screens" className="bg-black px-4 py-14 text-[#f5f5f7] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1024px]">
        <div className="text-center">
          <p className="text-[17px] font-semibold text-[#86868b]">{isBn ? "১১টি স্ক্রিন · ৭টি গেম" : "11 screens · 7 games"}</p>
          <h2 className="headline mt-2">{t.screens.title}</h2>
          <p className="mx-auto mt-5 max-w-[640px] text-[19px] leading-relaxed text-[#86868b] sm:text-[21px]">{t.screens.text}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center">
            <div className="breathe flex aspect-square w-60 items-center justify-center rounded-full bg-black sm:w-72">
              <svg key={active.id} viewBox="0 0 100 100" className="pop h-2/3 w-2/3 text-white">{GLYPH[active.id]}</svg>
            </div>
            <h3 key={active.id} className="pop mt-8 text-[28px] font-semibold tracking-tight">{activeName}</h3>
            <p className="mt-2 max-w-sm text-[17px] text-[#86868b]">{activeDesc}</p>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-[14px] font-semibold text-[#86868b]">{isBn ? "স্ক্রিন" : "Screens"}</p>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                {SCREENS.map((s) => (
                  <Tile key={s.id} id={s.id} name={s.name} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[14px] font-semibold text-[#86868b]">{t.screens.arcade}</p>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                {GAMES.map((g) => (
                  <Tile key={g.id} id={g.id} name={g.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
