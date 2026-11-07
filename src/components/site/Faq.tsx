"use client";

import { takaFor, useT, type Lang } from "./i18n";
import { useContent } from "./content";
import type { Pricing } from "@/db/schema";

type QA = [string, string];

/** Real answers only: Maya has no microphone or voice control, so we say so. */
function questions(lang: Lang, p: Pricing): QA[] {
  const t = (n: number) => takaFor(lang, n);
  if (lang === "bn")
    return [
      ["ডেস্ক কম্প্যানিয়ন রোবট কী?", "ডেস্ক কম্প্যানিয়ন রোবট হলো টেবিলে রাখার একটা ছোট্ট স্মার্ট রোবট, যার নিজস্ব ব্যক্তিত্ব আছে। মায়ার গোল জীবন্ত মুখ সারাদিন পলক ফেলে, তাকায়, আটটা মুডে বদলায়, আর বাংলায় ছোট্ট চিরকুট দেখায়। ফোনের অ্যাপ নয়, সত্যিকারের একটা জিনিস।"],
      ["বাংলাদেশে মায়া ডেস্ক রোবটের দাম কত?", `মায়ার দাম ${t(p.maya)} থেকে শুরু। ক্যাশ অন ডেলিভারি, ঢাকার ভেতরে ডেলিভারি চার্জ ${t(p.delivery.dhaka)}, ঢাকার বাইরে ${t(p.delivery.outside)}।`],
      ["মায়া কী কী করতে পারে?", "আটটা মুড, এগারোটা স্ক্রিন (সময়, আবহাওয়া, পোমোডোরো ফোকাস টাইমার, নোটিফিকেশন ইত্যাদি), সাতটা বিল্ট-ইন গেম আর বাংলা চিরকুট। পায়ের দুটো টাচ প্যাড দিয়ে চালানো যায়।"],
      ["মায়া কি কথা শোনে বা ভয়েস কমান্ড নেয়?", "না, মায়ার মাইক্রোফোন নেই, তাই ভয়েস কমান্ড নেয় না। ও স্ক্রিনে মুখ আর বাংলা চিরকুট দিয়ে নিজেকে প্রকাশ করে, আর টাচ দিয়ে চালানো হয়।"],
      ["ইন্টারনেট বা Wi-Fi লাগে?", "মুড, গেম আর মুখ ইন্টারনেট ছাড়াই চলে। আবহাওয়া, সময় আর নোটিফিকেশনের জন্য Maya অ্যাপ দিয়ে ব্লুটুথে এক মিনিটে Wi-Fi সেটআপ করে নিন। সংযোগ পুরোটা এনক্রিপ্টেড।"],
      ["অফিস ডেস্ক বা উপহার হিসেবে কেমন?", "অফিস, পড়ার টেবিল বা গেমিং সেটআপের জন্য একটা কিউট স্মার্ট গ্যাজেট। সাতটা এডিশন আর প্লাগ-ইন অ্যাক্সেসরি আছে, আর প্রতিটা বাক্সে একটা মিনি মায়া কি-চেইন থাকে, তাই উপহার হিসেবেও দারুণ।"],
      ["চার্জ কীভাবে হয়?", "মায়া USB-C (৫ ভোল্ট) দিয়ে চলে, সবসময় চালু থাকে। বাক্সে USB-C কেবল দেওয়া থাকে।"],
    ];
  return [
    ["What is a desk companion robot?", "A desk companion robot is a small smart robot that lives on your desk and has a personality of its own. Maya's round living face blinks, glances and shifts between eight moods all day, and shows little notes in Bangla. It's a real object, not an app on your phone."],
    ["How much does the Maya desk robot cost in Bangladesh?", `Maya starts at ${t(p.maya)}, with cash on delivery. Delivery is ${t(p.delivery.dhaka)} inside Dhaka and ${t(p.delivery.outside)} outside Dhaka.`],
    ["What can Maya do?", "Eight moods, eleven screens (clock, weather, a Pomodoro focus timer, notifications and more), seven built-in games and Bangla dialogue cards. You control it with two touch pads on its legs."],
    ["Does Maya listen or take voice commands?", "No. Maya has no microphone, so it doesn't take voice commands. It expresses itself through its face and Bangla notes on screen, and you control it by touch."],
    ["Does it need the internet or Wi-Fi?", "Moods, games and the face work offline. For weather, time and notifications, set up Wi-Fi in about a minute over Bluetooth with the Maya app. The connection is fully encrypted."],
    ["Is it a good office desk gadget or gift?", "It's a cute smart gadget for an office desk, study table or gaming setup. There are seven editions with plug-in accessories, and every box includes a mini Maya keychain, so it makes a lovely gift."],
    ["How is it powered?", "Maya runs on 5 V over USB-C and stays on all the time. A USB-C cable is in the box."],
  ];
}

export default function Faq() {
  const { lang } = useT();
  const { pricing } = useContent();
  const isBn = lang === "bn";
  const qa = questions(lang, pricing);

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <section id="faq" className="bg-white px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[820px]">
        <h2 className="text-center text-[32px] font-semibold tracking-[-0.025em] text-[#1d1d1f] sm:text-[48px]">
          {isBn ? "সাধারণ প্রশ্ন" : "Questions, answered."}
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[17px] text-[#6e6e73]">
          {isBn ? "মায়া ডেস্ক কম্প্যানিয়ন রোবট নিয়ে যা জানতে চান।" : "Everything you want to know about the Maya desk companion robot."}
        </p>

        <div data-reveal className="mt-12 divide-y divide-[#d2d2d7] border-y border-[#d2d2d7]">
          {qa.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold text-[#1d1d1f] sm:text-[19px] [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="shrink-0 text-[24px] font-light text-[#6e6e73] transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-[16px] leading-relaxed text-[#424245] sm:text-[17px]">{a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </section>
  );
}
