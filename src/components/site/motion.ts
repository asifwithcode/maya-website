"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs GSAP code scoped to the returned ref and reverts everything on unmount. */
export function useGsap<T extends HTMLElement = HTMLElement>(
  setup: (root: T, reduce: boolean) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);
  useIsoLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const ctx = gsap.context(() => setup(root, prefersReducedMotion()), root);
    return () => ctx.revert();
  }, deps);
  return ref;
}

/** Fade-up for every [data-reveal] child, staggered per group. */
export function revealChildren(root: HTMLElement, reduce: boolean) {
  if (reduce) return;
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
    gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 82%" },
    });
  });
}

/** Headline lines slide up from a mask. */
export function revealLines(el: HTMLElement, reduce: boolean, vars: gsap.TweenVars = {}) {
  if (reduce) return;
  const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.2,
    ease: "expo.out",
    stagger: 0.1,
    scrollTrigger: { trigger: el, start: "top 85%" },
    ...vars,
  });
}
