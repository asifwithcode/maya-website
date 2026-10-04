"use client";

import Link from "next/link";
import MayaFace from "./MayaFace";
import { bnDigits, useT } from "./i18n";

/**
 * The /app page. The QR code in the quick start card points here, so the URL must stay the same;
 * where the APK lives can change (MAYA_APK_URL). Without a URL the page says the app is coming.
 */
export default function AppDownload({ apkUrl, version }: { apkUrl: string | null; version: string | null }) {
  const { lang, t } = useT();
  const a = t.app;

  return (
    <main className="bg-bg">
      <section className="bg-cream px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-eye-deep">{a.kicker}</p>
            <h1 className="mt-3 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">{a.title}</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{a.text}</p>

            {apkUrl ? (
              <div className="mt-9">
                <a
                  href={apkUrl}
                  download="maya.apk"
                  className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition hover:bg-eye-deep hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
                  </svg>
                  {a.download}
                </a>
                <p className="mt-3 text-sm text-ink-faint">{version ? a.version(version) : a.requires}</p>
              </div>
            ) : (
              <div className="mt-9 max-w-lg rounded-[1.5rem] bg-paper p-6">
                <h2 className="font-semibold">{a.soonTitle}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.soonText}</p>
                <a
                  href="mailto:contact@xentoryx.com?subject=Maya%20app"
                  className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-eye-deep hover:text-white"
                >
                  {a.soonMail}
                </a>
              </div>
            )}
          </div>

          {/* phone art is decoration; on a phone the install steps matter more */}
          <div className="hidden justify-center md:flex">
            <div className="relative grid aspect-[9/17] w-56 place-items-center rounded-[2.5rem] border-[10px] border-night bg-night shadow-2xl sm:w-64">
              <div className="grid h-36 w-36 place-items-center rounded-full bg-screen sm:h-40 sm:w-40">
                <MayaFace mood="happy" className="h-28 w-28 sm:h-32 sm:w-32" />
              </div>
              <span className="absolute bottom-8 font-script text-2xl text-white/80">maya</span>
            </div>
          </div>
        </div>
      </section>

      {apkUrl && (
        <section className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{a.stepsTitle}</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {a.steps.map(([title, d], i) => (
                <li key={title} className="rounded-[1.5rem] bg-paper p-6">
                  <span className="font-script text-3xl text-eye">{lang === "bn" ? bnDigits(String(i + 1)) : i + 1}</span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">{a.note}</p>
          </div>
        </section>
      )}

      <section className="px-5 pb-24 sm:px-8 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <div className="hidden items-center gap-6 rounded-[1.5rem] bg-paper p-6 md:flex">
            {/* always dark-on-white so phones can read it in dark mode too */}
            <div className="shrink-0 rounded-xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/qr/app-${lang}.svg`} alt="" width={116} height={116} className="h-[116px] w-[116px]" />
            </div>
            <div>
              <h2 className="font-semibold">{a.scanTitle}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.scanText}</p>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-paper p-6">
            <p className="text-sm leading-relaxed text-ink-soft">{a.iphone}</p>
            <Link href="/docs#pairing" className="mt-4 inline-block text-sm text-ink underline decoration-eye underline-offset-4">
              {a.guide}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
