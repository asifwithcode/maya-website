"use client";

import { useT } from "./i18n";

const POINTS = {
  en: [
    ["Physical presence.", "Not an app on a screen. A real object with a personality of its own."],
    ["Always alive.", "Smooth 40 fps eyes that blink, glance and drift all day long."],
    ["Speaks Bangla.", "Little notes rooted in the warmth of home, written in your language."],
  ],
  bn: [
    ["সত্যিকারের উপস্থিতি।", "স্ক্রিনের কোনো অ্যাপ নয়। নিজস্ব ব্যক্তিত্বের একটা আসল জিনিস।"],
    ["সবসময় জীবন্ত।", "৪০ fps-এর মসৃণ চোখ, সারাদিন পলক ফেলে, এদিক-ওদিক তাকায়।"],
    ["বাংলায় কথা বলে।", "ঘরের উষ্ণতায় ভরা ছোট্ট চিরকুট, আপনার ভাষায়।"],
  ],
};

export default function Manifesto() {
  const { lang, t } = useT();

  return (
    <section className="bg-[#f5f5f7] px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-[980px]">
        <p className="mx-auto max-w-[820px] text-center text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f] sm:text-[40px] md:text-[48px]">
          {t.manifesto.text} <span className="font-bangla text-[#0071e3]">{t.manifesto.accent}</span>
          {t.manifesto.end}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {POINTS[lang].map(([title, text]) => (
            <div key={title}>
              <h3 className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-[#6e6e73]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
