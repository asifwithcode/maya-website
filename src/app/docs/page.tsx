import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import HtmlLang from "@/components/site/HtmlLang";
import MayaFace from "@/components/site/MayaFace";
import PrintButton from "@/components/site/PrintButton";
import { GAMES, MOODS, SPECS } from "@/components/site/data";
import { LangProvider } from "@/components/site/i18n";
import { APP_RELEASE } from "@/lib/app-release";

export const metadata: Metadata = {
  title: "মায়া ইউজার গাইড, সফটওয়্যার ও পূর্ণাঙ্গ সমস্যা সমাধান | Xentoryx",
  description:
    "মায়া ডেস্কটপ কম্প্যানিয়নের সম্পূর্ণ টেকনিক্যাল গাইড: আনবক্সিং, ব্লুটুথ পেয়ারিং, দুই পায়ের ক্যাপাসিটিভ টাচ কন্ট্রোল, ৮টি মুড, ১০টি মেনু স্ক্রিন, ৭টি আর্কেড গেম এবং বিস্তারিত সমস্যা সমাধানের টিপস।",
  alternates: { canonical: "/docs", languages: { bn: "/docs", en: "/en/docs" } },
};

const TOC_BN = [
  ["apps", "সফটওয়্যার ও অ্যাপস"],
  ["start", "শুরু করা ও সেটআপ"],
  ["controls", "টাচ কন্ট্রোল ও জেসচার"],
  ["moods", "মুড ও জীবন্ত আচরণ"],
  ["menu", "ক্যারোসেল মেনু ও ১০টি স্ক্রিন"],
  ["games", "আর্কেড গেমস নির্দেশিকা"],
  ["pairing", "ব্লুটুথ ও ওয়াই-ফাই সেটআপ"],
  ["accessories", "মডুলার অ্যাক্সেসরিজ"],
  ["firmware", "ফার্মওয়্যার আপডেট"],
  ["reset", "ফ্যাক্টরি রিসেট পদ্ধতি"],
  ["care", "যত্ন ও সতর্কতা"],
  ["specs", "হার্ডওয়্যার স্পেসিফিকেশন"],
  ["help", "সমস্যা সমাধান ও FAQ"],
] as const;

const CONTROLS_BN: { action: string; face: string; screens: string; tag: string }[] = [
  {
    action: "T1 (বাম পায়ে) একবার আলতো ট্যাপ",
    face: "আদর দেওয়া! খুশি, চোখ টেপা, আদর ও হাসির অ্যানিমেশনের সাথে মিষ্টি বাংলা ডায়ালগ কার্ড।",
    screens: "আইটেম সিলেক্ট, লাফ (ডাইনো), ডানা ঝাপটানো (ফ্ল্যাপি), লেজার গুলি (শুটার), ড্রপ (স্ট্যাক), ল্যাপ কাউন্টার।",
    tag: "মূল ট্যাপ",
  },
  {
    action: "T1 দ্রুত ৩–৪ বার ট্যাপ",
    face: "বিরক্ত হওয়া! চোখ গোল করে মাথা নাড়াবে এবং বিরক্তি প্রকাশ করবে।",
    screens: "—",
    tag: "জেসচার",
  },
  {
    action: "T1 দ্রুত ৫+ বার ট্যাপ",
    face: "রেগে যাওয়া! চোখের আগুন জ্বলে উঠবে এবং তাকে বিরক্ত না করতে কড়া সতর্কবার্তা দেবে।",
    screens: "—",
    tag: "জেসচার",
  },
  {
    action: "T1 ৮০০ মিলি-সেকেন্ড চেপে ধরা",
    face: "গভীর ভালোবাসার প্রতিক্রিয়া! চোখে ভালোবাসার হার্ট অ্যানিমেশন ভেসে উঠবে।",
    screens: "—",
    tag: "হোল্ড",
  },
  {
    action: "T2 (ডান পায়ে) একবার আলতো ট্যাপ",
    face: "থ্রিডি নিয়ন ক্যারোসেল মেনু খুলে যাবে।",
    screens: "মেনুতে: পরের স্ক্রিনে যাওয়া। স্ক্রিনের ভেতর: ব্যাক বা ক্যানসেল।",
    tag: "মেনু / নেভিগেশন",
  },
  {
    action: "T1 ১.০ সেকেন্ড চেপে ধরা",
    face: "—",
    screens: "চলতি স্ক্রিন বা মিনি গেম থেকে তাত্ক্ষণিক বের হয়ে মেনুতে ফেরা।",
    tag: "প্রস্থান",
  },
  {
    action: "T2 ১.০ সেকেন্ড চেপে ধরা",
    face: "—",
    screens: "আর্কেড গেমসের তালিকা থেকে সরাসরি মূল মেনুতে ফেরা।",
    tag: "ব্যাক",
  },
  {
    action: "T1 + T2 একসাথে ১.৮ সেকেন্ড চেপে ধরা",
    face: "ইন্টারেক্টিভ স্লিপ ইঞ্জিন! কিউট ঘুমানোর চোখ, জিপুজি মৃদু আলো, ভাসমান Zzz ও মিটিমিটি তারা।",
    screens: "যেকোনো স্ক্রিন থেকে মায়াকে ঘুম পাড়ানো বা জাগিয়ে তোলা।",
    tag: "ডুয়াল টাচ",
  },
  {
    action: "T2 ২.৫ সেকেন্ড চেপে ধরা",
    face: "যেকোনো অবস্থা থেকে সরাসরি পেয়ারিং মোড ও কিউআর কোড চালু।",
    screens: "যেকোনো অবস্থা থেকে সরাসরি পেয়ারিং মোড ও কিউআর কোড চালু।",
    tag: "শর্টকাট",
  },
  {
    action: "ESP32 BOOT বাটন (পেছনে)",
    face: "হার্ডওয়্যার সিস্টেম রিস্টার্ট / সফট রিবুট।",
    screens: "হার্ডওয়্যার সিস্টেম রিস্টার্ট / সফট রিবুট।",
    tag: "হার্ডওয়্যার",
  },
];

