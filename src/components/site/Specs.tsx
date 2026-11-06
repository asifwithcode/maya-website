"use client";

import Image from "next/image";
import Link from "next/link";
import { IN_THE_BOX, SPECS } from "./data";
import { bnDigits, useT } from "./i18n";
import { useContent } from "./content";
import { pathFor } from "./paths";

export default function Specs() {
  const { lang, t } = useT();
  const { copy } = useContent();
  const s = t.specs;
  const dyn = copy?.specs;
  const isBn = lang === "bn";

  const rows: [string, string][] =
    dyn?.rows && dyn.rows.length > 0
      ? dyn.rows.map((r) => [isBn ? r.labelBn : r.labelEn, isBn ? r.valBn : r.valEn])
      : (s.rows ?? SPECS);

  const box: string[] =
    dyn?.box && dyn.box.length > 0 ? dyn.box.map((b) => (isBn ? b.bn : b.en)) : (s.box ?? IN_THE_BOX);

  return (
    <section id="specs" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[980px]">
        <h2 className="headline text-center text-[#1d1d1f]">{s.title}</h2>

        <dl className="mt-10 border-t border-[#d2d2d7]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 gap-1 border-b border-[#d2d2d7] py-5 sm:grid-cols-[14rem_1fr]">
              <dt className="text-[17px] font-semibold text-[#1d1d1f]">{k}</dt>
              <dd className="text-[17px] leading-relaxed text-[#6e6e73]">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[28px] bg-[#f5f5f7]">
            <Image src="/images/packaging/mockup.png" alt="Maya retail box" fill className="object-contain p-6" />
          </div>
          <div>
            <h3 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[32px]">{s.inBox}</h3>
            <ul className="mt-6 space-y-3 text-[17px] text-[#1d1d1f]">
              {box.map((x) => (
                <li key={x} className="border-b border-[#d2d2d7] pb-3">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[40px]">{s.startTitle}</h3>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {s.steps.map(([title, desc], i) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[17px] font-semibold text-[#1d1d1f]">
                  {isBn ? bnDigits(String(i + 1)) : i + 1}
                </span>
                <h4 className="mt-4 text-[21px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h4>
                <p className="mt-2 text-[17px] leading-relaxed text-[#6e6e73]">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-[17px] text-[#6e6e73]">
            {s.guideBefore}{" "}
            <Link href={pathFor(isBn ? "bn" : "en", "docs")} className="text-[#0066cc] hover:underline">
              {s.guideLink} ›
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
