"use client";

import Image from "next/image";
import Link from "next/link";
import { IN_THE_BOX, SPECS } from "./data";
import { revealChildren, revealLines, useGsap } from "./motion";
import { bnDigits, useT } from "./i18n";

export default function Specs() {
  const { lang, t } = useT();
  const s = t.specs;
  const rows = s.rows ?? SPECS;
  const box = s.box ?? IN_THE_BOX;
  const ref = useGsap<HTMLElement>((root, reduce) => {
    root.querySelectorAll<HTMLElement>("h2").forEach((h) => revealLines(h, reduce));
    revealChildren(root, reduce);
  });

  return (
    <section ref={ref} id="specs" className="bg-bg px-5 py-28 sm:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">{s.kicker}</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">{s.title}</h2>
            <div className="mt-10 hidden max-w-xs rounded-[1.75rem] bg-paper p-6 md:block">
              <div className="relative mx-auto aspect-[220/336] w-28">
                <Image src="/showcase/art/maya-headphones.svg" alt="" fill unoptimized sizes="112px" className="object-contain" />
              </div>
              <h3 className="mt-5 font-semibold">{s.inBox}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {box.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-eye" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <dl data-reveal-group className="border-t border-ink/10">
            {rows.map(([k, v]) => (
              <div key={k} data-reveal className="grid gap-1 border-b border-ink/10 py-5 sm:grid-cols-[9rem_1fr]">
                <dt className="text-sm font-semibold">{k}</dt>
                <dd className="text-ink-soft">{v}</dd>
              </div>
            ))}
            <div data-reveal className="py-5 md:hidden">
              <dt className="text-sm font-semibold">{s.inBox}</dt>
              <dd className="mt-1 text-ink-soft">{box.join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-28 grid gap-14 md:mt-40 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">{s.startKicker}</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">{s.startTitle}</h2>
            <p className="mt-5 max-w-sm text-ink-soft">
              {s.guideBefore}{" "}
              <Link href={lang === "bn" ? "/bn/docs" : "/docs"} className="text-ink underline decoration-eye underline-offset-4">
                {s.guideLink}
              </Link>
              {lang === "bn" ? "।" : "."}
            </p>
            <Link
              href={lang === "bn" ? "/bn/app" : "/app"}
              className="mt-7 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-eye-deep hover:text-white"
            >
              {s.getApp}
            </Link>
          </div>
          <ol data-reveal-group className="grid gap-4 sm:grid-cols-3">
            {s.steps.map(([title, d], i) => (
              <li key={title} data-reveal className="rounded-[1.5rem] bg-paper p-6">
                <span className="font-script text-3xl text-eye">{lang === "bn" ? bnDigits(String(i + 1)) : i + 1}</span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