const MENU_DETAILS_BN = [
  {
    title: "১. মায়ার চোখ ও মুখ",
    subtitle: "অ্যাক্টিভ ব্যক্তিত্ব",
    desc: "মায়ার মূল জীবন্ত স্ক্রিন যেখানে রোবো-আইজ ডাইনামিকভাবে তাকায়, চোখের পলক ফেলে এবং টাচে অনুভূতি প্রকাশ করে। প্রতি কয়েক সেকেন্ড পর পর স্বয়ংক্রিয়ভাবে নতুন নতুন এক্সপ্রেশন দেয়।",
  },
  {
    title: "২. ডিজিটাল ঘড়ি ও ক্যালেন্ডার",
    subtitle: "NTP ইন্টারনেট সিঙ্ক",
    desc: "সাইবার নান্দনিক ডিজাইনের ডিজিটাল ঘড়ি যা ওয়াই-ফাইয়ের মাধ্যমে আন্তর্জাতিক সার্ভার থেকে প্রতি সেকেন্ডে নিখুঁত সময় ও তারিখ আপডেট রাখে।",
  },
  {
    title: "৩. লাইভ আবহাওয়া ও পূর্বাভাস",
    subtitle: "শহরের রিয়েলটাইম আবহাওয়া",
    desc: "আপনার শহরের বর্তমান তাপমাত্রা, আকাশের অবস্থা (রোদ, বৃষ্টি, মেঘ), এবং আর্দ্রতার শতাংশ প্রদর্শন করে যা মোবাইল অ্যাপের মাধ্যমে নির্ধারিত হয়।",
  },
  {
    title: "৪. ফোন নোটিফিকেশন মিরর",
    subtitle: "সরাসরি সতর্কবার্তা",
    desc: "আপনার অ্যান্ড্রয়েড ফোনে আসা সর্বশেষ ৫টি নোটিফিকেশন (কল, মেসেজ, হোয়াটসঅ্যাপ, রিমাইন্ডার) মায়ার স্ক্রিনে সাথে সাথে ফুটে ওঠে।",
  },
  {
    title: "৫. পোমোডোরো ফোকাস টাইমার",
    subtitle: "প্রোডাক্টিভিটি ইঞ্জিন",
    desc: "২৫ মিনিট গভীর মনোযোগ দিয়ে কাজ বা পড়াশোনা এবং ৫ মিনিট হালকা বিরতির বৈজ্ঞানিক পোমোডোরো সাইকেল, যা উজ্জ্বল বৃত্তাকার নিয়ন আর্কে প্রদর্শিত হয়।",
  },
  {
    title: "৬. স্টপওয়াচ ও ল্যাপ কাউন্টার",
    subtitle: "মিলিসেকেন্ড অ্যাকুরেসি",
    desc: "কাজের গতি বা শরীরচর্চার হিসাব রাখতে নিখুঁত মিলিসেকেন্ড স্টপওয়াচ। T1 দিয়ে স্টার্ট, পজ ও ল্যাপ এবং T2 দিয়ে ক্লিয়ার করা যায়।",
  },
  {
    title: "৭. ফোকাস পরিসংখ্যান",
    subtitle: "দৈনিক ও সাপ্তাহিক হিসাব",
    desc: "আজ এবং চলতি সপ্তাহে আপনি মোট কত মিনিট বা ঘণ্টা পূর্ণ মনোযোগ দিয়ে কাজ করেছেন তার দৃশ্যমান অ্যানালিটিক্স।",
  },
  {
    title: "৮. মিনি গেমস (আর্কেড)",
    subtitle: "৭টি ক্লাসিক রেট্রো গেম",
    desc: "বিল্ট-ইন ৬০ এফপিএস আর্কেড সুট যাতে রয়েছে ডাইনো, ফ্ল্যাপি, স্পেস শুটার, টাওয়ার স্ট্যাক, সার্কেল পং, রিফ্লেক্স এবং ব্রিক ব্রেকার।",
  },
  {
    title: "৯. সিস্টেম ডায়াগনস্টিকস",
    subtitle: "হার্ডওয়্যার স্ট্যাটাস",
    desc: "রিয়েলটাইম সিস্টেম ইনফো: কানেক্টেড Wi-Fi নাম, সিগন্যাল স্ট্রেংথ dBm, লোকাল IP অ্যাড্রেস, ফ্রি র‍্যাম হিপ, আপটাইম ও ফার্মওয়্যার ভার্সন।",
  },
  {
    title: "১০. ডিভাইস সেটআপ / রিসেট",
    subtitle: "ডিভাইস ক্লেম ও মেমোরি ক্লিয়ার",
    desc: "পেয়ারিংয়ের পূর্বে কিউআর কোড দেখায়। পেয়ারিং হয়ে গেলে এটি নিরাপদ ফ্যাক্টরি রিসেট মেনুতে পরিণত হয় যা হোল্ড করে কনফার্ম করতে হয়।",
  },
];

const GAME_DETAILS_BN = [
  {
    id: "dino",
    name: "মায়া ডাইনো রানার",
    genre: "ইনফিনিট রানার",
    controls: "T1 দিয়ে লাফ",
    desc: "দিন ও রাতের আলোর পরিবর্তনের সাথে মরুভূমির ক্যাকটাস ও বাধাগুলো লাফিয়ে পার করুন। সময়ের সাথে গতি বাড়তে থাকে।",
  },
  {
    id: "flappy",
    name: "ফ্ল্যাপি মায়া",
    genre: "এন্ডলেস ট্যাপার",
    controls: "T1 দিয়ে ডানা ঝাপটানো",
    desc: "ভাসমান পাইপের ফাঁক দিয়ে সাবধানে উড়ে যান। অভিকর্ষ বলের টানে মায়া নিচে নামতে থাকলে সঠিক সময়ে ট্যাপ করতে হয়।",
  },
  {
    id: "shooter",
    name: "স্পেস শুটার",
    genre: "রেট্রো গ্যালাক্সি আর্কেড",
    controls: "T1 দিয়ে লেজার ফায়ার",
    desc: "মহাকাশ স্টেশন রক্ষা করতে উপর থেকে ধেয়ে আসা এলিয়েন জাহাজ ও উল্কাপিণ্ডে লেজার ছুড়ে ধ্বংস করুন।",
  },
  {
    id: "stack",
    name: "টাওয়ার স্ট্যাক",
    genre: "টাইমিং ও ব্যালেন্স",
    controls: "T1 দিয়ে ব্লক ড্রপ",
    desc: "দুলতে থাকা ব্লককে ঠিক মাঝখানে ফেলে আকাশচুম্বী টাওয়ার গড়ে তুলুন। বাইরের অংশ কেটে বাদ পড়ে যাবে!",
  },
  {
    id: "pong",
    name: "সার্কেল পং",
    genre: "৩৬০° সার্কুলার অ্যাকশন",
    controls: "T1 দিয়ে দিক পরিবর্তন",
    desc: "মায়ার গোল স্ক্রিনের জন্য বিশেষভাবে তৈরি! বলকে বৃত্তের ভেতর আটকে রাখতে প্যাডেলের দিক পরিবর্তন করুন।",
  },
  {
    id: "reflex",
    name: "রিফ্লেক্স রাশ",
    genre: "গতি ও সতর্কতা পরীক্ষা",
    controls: "আলো জ্বলার সাথে সাথে T1",
    desc: "আপনার চোখের পলক ও আঙুলের প্রতিক্রিয়া কতটা দ্রুত তা মিলিসেকেন্ডে মাপুন। আলো দেখামাত্রই ট্যাপ করুন।",
  },
  {
    id: "brick",
    name: "ব্রিক ব্রেকার",
    genre: "ক্লাসিক ব্রেকআউট",
    controls: "T1 দিয়ে প্যাডেল পরিচালনা",
    desc: "বল বাউন্স করিয়ে বিভিন্ন স্তরের রঙিন ইটের দেয়াল ভেঙে গুড়িয়ে দিন। বলকে নিচে পড়তে দেওয়া যাবে না।",
  },
];

