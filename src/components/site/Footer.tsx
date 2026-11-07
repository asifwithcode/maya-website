"use client";

import Link from "next/link";
import { useT } from "./i18n";
import { useContent } from "./content";
import { pathFor } from "./paths";

/** "Chittagong, Bangladesh" reads as চট্টগ্রাম, বাংলাদেশ on Bangla pages; a full street address stays as typed. */
const bnAddress = (a: string) =>
  a.replace(/Chittagong|Chattogram/gi, "চট্টগ্রাম").replace(/Dhaka/gi, "ঢাকা").replace(/Bangladesh/gi, "বাংলাদেশ");

export default function Footer() {
  const { lang, t } = useT();
  const { copy } = useContent();
  const comp = copy?.company;
  const isBn = lang === "bn";
  const home = lang === "bn" ? "" : pathFor("en");
  const docs = pathFor(lang, "docs");

  const cols: { title: string; links: [string, string, boolean?][] }[] = [
    {
      title: isBn ? "মায়া" : "Maya",
      links: [
        [t.nav.moods, `${home}/#moods`],
        [t.nav.features, `${home}/#features`],
        [t.nav.screens, `${home}/#screens`],
        [t.nav.specs, `${home}/#specs`],
      ],
    },
    {
      title: isBn ? "কেনাকাটা" : "Shop",
      links: [
        [t.nav.editions, `${home}/#editions`],
        [t.nav.order, `${home}/#order`],
        [isBn ? "অর্ডার ট্র্যাক করুন" : "Track your order", pathFor(lang, "track")],
      ],
    },
    {
      title: isBn ? "সাপোর্ট" : "Support",
      links: [
        [isBn ? "ইউজার গাইড" : "User guide", docs],
        [isBn ? "Bluetooth ও Wi‑Fi সেটআপ" : "Bluetooth & Wi‑Fi setup", `${docs}#pairing`],
        [isBn ? "সমস্যা সমাধান" : "Troubleshooting", `${docs}#help`],
        [isBn ? "অ্যান্ড্রয়েড অ্যাপ" : "Android app", pathFor(lang, "app")],
        [isBn ? "প্রাইভেসি পলিসি" : "Privacy policy", pathFor(lang, "privacy")],
        [isBn ? "ব্যবহারের শর্তাবলি" : "Terms of use", pathFor(lang, "terms")],
      ],
    },
    {
      title: isBn ? "যোগাযোগ" : "Contact",
      links: [
        ...(comp?.email ? ([[comp.email, `mailto:${comp.email}`]] as [string, string][]) : []),
        ...(comp?.phone ? ([[comp.phone, `tel:${comp.phone.replace(/[^+\d]/g, "")}`]] as [string, string][]) : []),
        ...(comp?.address ? ([[isBn ? bnAddress(comp.address) : comp.address, "#"]] as [string, string][]) : []),
      ],
    },
  ];

  return (
    <footer className="bg-[#f5f5f7] px-4 pb-10 pt-6 text-[12px] text-[#6e6e73] sm:px-6">
      <div className="mx-auto max-w-[980px]">
        <p className="border-b border-[#d2d2d7] pb-4 leading-relaxed">
          {isBn
            ? "ডেলিভারির সময় টাকা পরিশোধ করুন। ডেলিভারি চার্জ এলাকাভেদে আলাদা।"
            : "Pay on delivery. Delivery charges vary by location."}
        </p>

        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-2.5 font-semibold text-[#1d1d1f]">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map(([label, href, download]) => (
                  <li key={label}>
                    {download || href.startsWith("mailto") || href === "#" ? (
                      <a href={href} download={download || undefined} className="hover:underline">
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="hover:underline">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#d2d2d7] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span>{comp?.copyright ?? `© ${new Date().getFullYear()} Xentoryx Labs. All rights reserved.`}</span>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
