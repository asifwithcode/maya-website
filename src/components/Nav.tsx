"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "gallery", label: "The Five" },
  { id: "craft", label: "Craft" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export default function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-ink/10 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-10">
        <a href="#top" className="font-script text-2xl font-normal text-ink">
          maya
        </a>
        <div className="hidden gap-8 text-[0.9rem] font-medium sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`transition-colors ${
                active === l.id ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#preorder"
          className="whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[0.85rem] font-medium text-white transition-opacity hover:opacity-80"
        >
          Reserve
        </a>
      </div>
    </nav>
  );
}