const TROUBLESHOOTING_BN = [
  {
    category: "পাওয়ার, স্ক্রিন ও বুট সংক্রান্ত সমস্যা",
    badge: "পাওয়ার ও হার্ডওয়্যার",
    items: [
      {
        q: "স্ক্রিন সম্পূর্ণ কালো হয়ে আছে এবং কোনো আলো জ্বলছে না",
        a: "মায়ার নিজস্ব কোনো ব্যাটারি নেই, তাই ভালো মানের ৫ ভোল্ট এবং কমপক্ষে ১.০ অ্যাম্পিয়ার (১০০০ মিলি-অ্যাম্পিয়ার) সম্পন্ন USB-C চার্জার ব্যবহার করুন। অনেক চিকন চার্জিং কেবল বিদ্যুৎ পরিবাহী তার পর্যাপ্ত থাকে না বলে ভোল্টেজ ৪.৭ ভোল্টের নিচে নেমে যায়। একটি ভালো ডেটা কেবল দিয়ে দেয়ালের অ্যাডাপ্টারে লাগান।",
      },
      {
        q: "মায়া বারবার রিস্টার্ট নিচ্ছে বা বুটলুপে আটকে আছে",
        a: "এটি ৯৯% ক্ষেত্রে বিদ্যুৎ ঘাটতি বা আন্ডার-ভোল্টেজ (Brownout) সমস্যার কারণে ঘটে। মায়ার ওয়াই-ফাই যখন ডেটা ট্রান্সমিট করে তখন পিক কারেন্ট প্রয়োজন হয়। দুর্বল পিসি ইউএসবি পোর্ট বা দীর্ঘ এক্সটেনশন কর্ডের বদলে সরাসরি ভালো মোবাইল চার্জার ব্যবহার করুন।",
      },
      {
        q: "ডিসপ্লেতে সাদা আলো জ্বলছে কিন্তু চোখ বা গ্রাফিক্স আসছে না",
        a: "স্ক্রিন পাওয়ার পেলেও SPI ডেটা লাইন ঠিকমতো সিঙ্ক না হলে এমন হতে পারে। কেবলটি খুলে ৫ সেকেন্ড অপেক্ষা করে আবার শক্ত করে লাগান। তাতেও ঠিক না হলে WhatsApp (+880 1892-126867) বা xentoryxlabs@gmail.com-এ আমাদের জানান।",
      },
      {
        q: "মায়া হঠাৎ ফ্রিজ হয়ে গেছে বা কোনো টাচ নিচ্ছে না",
        a: "মায়ার পেছনের দিকে থাকা মাইক্রো BOOT বাটনটি একবার আলতো চাপ দিন অথবা USB-C কেবলটি খুলে আবার যুক্ত করুন, সাথে সাথে রিবুট হয়ে নতুনের মতো কাজ করবে।",
      },
    ],
  },
  {
    category: "টাচ সেন্সর ও জেসচার সংক্রান্ত সমস্যা",
    badge: "ক্যাপাসিটিভ ইনপুট",
    items: [
      {
        q: "পাওয়ার দেওয়ার সাথে সাথেই দুই পায়ের টাচ কাজ করছে না",
        a: "এটি সম্পূর্ণ স্বাভাবিক এবং সিস্টেমের সুরক্ষা ফিচার। প্লাগ লাগানোর পর প্রথম ৩ সেকেন্ড TTP223 সেন্সর চারপাশের পরিবেশ অনুযায়ী অটো-ক্যালিব্রেট করে। এই ৩ সেকেন্ড মায়াকে স্পর্শ করবেন না। মায়া চোখ খুলে হাই বলার পর টাচ সক্রিয় হয়ে যায়।",
      },
      {
        q: "কেউ না ছুঁলেও একা একাই টাচ ইনপুট নিচ্ছে (ঘোস্ট টাচ)",
        a: "ক্যাপাসিটিভ সেন্সর বৈদ্যুতিক নয়েজের প্রতি সংবেদনশীল। যদি আনগ্রাউন্ডেড ল্যাপটপ চার্জার ব্যবহার করেন বা মেটালের টেবিলে সরাসরি রাখেন তবে এমন হতে পারে। মায়াকে কাঠ, প্লাস্টিক বা মাউসপ্যাডের ওপর রাখুন এবং ভালো মানের চার্জার দিন।",
      },
      {
        q: "টাচ করতে জোরে চাপ দিতে হচ্ছে বা একাধিকবার ট্যাপ করতে হচ্ছে",
        a: "মায়ার পায়ের ভেতরের অংশে সেন্সর থাকে। নখ দিয়ে না চেপে আঙুলের নরম মাংসল অংশ দিয়ে আলতো ও পুরো স্পর্শ করুন। হাত বা মায়ার পা ভেজা থাকলে মুছে শুকনো করে নিন।",
      },
      {
        q: "দুটো পা চেপে ধরেও স্লিপ মোড চালু হচ্ছে না",
        a: "বাম পা (T1) এবং ডান পা (T2) ঠিক একই সাথে স্পর্শ করে পূর্ণ ১.৮ সেকেন্ড ধরে রাখতে হবে। মাঝখানে একটি বৃত্তাকার প্রোগ্রেস রিং ঘুরবে। রিংটি ১০০% পূর্ণ না হওয়া পর্যন্ত আঙুল সরাবেন না।",
      },
    ],
  },
  {
    category: "ওয়াই-ফাই ও নেটওয়ার্ক সংযোগ সমস্যা",
    badge: "ওয়ারলেস নেটওয়ার্কিং",
    items: [
      {
        q: "সেটআপের সময় আমার বাসার ওয়াই-ফাই নেটওয়ার্কের নাম আসছে না",
        a: "মায়ার ESP32-C3 চিপ শুধুমাত্র ২.৪ GHz ওয়াই-ফাই ফ্রিকোয়েন্সিতে কাজ করে। এটি ৫ GHz ফ্রিকোয়েন্সি সমর্থন করে না। আপনার রাউটারে যদি 2.4G ও 5G একই নামে থাকে, তবে রাউটার সেটিংসে গিয়ে আলাদা ২.৪ GHz নেটওয়ার্ক চালু করে দিন।",
      },
      {
        q: "ওয়াই-ফাই কানেক্ট হচ্ছে না বা বারবার ডিসকানেক্ট হয়ে যাচ্ছে",
        a: "ওয়াই-ফাই পাসওয়ার্ডে জটিল ইউনিকোড ক্যারেক্টার এড়িয়ে চলুন। মায়া সাধারণ বাসাবাড়ির WPA/WPA2-Personal নেটওয়ার্কে কাজ করে। বিশ্ববিদ্যালয় বা অফিসের যেসব ওয়াই-ফাইতে লগইন পেইজ বা ইউজারনেম দিতে হয় (Enterprise / Captive Portal) সেগুলো মায়ায় সরাসরি কাজ করবে না।",
      },
      {
        q: "কাছে অ্যান্ড্রয়েড ফোন না থাকলে ওয়াই-ফাই সেটআপ করার উপায় কী?",
        a: "মায়ার নিজস্ব হটস্পট মোড রয়েছে! ডান পা (T2) ২.৫ সেকেন্ড চেপে ধরলে স্ক্রিনে QR ও সেটআপ মোড আসবে। মায়া তখন 'MAYA-SETUP' নামের নিজস্ব ওয়াই-ফাই ছড়াবে। ল্যাপটপ বা আইফোন দিয়ে সেই ওয়াই-ফাইতে যুক্ত হয়ে ব্রাউজারে 192.168.4.1 লিখে এন্টার দিলেই ওয়াই-ফাই দেওয়ার ওয়েব পেজ পাওয়া যাবে।",
      },
      {
        q: "ওয়াই-ফাই ছাড়াও কি মায়াকে সম্পূর্ণ ব্যবহার করা সম্ভব?",
        a: "অবশ্যই! মায়ার চোখ, ৮টি মিষ্টি মুড, আদরের ডায়ালগ, পোমোডোরো টাইমার, স্টপওয়াচ এবং ৭টি আর্কেড গেম সম্পূর্ণ অফলাইনে ১০০% কাজ করে। ইন্টারনেট শুধুমাত্র লাইভ আবহাওয়া, নির্ভুল ঘড়ি সিঙ্ক এবং নোটিফিকেশনের জন্য দরকার।",
      },
    ],
  },
  {
    category: "মোবাইল অ্যাপ ও ব্লুটুথ পেয়ারিং সমস্যা",
    badge: "ব্লুটুথ ও অ্যাপ",
    items: [
      {
        q: "MAYA Companion অ্যাপে স্ক্যান করলে মায়াকে খুঁজে পাচ্ছে না",
        a: "১) ফোনের ব্লুটুথ এবং লোকেশন (অ্যান্ড্রয়েড ১২+ এর ক্ষেত্রে Nearby Devices পারমিশন) চালু আছে কিনা দেখে নিন। ২) মায়াকে সেটআপ স্ক্রিনে রাখুন (T2 ২.৫ সেকেন্ড চেপে ধরুন)। ৩) স্ক্যানের সময় ফোনটিকে মায়ার ১ মিটারের মধ্যে রাখুন।",
      },
      {
        q: "পেয়ারিং ফেইল বা 'Connecting' অবস্থায় আটকে যাচ্ছে",
        a: "ফোনের সিস্টেম ব্লুটুথ সেটিংসে গিয়ে পূর্বে সেভ থাকা 'MAYA' বা 'ESP32' ডিভাইসটি 'Forget / Unpair' করে দিন। তারপর মায়ার T2 ২.৫ সেকেন্ড চেপে কিউআর স্ক্রিন রিফ্রেশ করুন এবং অ্যাপ থেকে পুনরায় পেয়ার করুন।",
      },
      {
        q: "ব্লুটুথ দিয়ে মায়াকে ওয়াই-ফাই পাঠানো যাচ্ছে না",
        a: "১) ফোনের ব্লুটুথ সেটিংসে গিয়ে পেয়ার করা ডিভাইসের তালিকা থেকে 'MAYA' খুঁজে 'Forget / Unpair' করুন। ২) ব্লুটুথ বন্ধ করুন, কয়েক সেকেন্ড অপেক্ষা করে আবার চালু করুন। ৩) MAYA Companion অ্যাপ আবার খুলে ওয়াই-ফাই তথ্য পুনরায় পাঠান। পুরোনো ব্লুটুথ বন্ড মুছে গেলে বেশিরভাগ ক্ষেত্রে সমস্যা মিটে যায়।",
      },
      {
        q: "ফোনে মেসেজ বা কল এলেও মায়ার স্ক্রিনে নোটিফিকেশন আসছে না",
        a: "১) অ্যান্ড্রয়েড সেটিংস > Apps > Special App Access > Notification Access-এ গিয়ে MAYA Companion অ্যাপকে নোটিফিকেশন পড়ার পারমিশন দিন। ২) ফোনের ব্যাটারি অপটিমাইজেশন সেটিংসে অ্যাপটিকে 'Unrestricted' করে দিন যাতে ব্যাকগ্রাউন্ডে সার্ভিস বন্ধ না হয়।",
      },
    ],
  },
  {
    category: "ঘড়ি, আবহাওয়া ও ডেটা সিঙ্ক সমস্যা",
    badge: "ডেটা সিঙ্ক্রোনাইজেশন",
    items: [
      {
        q: "ঘড়িতে ভুল সময় বা 00:00 দেখাচ্ছে",
        a: "মায়ার সঠিক সময় পেতে ওয়াই-ফাই প্রয়োজন হয়। মেনু থেকে System Info স্ক্রিনে গিয়ে দেখুন Wi-Fi স্ট্যাটাস 'CONNECTED' আছে কিনা। ডিফল্টভাবে মায়া বাংলাদেশ সময় (UTC+6) অনুযায়ী চলে, যা অ্যাপ থেকে পরিবর্তন করা যায়।",
      },
      {
        q: "আবহাওয়ার জায়গায় '--' দেখাচ্ছে বা ভুল শহরের তাপমাত্রা আসছে",
        a: "MAYA Companion মোবাইল অ্যাপটি খুলে Settings অপশনে যান এবং আপনার শহরের নাম (যেমন: 'Dhaka', 'Chittagong') লিখে সেভ করুন। মায়া পরবর্তী ৬০ সেকেন্ডের মধ্যে আবহাওয়া আপডেট করে নেবে।",
      },
      {
        q: "পোমোডোরোর ফোকাস টাইম মোবাইল অ্যাপে সিঙ্ক হচ্ছে না",
        a: "মায়া ফোকাস মিনিটগুলো মেমোরিতে জমা রাখে। ফোন মায়ার ব্লুটুথ রেঞ্জে এলে বা মায়া ওয়াই-ফাইতে থাকলে স্বয়ংক্রিয়ভাবে প্রতিদিনের ফোকাস সময় অ্যাপের ড্যাশবোর্ডে সিঙ্ক হয়ে যায়।",
      },
    ],
  },
  {
    category: "ফার্মওয়্যার আপডেট",
    badge: "সাপোর্ট",
    items: [
      {
        q: "মায়ার ফার্মওয়্যার কীভাবে আপডেট করব?",
        a: "আপনাকে কিছু করতে হবে না। ফার্মওয়্যার আপডেট Xentoryx Labs নিজে USB দিয়ে করে। কোনো আপডেট দরকার হলে বা মায়া ঠিকমতো না চললে WhatsApp (+880 1892-126867) বা xentoryxlabs@gmail.com-এ জানান, আমরা আপডেট করে দেব।",
      },
      {
        q: "আপডেট করলে কি Wi-Fi বা হাই স্কোর মুছে যাবে?",
        a: "না। সাধারণ আপডেটে আপনার Wi-Fi, গেমের হাই স্কোর, মায়ার নাম আর অ্যাপের সাথে পেয়ারিং ঠিক থাকে।",
      },
    ],
  },
  {
    category: "বডি, অ্যাক্সেসরিজ ও যত্ন সংক্রান্ত টিপস",
    badge: "শারীরিক যত্ন",
    items: [
      {
        q: "অ্যাক্সেসরিজ (কান, ক্রাউন, চারা) কিছুটা ঢিলে মনে হচ্ছে",
        a: "মায়ার অ্যাক্সেসরিজ কোনো গ্লু ছাড়া নির্ভুল স্ন্যাপ-ফিট প্রযুক্তিতে আটকে থাকে। অ্যাক্সেসরির পিনটি মায়ার মাথার খাঁজে সোজা রেখে আলতো চাপ দিয়ে বসিয়ে দিন। বেশি আলগা মনে হলে অ্যাক্সেসরির পিনের গায়ে সামান্য এক পরত পেপার টেপ জড়িয়ে দিলে খুব শক্তভাবে আটকে থাকে।",
      },
      {
        q: "মায়ার পেছনের অংশ স্পর্শ করলে সামান্য গরম অনুভূত হয়",
        a: "মায়ার ভেতরে ১৬০ মেগাহার্টজের শক্তিশালী ডুয়াল-কোর প্রসেসর, হাই-স্পিড ওয়াই-ফাই রেডিও এবং আইপিএস ডিসপ্লে ব্যাকলাইট অনবরত কাজ করায় পেছনের অংশ সামান্য উষ্ণ হওয়া সম্পূর্ণ স্বাভাবিক এবং নিরাপদ।",
      },
      {
        q: "মায়াকে কি সারাদিন ডেস্কে প্লাগ ইন করে রাখা নিরাপদ?",
        a: "হ্যাঁ, সম্পূর্ণ নিরাপদ! মায়াকে ডেস্কে সার্বক্ষণিক অন রাখার উপযোগী করেই ডিজাইন করা হয়েছে। ডিসপ্লের আয়ু বাড়াতে অব্যবহৃত অবস্থায় ডুয়াল টাচ দিয়ে স্লিপ মোড ব্যবহার করতে পারেন।",
      },
    ],
  },
];

