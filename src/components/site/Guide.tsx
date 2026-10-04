"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MayaFace from "./MayaFace";
import { GLYPH } from "./glyphs";
import { MOODS } from "./data";
import { bnDigits, useT } from "./i18n";
import { GUIDE, type Gesture, type Pad } from "./guide-content";

// The Maya art (public/showcase/art/maya-plain.svg) is drawn in a -110 -76 220 336 box.
// Positions below are that geometry as percentages, so overlays sit on the drawing.
const ART = "/showcase/art/maya-plain.svg";
const SCREEN = { left: "27.95%", top: "28.42%", width: "44.09%" }; // display circle r 48.5 at (0, 68)
const PADS: Record<Pad, { left: string }> = { T1: { left: "20.9%" }, T2: { left: "62.7%" } }; // foot pads, 36 × 22

function num(lang: string, n: number) {
  const s = String(n).padStart(2, "0");
  return lang === "bn" ? bnDigits(s) : s;
}

function PadChip({ pad }: { pad: Pad }) {
  return (
    <span
      className={`inline-flex h-6 min-w-9 items-center justify-center rounded-full px-2 font-mono text-[0.72rem] font-semibold ${
        pad === "T1" ? "bg-eye text-white" : "bg-ink text-paper"
      }`}
    >
      {pad}
    </span>
  );
}

