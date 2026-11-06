"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import { useLightbox } from "./Lightbox";

const VARIANTS = [
  {
    n: "01",
    id: "CLASSIC",
    name: "Classic",
    src: "/images/classic.jpg",
    alt: "Classic MAYA, bare head, sitting on a wooden desk",
    desc: "No topper, no costume — just the face. The one most people reach for first, and the one every other head is built around.",
    tags: ["Bare head", "Most popular"],
  },
  {
    n: "02",
    id: "FOCUS",
    name: "Focus",
    src: "/images/focus.jpg",
    alt: "MAYA wearing tiny grey over-ear headphones",
    desc: "Tiny over-ear headphones, permanently on. For the desk that's mid-Pomodoro and doesn't want to be disturbed.",
    tags: ["Headphones", "Deep work"],
  },
  {
    n: "03",
    id: "HOPPER",
    name: "Hopper",
    src: "/images/hopper.jpg",
    alt: "MAYA wearing soft bunny ears",
    desc: "Long ears, blush-lined, standing straight up like it heard something exciting three rooms away.",
    tags: ["Bunny ears", "Limited"],
  },
  {
    n: "04",
    id: "PANDA",
    name: "Panda",
    src: "/images/panda.jpg",
    alt: "MAYA wearing round black panda ears",
    desc: "Round black ears and the same unbothered expression underneath. Built for sitting very still and looking very content.",
    tags: ["Panda ears", "Fan favorite"],
  },
  {
    n: "05",
    id: "SPROUT",
    name: "Sprout",
    src: "/images/sprout.jpg",
    alt: "MAYA with a small green sprout on top of its head",
    desc: "A single leaf, just unfurling. The one people put next to a new plant, a new job, or a desk that just got moved somewhere better.",
    tags: ["Sprout", "New beginnings"],
  },
];

export default function HorizontalGallery() {
  const { open } = useLightbox();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;
      // Pin below the sticky nav, not flush at the very top of the viewport -
      // otherwise the nav's translucent/blurred bar sits over the top slice
      // of whatever is pinned underneath it for the whole scroll.
      const getNavOffset = () =>
        document.querySelector("nav")?.getBoundingClientRect().height ?? 64;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: () => `top top+=${getNavOffset()}`,
          end: () => `+=${getDistance()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      gsap.utils.toArray<HTMLElement>(".gallery-panel").forEach((panel) => {
        gsap.fromTo(
          panel,
          { scale: 0.92, opacity: 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 85%",
              end: "left 45%",
              scrub: true,
            },
          }
        );
      });

      return () => tween.kill();
    }, container);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <>
      {/* Heading lives in normal document flow, entirely separate from the
          pinned track below - it never has to compete with the cards for
          vertical room, so it can never overlap them. */}
      <div id="gallery" className="scroll-mt-20 bg-bg-2 pb-14 pt-24 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal>
            <span className="mb-2 block text-base font-medium text-ink-faint">The Lineup</span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Take a closer look.</h2>
          </Reveal>
        </div>
      </div>

      {reduceMotion ? (
        <div className="bg-bg-2 pb-24 sm:pb-32">
          <div className="flex gap-6 overflow-x-auto px-6 pb-4 sm:px-10 [scrollbar-width:thin]">
            {VARIANTS.map((v) => (
              <Panel key={v.id} v={v} onZoom={() => open(v.src, v.alt)} />
            ))}
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative overflow-hidden bg-bg-2 pb-16 pt-8 sm:pb-20 sm:pt-10">
          <div
            ref={trackRef}
            className="flex w-max gap-10 pl-6 pr-[24vw] sm:pl-10
                       lg:pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
          >
            {VARIANTS.map((v) => (
              <Panel key={v.id} v={v} onZoom={() => open(v.src, v.alt)} />
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-6xl px-6 sm:px-10">
            <div className="h-[2px] w-full bg-ink/10">
              <div
                className="h-full bg-eye transition-[width] duration-100"
                style={{ width: `${Math.max(4, progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Panel({
  v,
  onZoom,
}: {
  v: (typeof VARIANTS)[number];
  onZoom: () => void;
}) {
  return (
    <div className="gallery-panel flex w-[80vw] flex-shrink-0 flex-col text-left sm:w-[46vw] md:w-[34vw] lg:w-[26vw]">
      <div
        onClick={onZoom}
        className="group aspect-square w-full cursor-zoom-in overflow-hidden rounded-[28px] bg-bg p-3"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={v.src}
            alt={v.alt}
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        </div>
      </div>
      <span className="mt-5 block text-sm text-ink-faint">No. {v.n}</span>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">{v.name}</h3>
      <p className="mt-3 max-w-[32ch] text-base leading-relaxed text-ink-soft">{v.desc}</p>
      <p className="mt-3 text-sm text-ink-faint">{v.tags.join(" · ")}</p>
    </div>
  );
}
