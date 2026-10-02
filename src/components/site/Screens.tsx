"use client";

import { GAMES, SCREENS } from "./data";
import { GLYPH } from "./glyphs";
import { gsap, revealLines, useGsap } from "./motion";
import { useT } from "./i18n";

function Dial({ id, name, text }: { id: string; name: string; text: string }) {
  const { t } = useT();
  const [n, d] = t.screens.items[id] ?? [name, text];
  return (
    <li className="flex w-44 shrink-0 snap-center flex-col items-center text-center sm:w-52">
      <div className="grid h-36 w-36 place-items-center rounded-full border-[7px] border-[#f4efe9] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_60px_-20px_rgba(124,247,228,0.3)] sm:h-44 sm:w-44">
        <svg viewBox="0 0 100 100" className="h-3/4 w-3/4" aria-hidden="true">
          {GLYPH[id]}
        </svg>
      </div>
      <div className="mt-5 text-sm font-semibold">{n}</div>
      <div className="mt-1 text-xs leading-relaxed text-white/45">{d}</div>
    </li>
  );
}

export default function Screens() {
  const { t } = useT();
  const ref = useGsap<HTMLElement>((root, reduce) => {
    revealLines(root.querySelector("h2")!, reduce);
    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (reduce) return;
      const dist = () => track.scrollWidth - window.innerWidth + 64;
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("[data-pin]"),
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
  });

  return (
    <section ref={ref} id="screens" className="bg-night text-white">
      <div data-pin className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-neon">{t.screens.kicker}</p>
          <h2 className="mt-3 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
            {t.screens.title}
          </h2>
          <p className="mt-5 max-w-md text-white/55">
            {t.screens.text}
          </p>
        </div>
        <ul
          data-track
          className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 md:overflow-visible md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {SCREENS.map((s) => (
            <Dial key={s.id} {...s} />
          ))}
          <li className="flex w-40 shrink-0 flex-col justify-center border-l border-white/10 pl-8">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye">{t.screens.arcadeKicker}</span>
            <span className="mt-2 text-2xl font-semibold tracking-tight">{t.screens.arcade}</span>
          </li>
          {GAMES.map((g) => (
            <Dial key={g.id} {...g} />
          ))}
        </ul>
      </div>
    </section>
  );
}
