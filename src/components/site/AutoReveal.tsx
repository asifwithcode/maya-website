"use client";

import { useEffect } from "react";

/** Adds a staggered fade-up to headings, intros and grid items in every section below the hero. */
export default function AutoReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const picked = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main section:not(#top):not([data-no-reveal]) :is(h2, h2 + p, .headline + p, .grid > *, dl > div, ul > li, form > *, [data-reveal])",
      ),
    );
    const set = new Set(picked);
    const els = picked.filter((el) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("rv-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      const i = Math.max(0, siblings.indexOf(el));
      el.style.setProperty("--rv-d", `${Math.min(i, 6) * 80}ms`);
      el.classList.add("rv");
      const done = (ev: TransitionEvent) => {
        if (ev.target !== el || !el.classList.contains("rv-in")) return;
        el.classList.remove("rv", "rv-in");
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
