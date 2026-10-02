"use client";

import { gsap, SplitText, useGsap } from "./motion";
import { useT } from "./i18n";

export default function Manifesto() {
  const { t } = useT();
  const ref = useGsap<HTMLElement>((root, reduce) => {
    if (reduce) return;
    const split = SplitText.create(root.querySelector("p")!, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 55%", scrub: true },
      },
    );
  });

  return (
    <section ref={ref} className="bg-paper px-5 py-32 sm:px-8 md:py-48">
      <p className="mx-auto max-w-5xl text-[2rem] font-medium leading-[1.12] [&:lang(bn)]:leading-[1.4] tracking-[-0.03em] sm:text-5xl md:text-[4.1rem]">
        {t.manifesto.text} <span className="font-bangla text-eye-deep">{t.manifesto.accent}</span>
        {t.manifesto.end}
      </p>
    </section>
  );
}
