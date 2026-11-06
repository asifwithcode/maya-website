import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import HtmlLang from "@/components/site/HtmlLang";
import type { LegalDoc } from "@/components/site/legal";

/** Privacy / terms page in the same look as the user guide. */
export default function LegalPage({
  doc,
  lang,
  otherHref,
  otherLabel,
}: {
  doc: LegalDoc;
  lang: "en" | "bn";
  otherHref: string;
  otherLabel: string;
}) {
  return (
    <>
      <HtmlLang lang={lang} />
      <Nav home={false} />

      <header className="border-b border-black/10 bg-[#f5f5f7] pb-12 pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 sm:px-8">
          <span className="font-mono text-xs text-[#0071e3]">Xentoryx Labs · Maya</span>
          <h1 className="text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">{doc.title}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-black/70">{doc.intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-black/55">
            <span>{doc.updated}</span>
            <Link
              href={otherHref}
              className="rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#1d1d1f] transition hover:bg-[#e8e8ed]"
            >
              {otherLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        {doc.sections.map((s, i) => (
          <section key={s.heading} className="border-t border-black/10 py-8 first:border-0 first:pt-0">
            <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f] sm:text-2xl">
              <span className="mr-3 font-mono text-base text-[#0071e3]">{String(i + 1).padStart(2, "0")}</span>
              {s.heading}
            </h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 max-w-2xl leading-relaxed text-black/75">
                {p}
              </p>
            ))}
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
