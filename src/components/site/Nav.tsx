"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { scrollToId } from "./SmoothScroll";
import { useT } from "./i18n";
import { pathFor } from "./paths";

export default function Nav({ home = true }: { home?: boolean }) {
  const { lang, t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const base = pathFor(lang);
  const otherHref = pathFor(lang === "bn" ? "en" : "bn");
  const isBn = lang === "bn";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!home) return;
    e.preventDefault();
    scrollToId(id);
  };
  const href = (id: string) => (home ? `#${id}` : `${base === "/" ? "" : base}/#${id}`);

  const links: [string, string][] = [
    ["moods", t.nav.moods],
    ["features", t.nav.features],
    ["screens", t.nav.screens],
    ["editions", t.nav.editions],
    ["download", isBn ? "অ্যাপ" : "App"],
    ["specs", t.nav.specs],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.08]"
          : "bg-white/0"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
        <Link href={base} aria-label="Maya by Xentoryx" className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
          Maya
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main Navigation">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={href(id)}
              onClick={go(id)}
              className="text-[12px] text-[#1d1d1f]/80 transition-colors hover:text-[#1d1d1f]"
            >
              {label}
            </a>
          ))}
          <Link
            href={pathFor(lang, "docs")}
            className="text-[12px] text-[#1d1d1f]/80 transition-colors hover:text-[#1d1d1f]"
          >
            {t.nav.guide}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={otherHref}
            hrefLang={isBn ? "en" : "bn"}
            className="text-[12px] text-[#1d1d1f]/80 hover:text-[#1d1d1f]"
            aria-label={t.nav.otherLabel}
            title={t.nav.otherLabel}
          >
            {isBn ? "EN" : "বাং"}
          </Link>
          <a
            href={href("order")}
            onClick={go("order")}
            className="rounded-full bg-[#0071e3] px-3.5 py-1 text-[12px] text-white transition-colors hover:bg-[#0077ed]"
          >
            {t.nav.order}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.open}
            className="flex h-8 w-8 items-center justify-center text-[#1d1d1f] md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 9h16M4 15h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/[0.06] bg-white px-6 pb-8 pt-4 md:hidden">
          <div className="flex flex-col">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={href(id)}
                onClick={go(id)}
                className="border-b border-black/[0.06] py-3 text-[22px] font-semibold tracking-tight text-[#1d1d1f]"
              >
                {label}
              </a>
            ))}
            <Link
              href={pathFor(lang, "docs")}
              className="py-3 text-[22px] font-semibold tracking-tight text-[#1d1d1f]"
            >
              {t.nav.guide}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