/** A dot for a tap, a ring for a hold. */
function GestureIcon({ kind }: { kind: Gesture["kind"] }) {
  return kind === "tap" ? (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink-faint" aria-hidden="true">
      <circle cx="10" cy="10" r="3.2" fill="currentColor" />
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink-faint" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".35" />
      <path d="M10 2.5 A7.5 7.5 0 0 1 17.1 12.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** A round dark "display" with one of the site's screen glyphs (or her face). */
function Screen({ glyph, className = "h-14 w-14" }: { glyph: string; className?: string }) {
  if (glyph === "face") return <MayaFace mood="happy" still className={`${className} shrink-0`} />;
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0 rounded-full bg-screen`} aria-hidden="true">
      {GLYPH[glyph]}
    </svg>
  );
}

function MayaWithFace({ className = "", pads = false }: { className?: string; pads?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ART} alt="" width={220} height={336} className="block h-auto w-full" />
      <div className="absolute aspect-square" style={SCREEN}>
        <MayaFace mood="happy" still className="h-full w-full" />
      </div>
      {pads &&
        (Object.keys(PADS) as Pad[]).map((p) => (
          <span
            key={p}
            aria-hidden="true"
            className="absolute"
            style={{ left: PADS[p].left, top: "87.8%", width: "16.36%", height: "6.55%" }}
          >
            <span className={`absolute inset-0 rounded-[30%] motion-safe:animate-ping ${p === "T1" ? "bg-eye/50" : "bg-[#1d1d1f]/40"}`} />
            <span className={`absolute inset-0 rounded-[30%] ring-2 ${p === "T1" ? "bg-eye ring-eye/40" : "bg-[#1d1d1f] ring-black/20"}`} />
          </span>
        ))}
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} data-guide-section className="scroll-mt-24 border-t border-ink/10 py-14 first:border-0 first:pt-2 print:break-inside-avoid">
      <h2 className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        <span className="font-mono text-sm font-medium text-eye-deep">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const P = "max-w-2xl leading-relaxed text-ink-soft";

function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(email).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          },
          () => {},
        )
      }
      className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/50 hover:text-white"
    >
      {done ? copied : copy}
    </button>
  );
}

export default function Guide() {
  const { lang } = useT();
  const g = GUIDE[lang];
  const pre = lang === "bn" ? "/bn" : "";
  const [active, setActive] = useState(g.toc[0].id);

  // highlight the section being read in the side menu
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const n = (id: string) => num(lang, g.toc.findIndex((s) => s.id === id) + 1);
  const t = (id: string) => g.toc.find((s) => s.id === id)?.title ?? id;

  return (
    <>
      <header className="bg-cream pb-14 pt-28 print:bg-white print:pt-0">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="text-sm font-medium text-eye-deep">{g.hero.kicker}</span>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {g.hero.title} <span className="font-script font-normal text-eye-deep">{g.hero.titleScript}</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">{g.hero.lede}</p>
            <div className="mt-7 flex flex-wrap items-center gap-2 print:hidden">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{g.hero.jumpLabel}</span>
              {g.jump.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-ink/10 transition hover:ring-eye-deep">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <MayaWithFace className="mx-auto hidden w-44 md:block lg:w-52" />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="min-w-0 print:hidden">
          <nav className="sticky top-24 hidden lg:block" aria-label={g.onThisPage}>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{g.onThisPage}</div>
            <ol className="mt-4 space-y-0.5 border-l border-ink/10 text-sm">
              {g.toc.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 transition-colors ${
                      active === s.id ? "border-eye-deep font-medium text-ink" : "border-transparent text-ink-soft hover:text-ink"
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-8 rounded-full border border-ink/15 bg-card px-4 py-2 text-sm font-medium transition hover:border-ink/40"
            >
              {g.hero.print}
            </button>
          </nav>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" aria-label={g.onThisPage}>
            {g.toc.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full bg-bg-2 px-3.5 py-1.5 text-sm text-ink-soft">
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        <article className="min-w-0">
          {/* 1. Quick start */}
          <Section id="start" n={n("start")} title={t("start")}>
            <ol className="grid gap-4 sm:grid-cols-3">
              {g.start.steps.map(([title, d], i) => (
                <li key={title} className="relative rounded-2xl bg-bg-2 p-5">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
                    {lang === "bn" ? bnDigits(String(i + 1)) : i + 1}
                  </div>
                  <div className="mt-3 font-semibold">{title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{g.start.offline}</p>
              <Link
                href={`${pre}/app`}
                className="shrink-0 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-eye-deep hover:text-white sm:self-auto print:hidden"
              >
                {g.start.appCta}
              </Link>
            </div>
          </Section>

          {/* 2. Touch pads */}
          <Section id="pads" n={n("pads")} title={t("pads")}>
            <div className="grid items-start gap-8 md:grid-cols-[12rem_minmax(0,1fr)]">
              <figure className="mx-auto w-44 md:w-full">
                <MayaWithFace pads />
                <figcaption className="mt-3 text-center text-xs text-ink-faint">{g.pads.facing}</figcaption>
                <div className="mt-2 flex justify-between gap-2 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><PadChip pad="T1" />{g.pads.t1.split(" · ")[1]}</span>
                  <span className="flex items-center gap-1.5">{g.pads.t2.split(" · ")[1]}<PadChip pad="T2" /></span>
                </div>
              </figure>
              <div className="min-w-0">
                <p className={P}>{g.pads.intro}</p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
                  <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 bg-bg-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-faint sm:grid">
                    <span>&nbsp;</span>
                    <span>{g.pads.colFace}</span>
                    <span>{g.pads.colMenus}</span>
                  </div>
                  <ul className="divide-y divide-ink/10">
                    {g.pads.gestures.map((ge, i) => (
                      <li key={i} className="grid gap-2 px-4 py-3.5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {ge.pads.map((p, j) => (
                            <span key={p} className="flex items-center gap-1.5">
                              {j > 0 && <span className="text-xs text-ink-faint">+</span>}
                              <PadChip pad={p} />
                            </span>
                          ))}
                          <GestureIcon kind={ge.kind} />
                          <span className="text-sm font-medium">{ge.kind === "tap" ? g.pads.tap(ge.amount) : g.pads.hold(ge.amount)}</span>
                        </div>
                        <div className="text-sm text-ink-soft">
                          <span className="mr-1.5 text-xs font-semibold text-ink-faint sm:hidden">{g.pads.colFace}:</span>
                          {ge.face}
                        </div>
                        <div className="text-sm text-ink-soft">
                          <span className="mr-1.5 text-xs font-semibold text-ink-faint sm:hidden">{g.pads.colMenus}:</span>
                          {ge.menus}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm text-ink-faint">{g.pads.bootNote}</p>
              </div>
            </div>
          </Section>

          {/* 3. Moods */}
          <Section id="moods" n={n("moods")} title={t("moods")}>
            <p className={P}>{g.moods.intro}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MOODS.map((m) => (
                <li key={m.id} className="flex flex-col items-center rounded-2xl bg-bg-2 p-4 text-center">
                  <MayaFace mood={m.id} className="h-16 w-16" still />
                  <div className="mt-3 text-sm font-semibold">{g.moods.labels[m.id] ?? m.label}</div>
                  <div className="mt-1 whitespace-pre-line font-bangla text-xs leading-snug text-ink-faint" lang="bn">
                    {m.line}
                  </div>
                </li>
              ))}
            </ul>
            <p className={`${P} mt-6`}>{g.moods.bedtime}</p>
          </Section>

          {/* 4. Menu */}
          <Section id="menu" n={n("menu")} title={t("menu")}>
            <p className={P}>{g.menu.intro}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {g.menu.items.map((it) => (
                <li key={it.name} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-card p-3.5">
                  <Screen glyph={it.glyph} className="h-12 w-12" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{it.name}</div>
                    <div className="text-sm text-ink-soft">{it.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* 5. Games */}
          <Section id="games" n={n("games")} title={t("games")}>
            <p className={P}>{g.games.intro}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {g.games.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 rounded-2xl bg-bg-2 p-3.5 sm:[&:last-child:nth-child(odd)]:col-span-2">
                  <Screen glyph={it.id} className="h-12 w-12" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{it.name}</div>
                    <div className="text-sm text-ink-soft">{it.text}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-eye-deep">{it.control}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 6. Pairing */}
          <Section id="pairing" n={n("pairing")} title={t("pairing")}>
            <p className={P}>{g.pairing.intro}</p>
            <ol className="relative mt-7 space-y-6 border-l-2 border-ink/10 pl-7">
              {g.pairing.steps.map(([title, d], i) => (
                <li key={title} className="relative">
                  <span className="absolute -left-[2.45rem] grid h-7 w-7 place-items-center rounded-full bg-eye text-xs font-semibold text-white ring-4 ring-bg">
                    {lang === "bn" ? bnDigits(String(i + 1)) : i + 1}
                  </span>
                  <div className="font-semibold">{title}</div>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">{d}</p>
                  {i === 0 && (
                    <Link href={`${pre}/app`} className="mt-2 inline-block text-sm font-medium text-eye-deep underline underline-offset-4 print:hidden">
                      {g.start.appCta} · {g.start.appNote}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-eye-deep" aria-hidden="true">
                <rect x="4" y="9" width="12" height="8" rx="2" fill="currentColor" />
                <path d="M7 9V6.5a3 3 0 0 1 6 0V9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {g.pairing.secure}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-bg-2 p-5">
                <div className="font-semibold">{g.pairing.noAppTitle}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{g.pairing.noApp}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-5 text-sm leading-relaxed text-ink-soft">
                <p>{g.pairing.ghz}</p>
                <p className="mt-2 font-medium text-ink">{g.pairing.backTo}</p>
              </div>
            </div>
          </Section>

          {/* 7. Accessories */}
          <Section id="accessories" n={n("accessories")} title={t("accessories")}>
            <ul className="flex flex-wrap gap-3" aria-hidden="true">
              {["bunny", "panda", "crown", "sprout", "headphones", "backpack"].map((a) => (
                <li key={a} className="grid h-16 w-16 place-items-center rounded-2xl bg-[#f6f4f1] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/showcase/art/acc-${a}.svg`} alt="" className="max-h-full max-w-full" />
                </li>
              ))}
            </ul>
            <p className={`${P} mt-5`}>{g.accessories.text}</p>
            <p className={`${P} mt-3`}>{g.accessories.keychain}</p>
          </Section>

          {/* 8. Firmware */}
          <Section id="firmware" n={n("firmware")} title={t("firmware")}>
            <p className={P}>{g.firmware.intro}</p>
            <ol className="mt-5 max-w-2xl space-y-3">
              {g.firmware.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-ink-soft">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bg-2 text-xs font-semibold text-ink">
                    {lang === "bn" ? bnDigits(String(i + 1)) : i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-2xl rounded-xl border-l-4 border-eye bg-blush-soft px-4 py-3 text-sm leading-relaxed text-ink">{g.firmware.erase}</p>
          </Section>

          {/* 9. Factory reset */}
          <Section id="reset" n={n("reset")} title={t("reset")}>
            <p className={P}>{g.reset.intro}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{g.reset.erasedLabel}</span>
              {g.reset.erased.map((e) => (
                <span key={e} className="rounded-full bg-blush-soft px-3 py-1 text-sm font-medium text-eye-deep">
                  {e}
                </span>
              ))}
            </div>
            <ol className="mt-5 max-w-2xl space-y-3">
              {g.reset.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-ink-soft">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">
                    {lang === "bn" ? bnDigits(String(i + 1)) : i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <p className={`${P} mt-5`}>{g.reset.after}</p>
          </Section>

          {/* 10. Care */}
          <Section id="care" n={n("care")} title={t("care")}>
            <ul className="max-w-2xl space-y-2.5">
              {g.care.map((c) => (
                <li key={c} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-eye" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          {/* 11. Specs */}
          <Section id="specs" n={n("specs")} title={t("specs")}>
            <dl className="divide-y divide-ink/10 border-y border-ink/10">
              {g.specs.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="text-sm text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* 12. Help */}
          <Section id="help" n={n("help")} title={t("help")}>
            <div className="space-y-3">
              {g.help.items.map(([q, a]) => (
                <details key={q} className="group rounded-2xl bg-bg-2 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {q}
                    <span className="text-xl leading-none text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[1.75rem] bg-night p-7 text-white sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-semibold">{g.help.stuckTitle}</div>
                <div className="text-sm text-white/60">{g.help.stuckText}</div>
                <div className="mt-2 select-all font-mono text-sm text-white/90">{g.help.email}</div>
              </div>
              <div className="flex flex-wrap gap-2 print:hidden">
                <a href={`mailto:${g.help.email}`} className="rounded-full bg-eye px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-eye-deep">
                  {g.help.email}
                </a>
                <CopyEmail email={g.help.email} copy={g.help.copy} copied={g.help.copied} />
              </div>
            </div>
            <p className="mt-8 text-sm print:hidden">
              <Link href={pre || "/"} className="text-eye-deep hover:underline">
                ← {g.help.back}
              </Link>
            </p>
          </Section>
        </article>
      </div>
    </>
  );
}
