"use client";

import Image from "next/image";
import { useState } from "react";
import { gsap, useGsap } from "./motion";
import { scrollToId } from "./SmoothScroll";
import { takaFor, useT } from "./i18n";
import { useContent } from "./content";

/* Scroll story modelled on Apple's Vision Pro page: a full-bleed sticky hero,
   a word-by-word highlight statement, an image that grows to full screen,
   and a pinned edition gallery that cross-fades as you scroll. */

const IMG = (name: string) => `/images/hero/maya-${name}.jpg`;
const BG = "#e6e1dd"; // average photo backdrop; .maya-photo masks the edges into it

/** The product photo, smaller than the frame with feathered edges.
    Phones: a band across the top with the copy below it. Desktop: the robot sits on the right. */
function Photo({ name, alt = "", priority }: { name: string; alt?: string; priority?: boolean }) {
  return (
    <div className="maya-photo absolute inset-x-0 top-[14svh] h-[46svh] md:inset-0 md:h-auto">
      <Image src={IMG(name)} alt={alt} fill priority={priority} sizes="100vw" className="object-cover object-[79%_50%] md:object-center" />
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

export function VisionHero() {
  const { lang, t } = useT();
  const { pricing } = useContent();
  const isBn = lang === "bn";

  const ref = useGsap<HTMLElement>((root, reduce) => {
    const img = root.querySelector(".vh-img");
    const letters = root.querySelectorAll(".vh-letter");
    const fades = root.querySelectorAll(".vh-fade");

    // intro: photo settles in, title letters rise, copy follows
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (reduce) {
      intro.set([img, letters, fades], { opacity: 1 });
      return;
    }
    intro
      .fromTo(img, { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2 })
      .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.5)
      .fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.9);

    // scroll: hero stays pinned while the photo pushes in and the copy lifts away
    gsap
      .timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
      })
      .to(img, { scale: 1.12, ease: "none" }, 0)
      .to(".vh-copy", { y: -80, opacity: 0, ease: "power1.in" }, 0)
      .to(".vh-veil", { opacity: 1, ease: "none" }, 0.4);
  });

  return (
    <section ref={ref} id="top" className="relative h-[180vh]" style={{ background: BG }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="vh-img absolute inset-0 opacity-0 will-change-transform">
          <Photo name="plain" alt={isBn ? "মায়া ডেস্ক রোবট" : "Maya desk robot"} priority />
        </div>
        {/* white veil fades in as you scroll into the next section */}
        <div className="vh-veil pointer-events-none absolute inset-0 bg-white opacity-0" />

        <div className="vh-copy absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-10 sm:pb-14 lg:px-[6vw]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <h1>
                <span className="vh-fade block text-[15px] font-semibold text-[#bf4800] opacity-0 sm:text-[17px]">
                  {isBn ? "স্মার্ট ডেস্ক কম্প্যানিয়ন রোবট" : "Smart Desk Companion Robot"}
                </span>{" "}
                <span className="flex overflow-hidden pb-1 text-[56px] font-semibold leading-[0.95] tracking-[-0.04em] text-[#1d1d1f] sm:text-[96px] lg:text-[128px]">
                  {"Maya".split("").map((c, i) => (
                    <span key={i} className="vh-letter inline-block">
                      {c}
                    </span>
                  ))}
                </span>
              </h1>
              <p className="vh-fade mt-2 max-w-[600px] text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f] opacity-0 sm:text-[24px] lg:text-[28px]">
                {isBn
                  ? "জীবন্ত মুখ, আটটা মুড আর বাংলা চিরকুট — আপনার ডেস্কের নতুন বন্ধু।"
                  : "A living face, eight moods and little Bangla notes. Your desk's new friend."}
              </p>
            </div>

            <div className="vh-fade flex shrink-0 items-center gap-3 opacity-0">
              <button
                type="button"
                onClick={() => scrollToId("story")}
                className="rounded-full border border-[#1d1d1f] px-5 py-2.5 text-[15px] text-[#1d1d1f] sm:px-6 sm:py-3 sm:text-[17px] transition-colors hover:bg-[#1d1d1f] hover:text-white"
              >
                {isBn ? "আরও জানুন" : "Learn more"}
              </button>
              <button
                type="button"
                onClick={() => scrollToId("order")}
                className="rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[15px] font-semibold sm:px-6 sm:py-3 sm:text-[17px] text-white transition-transform hover:scale-[1.04] active:scale-95"
              >
                {t.nav.order}
              </button>
            </div>
          </div>
          <p className="vh-fade mt-4 text-[13px] sm:mt-6 sm:text-[14px] text-[#6e6e73] opacity-0">
            {isBn ? `${takaFor(lang, pricing.maya)} থেকে শুরু · ক্যাশ অন ডেলিভারি` : `From ${takaFor(lang, pricing.maya)} · Cash on delivery`}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Word highlight statement ───────────────────── */

export function VisionStatement() {
  const { lang } = useT();
  const isBn = lang === "bn";
  const text = isBn
    ? "মায়া স্ক্রিনের কোনো অ্যাপ নয়। এটা একটা ছোট্ট, নরম বন্ধু যে আপনার ডেস্কে বসে থাকে — পলক ফেলে, তাকায়, মন খারাপ হলে বোঝে, আর ঘরের ভাষায় দু'কথা বলে।"
    : "Maya isn't an app on a screen. It's a small, soft companion that lives on your desk — it blinks, it glances, it notices your mood, and it speaks to you in the language of home.";

  const ref = useGsap<HTMLElement>((root, reduce) => {
    const words = root.querySelectorAll(".vs-word");
    if (reduce) {
      gsap.set(words, { opacity: 1 });
      return;
    }
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: root.querySelector("p"), start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  }, [lang]);

  return (
    <section ref={ref} id="story" data-no-reveal className="bg-white px-6 py-[16vh]">
      <p className="mx-auto max-w-[980px] text-[32px] font-semibold leading-[1.18] tracking-[-0.022em] text-[#1d1d1f] sm:text-[48px] lg:text-[56px]">
        {text.split(" ").map((w, i) => (
          <span key={i} className="vs-word opacity-[0.14]">
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}

/* ───────────────────── Image that grows to full screen ───────────────────── */

export function VisionExpand() {
  const { lang } = useT();
  const isBn = lang === "bn";

  const ref = useGsap<HTMLElement>((root, reduce) => {
    if (reduce) return;
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(".ve-frame", { clipPath: "inset(18% 22% 18% 22% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 })
      .fromTo(".ve-img", { scale: 1.12 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(".ve-cap", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, 0.7)
      .to({}, { duration: 0.4 });
  });

  return (
    <section ref={ref} data-no-reveal className="relative h-[260vh] bg-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="ve-frame absolute inset-0 will-change-[clip-path]" style={{ background: BG }}>
          <div className="ve-img absolute inset-0">
            <Photo name="backpack" />
          </div>
          <div className="ve-cap absolute bottom-10 left-5 right-5 max-w-[440px] opacity-0 sm:left-10 md:bottom-auto md:right-auto md:top-1/2 md:-translate-y-1/2 lg:left-[6vw]">
            <p className="text-[17px] font-semibold text-[#bf4800]">{isBn ? "ছোট্ট, কিন্তু জীবন্ত" : "Small, but alive"}</p>
            <h2 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] sm:text-[56px] lg:text-[64px]">
              {isBn ? "হাতের মুঠোয় একটা ব্যক্তিত্ব।" : "A personality you can hold."}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#424245] sm:mt-4 sm:text-[19px]">
              {isBn
                ? "নরম টেক্সচারের শরীর, গোল জীবন্ত মুখ আর পিঠে ছোট্ট ব্যাকপ্যাক। ৪০ fps-এর চোখ সারাদিন পলক ফেলে, এদিক-ওদিক তাকায়।"
                : "A soft textured body, a round living face, and a tiny backpack. Smooth 40 fps eyes blink, glance and drift all day long."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Pinned edition gallery ───────────────────── */

const LOOKS = [
  { id: "crown", en: ["Royal", "For the one who rules the desk."], bn: ["রয়্যাল", "যে ডেস্কের রাজা, তার জন্য।"] },
  { id: "sprout", en: ["Sprout", "A little leaf of calm for growing minds."], bn: ["স্প্রাউট", "বেড়ে ওঠা মনের জন্য এক টুকরো সবুজ।"] },
  { id: "panda", en: ["Panda", "Black ears, soft heart."], bn: ["পান্ডা", "কালো কান, নরম মন।"] },
  { id: "bunny", en: ["Bunny", "Tall ears that hear everything."], bn: ["বানি", "লম্বা কান, সব শোনে।"] },
  { id: "headphones", en: ["Beats", "Always in the mood for music."], bn: ["বিটস", "সবসময় গানের মুডে।"] },
] as const;

export function VisionEditions() {
  const { lang } = useT();
  const isBn = lang === "bn";
  const [active, setActive] = useState(0);
  const n = LOOKS.length;

  const ref = useGsap<HTMLElement>((root, reduce) => {
    const slides = gsap.utils.toArray<HTMLElement>(".vg-slide", root);
    const caps = gsap.utils.toArray<HTMLElement>(".vg-cap", root);
    gsap.set(slides.slice(1), { opacity: 0 });
    gsap.set(caps.slice(1), { opacity: 0, y: 30 });
    if (reduce) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (s) => setActive(Math.min(n - 1, Math.floor(s.progress * n))),
      },
    });
    gsap.fromTo(root.querySelector(".vg-title"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    slides.forEach((slide, i) => {
      tl.fromTo(slide.querySelector(".vg-zoom"), { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, i);
      if (i === 0) return;
      tl.to(slides[i - 1], { opacity: 0, duration: 0.4 }, i - 0.2)
        .fromTo(slide, { opacity: 0 }, { opacity: 1, duration: 0.4 }, i - 0.2)
        .to(caps[i - 1], { opacity: 0, y: -30, duration: 0.3 }, i - 0.2)
        .fromTo(caps[i], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, i - 0.05);
    });
  });

  return (
    <section ref={ref} id="looks" data-no-reveal className="relative bg-white" style={{ height: `${n * 90 + 60}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: BG }}>
        {LOOKS.map((l, i) => (
          <div key={l.id} className="vg-slide absolute inset-0">
            <div className="vg-zoom absolute inset-0">
              <Photo name={l.id} alt={isBn ? l.bn[0] : l.en[0]} priority={i === 0} />
            </div>
          </div>
        ))}

        <div className="absolute left-5 top-[63svh] sm:left-10 md:top-[16vh] lg:left-[6vw]">
          <p className="vg-title text-[15px] font-semibold text-[#6e6e73] sm:text-[17px]">{isBn ? "একটা মায়া, অনেক রূপ" : "One Maya. Many looks."}</p>
        </div>

        <div className="absolute bottom-16 left-5 h-[140px] w-[min(520px,88vw)] sm:left-10 md:bottom-auto md:top-1/2 md:h-[220px] md:-translate-y-1/2 lg:left-[6vw]">
          {LOOKS.map((l) => {
            const [name, line] = isBn ? l.bn : l.en;
            return (
              <div key={l.id} className="vg-cap absolute inset-0">
                <h3 className="text-[44px] font-semibold leading-none tracking-[-0.035em] text-[#1d1d1f] sm:text-[72px] lg:text-[88px]">{name}</h3>
                <p className="mt-3 text-[17px] leading-snug text-[#424245] sm:mt-4 sm:text-[22px] lg:text-[24px]">{line}</p>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-8 left-5 flex gap-2 sm:bottom-10 sm:left-10 lg:left-[6vw]" aria-hidden>
          {LOOKS.map((l, i) => (
            <span
              key={l.id}
              className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#1d1d1f]" : "w-2 bg-[#1d1d1f]/25"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
