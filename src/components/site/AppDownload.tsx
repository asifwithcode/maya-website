"use client";

import Link from "next/link";
import { useT } from "./i18n";

export default function AppDownload() {
  const { lang } = useT();
  const isBn = lang === "bn";

  const tiles: [string, string][] = isBn
    ? [
        ["টাচ কন্ট্রোল", "বাঁ পায়ে ট্যাপ করলে আদর পায়, ডান পায়ে ট্যাপ করলে মেনু ঘোরে।"],
        ["৮টি জীবন্ত মুড", "প্রতি সেকেন্ডে ৪০ বার আঁকা চোখ, দিনের সাথে মুড বদলায়।"],
        ["৭টি আর্কেড গেম", "এক আঙুলে খেলা, হাই-স্কোর ডিভাইসেই সেভ।"],
        ["Wi‑Fi ও ক্লাউড", "সময়, ঢাকার আবহাওয়া আর বাংলা শুভেচ্ছা নিজে থেকেই আসে।"],
      ]
    : [
        ["Touch controls", "Tap her left foot to pet, the right foot to spin the menu."],
        ["8 living moods", "Eyes drawn 40 times a second that change through the day."],
        ["7 arcade games", "One-finger play with high scores saved on device."],
        ["Wi‑Fi & cloud", "Clock, Dhaka weather and Bangla greetings, automatically."],
      ];

  return (
    <section id="download" className="scroll-mt-12 bg-[#f5f5f7] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1024px]">
        <div className="rounded-[28px] bg-white px-8 py-12 text-center sm:px-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#1d1d1f] text-white">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor">
              <circle cx="8.5" cy="12" r="2.6" />
              <circle cx="15.5" cy="12" r="2.6" />
            </svg>
          </div>
          <h2 className="mt-6 text-[32px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[48px]">
            {isBn ? "Maya অ্যাপ।" : "The Maya app."}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[19px] leading-relaxed text-[#6e6e73]">
            {isBn
              ? "ব্লুটুথে কয়েক সেকেন্ডে পেয়ার করুন, Wi‑Fi সেট করুন, আর ফোনের নোটিফিকেশন মায়ায় পাঠান।"
              : "Pair in seconds over Bluetooth, hand over your Wi‑Fi, and relay your phone’s notifications to Maya."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/app" download className="btn-primary">
              {isBn ? "অ্যান্ড্রয়েডের জন্য ডাউনলোড" : "Download for Android"}
            </a>
            <Link href={isBn ? "/bn/docs" : "/docs"} className="link-more">
              {isBn ? "ইউজার গাইড পড়ুন" : "Read the user guide"} <span aria-hidden>›</span>
            </Link>
          </div>
          <p className="mt-4 text-[12px] text-[#86868b]">v1.5.2 · Android 8.0+ · 33.5 MB</p>
        </div>

        <div id="guide" className="mt-5 grid scroll-mt-24 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(([title, text]) => (
            <div key={title} className="lift rounded-[28px] bg-white p-8">
              <h3 className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
