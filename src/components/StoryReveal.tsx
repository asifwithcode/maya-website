"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LINES = [
  "Every MAYA wakes up with the same expression as the one on your screen.",
  "Two soft pink eyes on a quiet black face — the same look, off the display and in your hand.",
  "The head on top is the only thing that ever changes.",
];

export default function StoryReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
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
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=120%",
          scrub: 0.4,
          pin: true,
        },
      });

      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { opacity: 1, duration: 1 }, i === 0 ? 0 : "+=0.3");
      });
    }, container);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-bg-2"
    >
      <Image
        src="/images/panda.jpg"
        alt=""
        fill
        aria-hidden
        className="scale-110 object-cover opacity-20 blur-2xl"
      />
      <div className="relative mx-auto max-w-2xl px-6 text-center sm:px-10">
        {LINES.map((line, i) => (
          <p
            key={line}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="mb-6 text-2xl font-semibold leading-snug tracking-tight text-ink last:mb-0 sm:text-[2.1rem]"
            style={{ opacity: reduceMotion ? 1 : 0.12 }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