function H2({ id, n, children }: { id: string; n?: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight sm:text-3xl text-[#1d1d1f]">
      {n !== undefined && (
        <span className="mr-3 font-mono text-xl font-bold text-[#0071e3]">[{String(n).padStart(2, "0")}]</span>
      )}
      {children}
    </h2>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="border-t border-black/10 py-12 first:border-0 first:pt-0 print:break-inside-avoid">{children}</section>;
}

const P = "mt-4 max-w-2xl leading-relaxed text-black/75 font-mono text-xs";

export default function DocsPageBn() {
  return (
    <LangProvider lang="bn">
      <div className="print:hidden">
        <HtmlLang lang="bn" />
        <Nav home={false} />
      </div>

      <header className="bg-[#f5f5f7] pb-14 pt-28 print:bg-white print:pt-0 border-b border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#0071e3]">
              <span className="h-2 w-2 rounded-full bg-[#0071e3]" />
              <span>অফিসিয়াল টেকনিক্যাল ম্যানুয়াল ও অ্যাপস · ফার্মওয়্যার v১.৫</span>
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f]">
              মায়াকে <span className="text-[#0071e3]">জানুন</span>
            </h1>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-black/70 font-mono text-xs leading-relaxed">
              বক্স খোলা থেকে শুরু করে অ্যাপ দিয়ে পেয়ারিং, দুই পায়ের স্পর্শ কন্ট্রোল, ৮টি রোবোটিক মুড, ১০টি স্ক্রিন, ৭টি গেম এবং বিস্তারিত সমস্যা সমাধানের নির্দেশিকা।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/en/docs"
              className="rounded-full border border-black/20 bg-white px-4 py-2 font-mono text-xs font-bold text-[#1d1d1f] transition hover:bg-[#e8e8ed]"
            >
              Read in English →
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[14rem_1fr]">
        <aside className="print:hidden">
          <nav className="sticky top-24 hidden lg:block" aria-label="On this page">
            <div className="font-mono text-xs font-bold text-black/40">গাইড সূচিপত্র</div>
            <ol className="mt-4 space-y-2 text-sm">
              {TOC_BN.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="font-mono text-xs text-black/70 transition-colors hover:text-[#0071e3]">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">

          {/* Section: Official Apps Download */}
          <Section>
            <div id="apps" className="scroll-mt-24 space-y-6">
              <div className="rounded-3xl border border-black/15 bg-[#f5f5f7] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0071e3]">
                      সফটওয়্যার ইকোসিস্টেম
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
                      Maya অফিশিয়াল অ্যাপ ও টুলস
                    </h2>
                  </div>
                  <span className="self-start rounded-full bg-[#1d1d1f] px-3 py-1 font-mono text-[11px] font-bold text-white">
                    v1.6.0
                  </span>
                </div>

                <div className="grid max-w-xl gap-6">
                  {/* Android Companion */}
                  <div className="flex flex-col justify-between rounded-2xl border border-black/10 bg-[#ffffff] p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] font-bold text-black/50">মোবাইল কম্প্যানিয়ন</span>
                        <span className="font-mono text-[10px] font-bold text-[#0071e3]">Android 7.0+</span>
                      </div>
                      <h3 className="font-bold text-xl text-[#1d1d1f]">MAYA Companion for Android</h3>
                      <p className="font-mono text-xs text-black/70 mt-2 leading-relaxed">
                        মোবাইল থেকে ব্লুটুথ দিয়ে অটোমেটিক পেয়ারিং, দ্রুত ওয়াই-ফাই সেটআপ, ফোনের নোটিফিকেশন মায়ায় রিলে করা, মুড ওভাররাইড এবং ফোকাস স্টাডি অ্যানালিটিক্স।
                      </p>
                    </div>
                    <div className="mt-6">
                      <a
                        href={APP_RELEASE.file}
                        download
                        className="flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 font-mono text-xs font-bold text-white shadow-sm transition hover:bg-[#0071e3] hover:text-black"
                      >
                        <span>↓ ডাউনলোড APK প্যাকেজ</span>
                        <span className="text-[10px] opacity-70">28 MB</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Section: Quick Start */}
          <Section>
            <H2 id="start" n={1}>শুরু করা ও সেটআপ</H2>
            <p className={P}>
              মায়াকে বক্স থেকে বের করে কোনো জটিল স্ক্রু বা অ্যাসেম্বলি ছাড়াই সরাসরি ব্যবহার করা যায়। নিচের ৪টি ধাপ অনুসরণ করুন:
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "১. পাওয়ার সংযোগ",
                  "বক্সে থাকা USB-C কেবলটি যেকোনো ৫ ভোল্ট / ১ অ্যাম্পিয়ার বা তার বেশি ক্ষমতার অ্যাডাপ্টারে লাগান। মায়ার কোনো ব্যাটারি নেই, সবসময় প্লাগেই চলে।",
                ],
                [
                  "২. সেন্সর অটো-ক্যালিব্রেশন",
                  "পাওয়ার পাওয়ার পর প্রথম ৩ সেকেন্ড মায়াকে স্পর্শ করবেন না। এ সময় তার দুই পায়ের টাচ সেন্সর চারপাশের পরিবেশ অনুযায়ী ব্যালান্স হয়ে নেয়।",
                ],
                [
                  "৩. আনন্দময় অভ্যর্থনা",
                  "মায়া তার গোল আইপিএস স্ক্রিনে হাত নেড়ে হাই বলবে এবং চোখ খুলে আপনার ঘরের চারদিকে তাকাতে শুরু করবে।",
                ],
                [
                  "৪. ব্লুটুথ ও ওয়াই-ফাই পেয়ার",
                  "MAYA Companion অ্যাপ অন করে 'Pair New Maya' চাপুন। ব্লুটুথে মায়াকে সিলেক্ট করে আপনার বাসার ২.৪ GHz ওয়াই-ফাই দিয়ে দিন।",
                ],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 flex flex-col justify-between">
                  <div>
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-[#1d1d1f] text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="mt-3 font-bold text-sm text-[#1d1d1f]">{t}</div>
                    <p className="mt-2 text-xs font-mono leading-relaxed text-black/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl border border-[#0071e3]/30 bg-[#0071e3]/5 p-5 font-mono text-xs text-black/80">
              <span className="font-bold text-[#0071e3]">অফলাইন ব্যবহারের স্বাধীনতা:</span> মায়ার জন্য ওয়াই-ফাই কোনো বাধ্যতামূলক শর্ত নয়! ওয়াই-ফাই ছাড়াও মায়ার চোখ, ৮টি মুড, স্পর্শে আদর, পোমোডোরো টাইমার, স্টপওয়াচ ও ৭টি আর্কেড গেম ১০০% কাজ করে। ওয়াই-ফাই যুক্ত হলে সে রিয়েলটাইম আবহাওয়া, নির্ভুল ঘড়ি সিঙ্ক ও মোবাইল নোটিফিকেশন পায়।
            </div>
          </Section>

          {/* Section: Touch Controls */}
          <Section>
            <H2 id="controls" n={2}>টাচ কন্ট্রোল ও জেসচার</H2>
            <p className={P}>
              মায়ার দুই পায়ের ভেতরে উচ্চ সংবেদনশীল ক্যাপাসিটিভ টাচ সেন্সর রয়েছে। <b className="text-[#1d1d1f]">বাম পায়ে T1</b> এবং <b className="text-[#1d1d1f]">ডান পায়ে T2</b> অবস্থিত। আলতো ছোঁয়াই যথেষ্ট, জোরে চাপ দেওয়ার প্রয়োজন নেই।
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5f5f7] text-xs font-semibold font-mono text-black/60">
                  <tr>
                    <th className="p-3 sm:p-4">টাচ বা জেসচার</th>
                    <th className="p-3 sm:p-4">ট্যাগ</th>
                    <th className="p-3 sm:p-4">মুখের জীবন্ত পর্দায়</th>
                    <th className="p-3 sm:p-4">স্ক্রিন ও মিনি গেমে</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-mono text-xs bg-[#ffffff]">
                  {CONTROLS_BN.map((c) => (
                    <tr key={c.action} className="hover:bg-black/5 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#1d1d1f]">{c.action}</td>
                      <td className="p-3 sm:p-4">
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold text-black/70">
                          {c.tag}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-black/80">{c.face}</td>
                      <td className="p-3 sm:p-4 text-black/70">{c.screens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 font-mono text-xs">
              <div className="rounded-xl border border-black/10 bg-[#f5f5f7] p-4">
                <span className="font-bold text-[#1d1d1f]">ডুয়াল-টাচ স্লিপ ইঞ্জিন (T1 + T2):</span>
                <p className="mt-1 text-black/70 leading-relaxed">
                  দুটো পায়ে একসাথে ১.৮ সেকেন্ড স্পর্শ করে ধরে রাখলে মাঝখানে একটি রিং পূর্ণ হবে। রিং পূর্ণ হলেই মায়া শান্তির ঘুমে চলে যায় এবং চোখে মিটিমিটি তারা ও Zzz ভাসে। একইভাবে আবার স্পর্শ করলে সে জেগে ওঠে!
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-[#f5f5f7] p-4">
                <span className="font-bold text-[#1d1d1f]">ইনস্ট্যান্ট পেয়ারিং শর্টকাট (T2 চেপে ধরা):</span>
                <p className="mt-1 text-black/70 leading-relaxed">
                  যেকোনো অবস্থা থেকে ডান পা (T2) ২.৫ সেকেন্ড চেপে ধরলেই সাথে সাথে ব্লুটুথ ক্লেম ও Wi-Fi QR কোড স্ক্রিন খুলে যাবে।
                </p>
              </div>
            </div>
          </Section>

          {/* Section: Moods */}
          <Section>
            <H2 id="moods" n={3}>মুড ও জীবন্ত ব্যক্তিত্ব</H2>
            <p className={P}>
              মায়াতে রয়েছে অটোমেটিক রোবোটিক আই ইঞ্জিন যা বাস্তব প্রাণীর মতো চোখের মণি নড়াচড়া করায়, পলক ফেলে এবং ৮টি স্বতন্ত্র আবেগে সাড়া দেয়:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {MOODS.map((m) => (
                <div key={m.id} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
                    <MayaFace mood={m.id} className="h-12 w-12" />
                  </div>
                  <div className="mt-3 font-bold text-sm text-[#1d1d1f]">{m.bn}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#0071e3] font-semibold">{m.label}</div>
                  <div className="mt-1 font-mono text-[10px] text-black/60 italic whitespace-pre-line leading-tight">
                    &ldquo;{m.line}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5">
                <div className="font-bold text-sm text-[#1d1d1f] mb-2">বিশেষ আচরণগত বৈশিষ্ট্য</div>
                <ul className="list-disc space-y-1 pl-5 text-black/70">
                  <li><b>স্বয়ংক্রিয় ভাববিনিময়:</b> ডেস্কে চুপচাপ বসে থাকলেও প্রতি ৪.৫ থেকে ৮.৫ সেকেন্ড পর পর মায়া আপন মনে ১০ ধরনের মিষ্টি অভিব্যক্তি দেয় (হাসি, কৌতূহল, চোখ টেপা, লাজুক মুখ ইত্যাদি)।</li>
                  <li><b>মন খারাপ (নিঃসঙ্গ মোড):</b> ৭৫ সেকেন্ড মায়াকে কোনো স্পর্শ না করলে সে লাজুক চোখে তাকায় এবং তাকে একটু সময় দিতে সুন্দর বাংলা ডায়ালগ কার্ড দেখায়।</li>
                  <li><b>বাংলা সংলাপ কার্ড:</b> প্রতি ৩ বার আলতো আদরে মায়া মজার মজার মিষ্টি বাংলা কার্ড নিয়ে আপনার সাথে কথা বলে।</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Section: Menu */}
          <Section>
            <H2 id="menu" n={4}>ক্যারোসেল মেনু ও ১০টি স্ক্রিন</H2>
            <p className={P}>
              ডান পায়ে <b className="text-[#1d1d1f]">T2</b> স্পর্শ করলেই থ্রিডি নিয়ন মেনু ক্যারোসেল খুলে যায়। প্রতিটি পরবর্তী ট্যাপে পরের ফিচার আসে এবং বাম পায়ে <b className="text-[#1d1d1f]">T1</b> স্পর্শে সেই স্ক্রিন ওপেন হয়। যেকোনো স্ক্রিন থেকে বের হতে T1 ১ সেকেন্ড চেপে রাখুন।
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {MENU_DETAILS_BN.map((m) => (
                <div key={m.title} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1d1d1f]">{m.title}</span>
                    <span className="rounded bg-black/10 px-2 py-0.5 text-[10px] font-bold text-black/60">
                      {m.subtitle}
                    </span>
                  </div>
                  <p className="mt-2 text-black/70 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Section: Games */}
          <Section>
            <H2 id="games" n={5}>আর্কেড গেমস নির্দেশিকা</H2>
            <p className={P}>
              মেনু থেকে <b className="text-[#1d1d1f]">Mini games</b> ওপেন করুন। T2 দিয়ে গেম বেছে নিন এবং T1 দিয়ে শুরু করুন। প্রতিটি গেম মসৃণ ৬০ FPS স্পিডে চলে এবং বাম পায়ের T1 দিয়ে খেলা যায়। আপনার করা প্রতিটি হাই স্কোর মায়ার মেমোরিতে আজীবন সেভ থাকে।
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {GAME_DETAILS_BN.map((g) => (
                <div key={g.id} className="flex flex-col justify-between rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1d1d1f]">{g.name}</span>
                      <span className="rounded-full bg-[#0071e3] px-2.5 py-0.5 text-[10px] font-bold text-black">
                        {g.genre}
                      </span>
                    </div>
                    <p className="mt-2 text-black/70 leading-relaxed">{g.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
                    <span className="text-[11px] text-black/50">কন্ট্রোল:</span>
                    <span className="rounded bg-[#1d1d1f] px-2.5 py-1 text-[11px] font-bold text-white">
                      {g.controls}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-black/60">
              <b>টিপস:</b> যেকোনো গেমে থাকা অবস্থায় T1 বা T2 ১ সেকেন্ড চেপে ধরলেই গেম থেকে বের হয়ে মেনুতে ফেরা যায়।
            </p>
          </Section>

          {/* Section: Pairing & Wi-Fi */}
          <Section>
            <H2 id="pairing" n={6}>ব্লুটুথ ও ওয়াই-ফাই সেটআপ</H2>
            <p className={P}>
              মায়াকে ইন্টারনেটে যুক্ত করতে নিচের যেকোনো একটি সহজ পদ্ধতি ব্যবহার করুন:
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6">
                <span className="font-bold text-xs text-[#0071e3]">পদ্ধতি ১ (সুপারিশকৃত)</span>
                <h3 className="font-bold text-base text-[#1d1d1f] mt-1">অ্যান্ড্রয়েড অ্যাপ দিয়ে অটো পেয়ারিং</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-black/75 leading-relaxed">
                  <li>মায়াকে অন করে MAYA Companion অ্যাপটি চালু করুন।</li>
                  <li><b>Pair New Maya</b> বাটনে চাপ দিন। অ্যাপটি ব্লুটুথে মায়াকে স্বয়ংক্রিয়ভাবে খুঁজে নেবে।</li>
                  <li>মায়াকে সিলেক্ট করে আপনার ওয়াই-ফাই পাসওয়ার্ড দিয়ে দিন।</li>
                  <li>এনক্রিপ্টেড ব্লুটুথের মাধ্যমে পাসওয়ার্ড পৌঁছে যাবে এবং মায়া সফলভাবে কানেক্ট হয়ে যাবে।</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6">
                <span className="font-bold text-xs text-[#0071e3]">পদ্ধতি ২ (অ্যাপ ছাড়া)</span>
                <h3 className="font-bold text-base text-[#1d1d1f] mt-1">মায়ার নিজস্ব ওয়াই-ফাই হটস্পট</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-black/75 leading-relaxed">
                  <li>ডান পা (T2) ২.৫ সেকেন্ড চেপে ধরে সেটআপ মোডে যান।</li>
                  <li>মায়ার স্ক্রিনে পাসওয়ার্ডসহ <code className="rounded bg-black/10 px-1 font-bold text-[#0071e3]">MAYA-SETUP</code> হটস্পট ভেসে উঠবে।</li>
                  <li>ফোন বা ল্যাপটপের ওয়াই-ফাই দিয়ে এতে যুক্ত হোন।</li>
                  <li>ব্রাউজারে <code className="font-bold text-[#1d1d1f]">http://192.168.4.1</code> লিখে আপনার বাসার ওয়াই-ফাই সেভ করে দিন।</li>
                </ol>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-[#ffffff] p-4 font-mono text-xs text-black/70">
              <b>নেটওয়ার্ক স্পেক:</b> মায়ার জন্য ২.৪ GHz ওয়াই-ফাই নেটওয়ার্ক প্রযোজ্য (802.11 b/g/n, WPA/WPA2-PSK)। ৫ GHz কেবল বা প্রাতিষ্ঠানিক ক্যাপটিভ পোর্টাল সরাসরি সাপোর্টেড নয়।
            </div>

            <div className="mt-4 rounded-xl border border-[#0071e3]/25 bg-[#f0f6ff] p-4 font-mono text-xs text-black/75 leading-relaxed">
              <b className="text-[#0071e3]">ব্লুটুথে ওয়াই-ফাই পাঠানো যাচ্ছে না?</b> ফোনের ব্লুটুথ সেটিংসে গিয়ে MAYA-কে <b>Forget / Unpair</b> করুন, ব্লুটুথ <b>একবার বন্ধ করে আবার চালু</b> করুন, তারপর অ্যাপ থেকে আবার ওয়াই-ফাই পাঠান।
            </div>
          </Section>

          {/* Section: Accessories */}
          <Section>
            <H2 id="accessories" n={7}>মডুলার অ্যাক্সেসরিজ</H2>
            <p className={P}>
              মায়া সম্পূর্ণ মডুলার। বানি কান, পান্ডা কান, রাজকীয় ক্রাউন, কচি চারা, ডিজে হেডফোন ও পিঠের ব্যাকপ্যাক কোনো গ্লু বা নাটবল্টু ছাড়াই খুব সহজে লাগানো ও বদলানো যায়:
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">১. নতুন লুক পরাতে</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  অ্যাক্সেসরির পিনটি মায়ার মাথার বা পিঠের খাঁজের সাথে সোজা রেখে নিচের দিকে আলতো চাপ দিয়ে বসিয়ে দিন।
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">২. বদলাতে বা খুলতে</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  অ্যাক্সেসরিটি ধরে সোজা ওপরের দিকে আলতো টান দিন। ডানে-বামে মোচড় না দিয়ে সোজা টানলে পিন ভালো থাকে।
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">৩. মিনি কি-চেইন</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  বক্সে একটি ২৫ মিমি কিউট মায়া কি-চেইন উপহার দেওয়া হয়েছে। ছোট পার্টস হওয়ায় ৩ বছরের ছোট বাচ্চাদের নাগালের বাইরে রাখুন।
                </p>
              </div>
            </div>
          </Section>

          {/* Section: Firmware */}
          <Section>
            <H2 id="firmware" n={8}>ফার্মওয়্যার আপডেট</H2>
            <p className={P}>
              কম্পিউটারে কিছু ইন্সটল করতে হবে না। মায়ার ফার্মওয়্যার আপডেট Xentoryx Labs নিজে USB দিয়ে করে।
              নতুন আপডেট এলে বা মায়া ঠিকমতো না চললে আমাদের জানান:
            </p>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 font-mono text-xs text-black/70">
              <li>WhatsApp: <b>+880 1892-126867</b></li>
              <li>ইমেইল: <b>xentoryxlabs@gmail.com</b></li>
            </ul>
            <p className="mt-3 font-mono text-xs text-black/60">
              সাধারণ আপডেটে আপনার Wi-Fi, হাই স্কোর আর মায়ার নাম মুছে যায় না।
            </p>
          </Section>

          {/* Section: Reset */}
          <Section>
            <H2 id="reset" n={9}>ফ্যাক্টরি রিসেট পদ্ধতি</H2>
            <p className={P}>
              কাউকে উপহার দেওয়ার আগে বা সব ডেটা পরিষ্কার করতে ফ্যাক্টরি রিসেট ব্যবহার করুন। এটি ওয়াই-ফাই পাসওয়ার্ড, পেয়ারিং এবং হাই স্কোর মুছে নতুনের মতো ফ্রেশ করে দেয়:
            </p>
            <ol className="mt-5 max-w-2xl list-decimal space-y-2 pl-5 font-mono text-xs text-black/70">
              <li>ডান পা (T2) চেপে মেনু থেকে <b>Reset device</b> অপশনে যান।</li>
              <li>বাম পা (T1) দিয়ে কনফার্মেশন স্ক্রিন ওপেন করুন।</li>
              <li>
                <b className="text-[#1d1d1f]">T1 টানা ১.৫ সেকেন্ড চেপে ধরে রাখুন</b>। স্ক্রিনে ০% থেকে ১০০% পর্যন্ত একটি কাউন্টডাউন রিং ভরবে।
              </li>
              <li>১০০% পূর্ণ হলে ছেড়ে দিন। মায়া পুরো ফ্ল্যাশ মেমোরি ক্লিয়ার করে নতুন সেটআপ মোডে ফিরে যাবে।</li>
            </ol>
            <p className="mt-3 font-mono text-xs text-black/60">
              <b>ক্যানসেল:</b> রিংটি ১০০% হওয়ার আগে আঙুল সরালে বা T2 চাপলে রিসেট বাতিল হয়ে মেনুতে ফিরে যাবে।
            </p>
          </Section>

          {/* Section: Care */}
          <Section>
            <H2 id="care" n={10}>যত্ন ও সতর্কতা</H2>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 font-mono text-xs text-black/70">
              <li><b>সঠিক বিদ্যুৎ সরবরাহ:</b> শুধুমাত্র ভালো ৫ ভোল্ট USB পাওয়ার সাপ্লাই ব্যবহার করুন (১A থেকে ২.৪A)।</li>
              <li><b>তাপমাত্রা থেকে সুরক্ষা:</b> মায়ার বডি সূক্ষ্ম ম্যাট PLA প্লাস্টিকে তৈরি। কড়া রোদে, গাড়ির ভেতর বা হিটারের কাছে রাখবেন না; ৫০° সেলসিয়াসের বেশি গরমে PLA নরম হতে শুরু করে।</li>
              <li><b>ডিসপ্লে পরিষ্কার:</b> শুকনো নরম মাইক্রোফাইবার কাপড় দিয়ে স্ক্রিন মুছবেন। সরাসরি পানি বা রাসায়নিক স্প্রে করবেন না।</li>
              <li><b>বডির যত্ন:</b> নরম শুকনো ব্রাশ দিয়ে ধুলাবালি পরিষ্কার করুন। কখনোই পানিতে ভেজাবেন না।</li>
              <li><b>ছোট বাচ্চাদের সুরক্ষা:</b> অ্যাক্সেসরিজ ও কি-চেইন ছোট হওয়ায় ৩ বছরের কম বয়সী শিশুদের নাগালের বাইরে রাখুন।</li>
            </ul>
          </Section>

          {/* Section: Specs */}
          <Section>
            <H2 id="specs" n={11}>হার্ডওয়্যার স্পেসিফিকেশন</H2>
            <dl className="mt-6 divide-y divide-black/10 border-y border-black/10 font-mono text-xs">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-bold text-[#1d1d1f]">{k}</dt>
                  <dd className="text-black/70">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Section: Troubleshooting */}
          <Section>
            <H2 id="help" n={12}>সমস্যা সমাধান ও জরুরি প্রশ্নোত্তর</H2>
            <p className={P}>
              কোনো কারিগরি সমস্যা বা প্রশ্নের মুখোমুখি হলে নিচের ক্যাটাগরিগুলো থেকে সমাধান দেখে নিন:
            </p>

            <div className="mt-8 space-y-8">
              {TROUBLESHOOTING_BN.map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                    <span className="font-mono text-xs font-bold text-[#0071e3]">
                      {cat.badge}
                    </span>
                    <h3 className="font-bold text-lg text-[#1d1d1f]">{cat.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item) => (
                      <details key={item.q} className="group rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-sm text-[#1d1d1f]">
                          {item.q}
                          <span className="text-[#0071e3] transition-transform group-open:rotate-45 text-base font-bold ml-2">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 leading-relaxed text-black/75 border-t border-black/5 pt-2">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#1d1d1f] p-7 text-white sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-bold">আরও কোনো কারিগরি সাহায্য প্রয়োজন?</div>
                <div className="text-xs font-mono text-white/70">আমাদের ইঞ্জিনিয়ারিং সাপোর্ট টিম ২৪ ঘণ্টার মধ্যে সহায়তা প্রদান করে।</div>
              </div>
              <a
                href="mailto:contact@xentoryx.com"
                className="rounded-full bg-[#0071e3] px-6 py-3 font-mono text-xs font-bold text-black transition hover:bg-white"
              >
                contact@xentoryx.com
              </a>
            </div>

            <p className="mt-8 font-mono text-xs text-black/50 print:hidden">
              <Link href="/" className="text-[#0071e3] font-bold hover:underline">
                ← মূল পেজে ফিরে যান
              </Link>
            </p>
          </Section>
        </article>
      </div>

      <Footer />
    </LangProvider>
  );
}
