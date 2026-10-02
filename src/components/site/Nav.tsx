"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { scrollToId } from "./SmoothScroll";
import { useT } from "./i18n";

const LINKS = ["moods", "features", "screens", "editions", "specs"] as const;

function ThemeToggle() {
  const { t } = useT();
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
  };
  // the icon follows data-theme through CSS, so server and client render the same markup
  return (
    <button
      type="button"
      onClick={toggle}
      className="group grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
    >
      <span className="sr-only dark:hidden">{t.nav.toDark}</span>
      <span className="sr-only hidden dark:inline">{t.nav.toLight}</span>
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden h-[18px] w-[18px] dark:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}

export default function Nav({ home = true }: { home?: boolean }) {
  const { lang, t } = useT();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const base = lang === "bn" ? "/bn" : "/";
  const otherHref = lang === "bn" ? "/" : "/bn";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 400 && y > last.current + 4);
      if (y < last.current - 4) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!home) return;
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };
  const href = (id: string) => (home ? `#${id}` : `${base === "/" ? "" : base}/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      } ${solid || open ? "border-b border-ink/[0.06] bg-paper/75 backdrop-blur-xl" : "border-b border-transparent"}`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={base} className="flex items-baseline gap-2" aria-label="Maya">
          <span className="font-script text-2xl leading-none">maya</span>
          <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-faint sm:inline">by Xentoryx</span>
        </Link>

        <ul className="hidden items-center gap-7 text-[0.85rem] text-ink-soft md:flex">
          {LINKS.map((id) => (
            <li key={id}>
              <a href={href(id)} onClick={go(id)} className="transition-colors hover:text-ink">
                {t.nav[id]}
              </a>
            </li>
          ))}
          <li>
            <Link href="/docs" className="transition-colors hover:text-ink">
              {t.nav.guide}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-1">
          <Link
            href={otherHref}
            hrefLang={lang === "bn" ? "en" : "bn"}
            aria-label={t.nav.otherLabel}
            className={`grid h-9 min-w-9 place-items-center rounded-full px-2.5 text-[0.8rem] font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink ${
              lang === "en" ? "font-bangla" : ""
            }`}
          >
            {t.nav.other}
          </Link>
          <ThemeToggle />
          <a
            href={href("reserve")}
            onClick={go("reserve")}
            className="ml-1 rounded-full bg-ink px-4 py-2 text-[0.8rem] font-medium text-paper transition hover:bg-eye-deep hover:text-white"
          >
            {t.nav.reserve}
          </a>
          <button
            type="button"
            aria-label={open ? t.nav.close : t.nav.open}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-ink transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[1.5px] w-5 bg-ink transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-ink/[0.06] px-5 pb-6 pt-2 md:hidden">
          {LINKS.map((id) => (
            <li key={id}>
              <a href={href(id)} onClick={go(id)} className="block py-3 text-2xl font-medium tracking-tight">
                {t.nav[id]}
              </a>
            </li>
          ))}
          <li>
            <Link href="/docs" className="block py-3 text-2xl font-medium tracking-tight">
              {t.nav.guide}
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
