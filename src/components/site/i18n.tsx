"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Lang = "en" | "bn";

const en = {
  nav: {
    moods: "Moods", features: "Features", screens: "Screens", editions: "Editions", specs: "Specs", guide: "Guide", app: "App",
    reserve: "Reserve", open: "Open menu", close: "Close menu", other: "বাংলা", otherLabel: "বাংলায় দেখুন",
    toDark: "Switch to dark mode", toLight: "Switch to light mode",
  },
  hero: {
    kicker: "Season One · Made in Bangladesh",
    line: "A tiny desk robot with a living face. Tap her.",
    reserve: "Reserve yours", moods: "Meet her moods", dress: "Dress her up", caption: "Soft from every side.",
    looks: { plain: "Classic", bunny: "Bunny", panda: "Panda", crown: "Royal", sprout: "Sprout", headphones: "Beats", backpack: "Explorer" },
    srTitle: "Maya, a tiny desk robot with a living face",
  },
  manifesto: {
    text: "Small enough for the corner of your desk. Alive enough to notice you. She blinks, glances around, gets sleepy after lunch, grumbles when you poke her too much, and leaves you little notes in",
    accent: "বাংলা",
    end: ".",
  },
  moods: {
    kicker: "Personality engine", title: "Eight moods. One face.",
    text: "Her eyes are drawn live, forty times a second. Her mood drifts through the day and changes with how you treat her.",
    labels: { happy: "Happy", love: "Love", sleepy: "Sleepy", surprised: "Surprised", bored: "Bored", annoyed: "Annoyed", angry: "Angry", dizzy: "Dizzy" } as Record<string, string>,
  },
  features: {
    kicker: "Inside", title: "Small on your desk.", titleSoft: "Big on the inside.",
    items: [
      ["A perfectly round face.", "1.28″ round IPS, 240 × 240 pixels on a 40 MHz bus, so every blink is smooth."],
      ["Little notes, in your language.", "Now and then she shows a card in Bangla: a good-morning, a nudge to drink water, a grumble."],
      ["Pat her. She notices.", "Two hidden touch pads. A pat makes her happy, a poke too many makes her grumpy."],
      ["A focus buddy.", "Pomodoro on a glowing arc: 25 minutes of work, 5 of rest, and a gentle reminder to stand up."],
      ["Set up in a minute.", "The Maya app finds her over Bluetooth and hands over your Wi-Fi. Weather, time and notifications follow."],
      ["Only yours.", "Each Maya has its own key. Pairing is encrypted end to end and only the owner's phone can claim her."],
    ] as [string, string][],
  },
  screens: {
    kicker: "Neon UI · LVGL 8.4", title: "More than a face.",
    text: "Tap the side pad and a 3D carousel spins up: eleven screens and a pocket arcade, all on one round display.",
    arcadeKicker: "The arcade", arcade: "7 games, played with one finger.",
    items: {} as Record<string, [string, string]>, // English comes from data.ts
  },
  editions: {
    kicker: "Season One · Launch price", title: "Seven boxes.", titleSoft: "One Maya.",
    text: "Every edition is the same Maya with its own accessory, eyes and mini keychain. Reserve now, pay when she ships.",
    reserve: "Reserve", mini: "mini keychain",
    items: {
      bunny: ["Bunny Edition", "Bunny ears", "Curious eyes"],
      panda: ["Panda Edition", "Panda ears", "Big round eyes"],
      crown: ["Royal Edition", "Gold crown with gems", "Wink"],
      sprout: ["Sprout Edition", "Little green sprout", "Sleepy eyes"],
      headphones: ["Beats Edition", "Dark pink headphones", "Happy eyes"],
      backpack: ["Explorer Edition", "Backpack with pocket", "Heart eyes"],
    } as Record<string, [string, string, string]>,
    accessories: { bunny: "Bunny ears", panda: "Panda ears", crown: "Crown", sprout: "Sprout", headphones: "Headphones", backpack: "Backpack" } as Record<string, string>,
    combo: {
      kicker: "The combo", name: "Complete Collection", best: "Best value",
      text: "One Maya, every look. Swap accessories whenever you like.",
      save: "You save", button: "Reserve the collection",
      features: ["Maya, fully assembled", "All 6 accessories", "All 6 mini keychains", "Ships first, before single orders"],
    },
    extras: [
      ["Extra accessory", "Fits every Maya"],
      ["Extra mini keychain", "25 mm, any of the six"],
      ["Delivery", "Inside Dhaka / rest of Bangladesh"],
    ] as [string, string][],
  },
  specs: {
    kicker: "Tech specs", title: "The details.", inBox: "In the box",
    startKicker: "Getting started", startTitle: "Three steps.", guideBefore: "Everything else is in the", guideLink: "user guide",
    getApp: "Get the Maya app",
    steps: [
      ["Plug in", "USB-C into any 5 V charger. Maya wakes up and says hi."],
      ["Pair", "The Maya app finds her over Bluetooth and sends your Wi-Fi securely."],
      ["Make her yours", "Pick your city, set notifications, and she's part of your desk."],
    ] as [string, string][],
    rows: null as [string, string][] | null, // English comes from data.ts
    box: null as string[] | null,
  },
  reserve: {
    title: "Reserve your Maya.",
    text: "No payment today, just a place in line. We'll email you when Season One is ready, in the order reservations came in.",
    count: (n: number) => `${n} ${n === 1 ? "person has" : "people have"} already reserved.`,
    thanks: "Thank you!", thanksText: "You're on the list. Maya can't wait to meet you.",
    name: "Name", namePh: "Your name", email: "Email", edition: "Edition", qty: "Qty",
    submit: "Reserve, pay later", loading: "Reserving…", error: "Something went wrong.",
    classic: "Classic, no accessory", surprise: "Surprise me",
  },
  footer: { rights: "Xentoryx Labs. Designed and printed in Bangladesh.", guide: "User guide", app: "Maya app" },
  app: {
    kicker: "Maya app · Android",
    title: "Get the Maya app.",
    text: "The app pairs your Maya over Bluetooth, gives her your Wi-Fi, and sends her the weather, the time and your phone's notifications.",
    download: "Download for Android",
    version: (v: string) => `Version ${v} · Android 7 or newer`,
    requires: "Android 7 or newer",
    soonTitle: "The app is almost ready.",
    soonText: "We're putting the finishing touches on it. Maya already works without it: her face, moods, clock, timers and games all run on the device.",
    soonMail: "Email me when it's out",
    stepsTitle: "Installing it",
    steps: [
      ["Download", "Tap the button above on your Android phone. The file is called maya.apk."],
      ["Allow the install", "Open the file. If Android asks, allow installs from your browser for this one app."],
      ["Pair your Maya", "Open the app, tap Pair New Maya and scan the QR code on her screen."],
    ] as [string, string][],
    note: "We publish the app ourselves, outside Google Play, so Android shows a warning the first time. That's expected. Only download it from this page.",
    scanTitle: "On a computer?",
    scanText: "Scan this with your phone's camera to open this page there.",
    iphone: "iPhone? The app is Android-only for now. You can still give Maya your Wi-Fi without it: open Wi-Fi setup on her and she makes her own hotspot. The guide shows how.",
    guide: "Read the user guide",
  },
};

type Dict = typeof en;

const bn: Dict = {
  nav: {
    moods: "মুড", features: "ফিচার", screens: "স্ক্রিন", editions: "এডিশন", specs: "স্পেক", guide: "গাইড", app: "অ্যাপ",
    reserve: "রিজার্ভ", open: "মেনু খুলুন", close: "মেনু বন্ধ করুন", other: "English", otherLabel: "View in English",
    toDark: "ডার্ক মোডে যান", toLight: "লাইট মোডে যান",
  },
  hero: {
    kicker: "প্রথম সিজন · বাংলাদেশে তৈরি",
    line: "জীবন্ত মুখের এক ছোট্ট ডেস্ক রোবট। ওকে একটু ছুঁয়ে দেখুন।",
    reserve: "রিজার্ভ করুন", moods: "ওর মুডগুলো দেখুন", dress: "সাজিয়ে দিন", caption: "সব দিক থেকেই নরম।",
    looks: { plain: "ক্লাসিক", bunny: "বানি", panda: "পান্ডা", crown: "রয়্যাল", sprout: "চারা", headphones: "বিটস", backpack: "এক্সপ্লোরার" },
    srTitle: "মায়া, জীবন্ত মুখের এক ছোট্ট ডেস্ক রোবট",
  },
  manifesto: {
    text: "টেবিলের কোণে আঁটার মতো ছোট, আপনাকে খেয়াল করার মতো জীবন্ত। সে চোখ পিটপিট করে, এদিক-ওদিক তাকায়, দুপুরের পর ঘুম ঘুম পায়, বেশি খোঁচালে রাগ করে, আর মাঝে মাঝে আপনাকে ছোট্ট চিরকুট দেয়",
    accent: "বাংলায়",
    end: "।",
  },
  moods: {
    kicker: "পার্সোনালিটি ইঞ্জিন", title: "আটটা মুড। একটাই মুখ।",
    text: "ওর চোখ সেকেন্ডে চল্লিশবার নতুন করে আঁকা হয়। দিনের সাথে সাথে মুড বদলায়, আর আপনি ওর সাথে কেমন আচরণ করছেন তার উপরও।",
    labels: { happy: "খুশি", love: "ভালোবাসা", sleepy: "ঘুম ঘুম", surprised: "অবাক", bored: "একঘেয়ে", annoyed: "বিরক্ত", angry: "রাগী", dizzy: "মাথা ঘোরা" },
  },
  features: {
    kicker: "ভেতরে", title: "টেবিলে ছোট।", titleSoft: "ভেতরে অনেক বড়।",
    items: [
      ["একদম গোল একটা মুখ।", "১.২৮″ গোল IPS ডিসপ্লে, ২৪০ × ২৪০ পিক্সেল, ৪০ MHz বাসে চলে, তাই প্রতিটা পলক মসৃণ।"],
      ["ছোট্ট চিরকুট, আপনার ভাষায়।", "মাঝে মাঝে সে বাংলায় একটা কার্ড দেখায়: শুভ সকাল, পানি খাওয়ার কথা মনে করানো, কিংবা একটু অভিমান।"],
      ["আদর করুন, সে টের পায়।", "দুটো লুকানো টাচ প্যাড। আলতো আদরে সে খুশি হয়, বেশি খোঁচালে রেগে যায়।"],
      ["মনোযোগের সঙ্গী।", "উজ্জ্বল বৃত্তে পোমোডোরো: ২৫ মিনিট কাজ, ৫ মিনিট বিরতি, আর উঠে দাঁড়ানোর আলতো তাগাদা।"],
      ["এক মিনিটেই সেটআপ।", "Maya অ্যাপ ব্লুটুথে ওকে খুঁজে নিয়ে আপনার Wi-Fi দিয়ে দেয়। তারপর আবহাওয়া, সময় আর নোটিফিকেশন।"],
      ["শুধু আপনার।", "প্রতিটা মায়ার নিজের চাবি আছে। পেয়ারিং পুরোটা এনক্রিপ্টেড, আর শুধু মালিকের ফোনই ওকে নিজের করতে পারে।"],
    ],
  },
  screens: {
    kicker: "নিয়ন UI · LVGL 8.4", title: "শুধু একটা মুখ নয়।",
    text: "পাশের প্যাডে ছুঁলে একটা 3D ক্যারোসেল ঘুরে ওঠে: এগারোটা স্ক্রিন আর পকেটে আস্ত একটা আর্কেড, সব একটা গোল ডিসপ্লেতে।",
    arcadeKicker: "আর্কেড", arcade: "৭টা গেম, খেলা যায় এক আঙুলে।",
    items: {
      clock: ["ঘড়ি", "নিয়ন অ্যানালগ ঘড়ি, মসৃণ সেকেন্ডের কাঁটা আর তারিখ।"],
      weather: ["আবহাওয়া", "তাপমাত্রা, আকাশ, আর্দ্রতা আর আপনার শহর, লাইভ।"],
      pomodoro: ["পোমোডোরো", "উজ্জ্বল বৃত্তে ২৫ মিনিট কাজ, ৫ মিনিট বিরতি।"],
      stopwatch: ["স্টপওয়াচ", "মিলিসেকেন্ড পর্যন্ত সময়, ল্যাপ, পজ আর রিসেট।"],
      stats: ["পরিসংখ্যান", "আপটাইম, CPU আর মেমরি এক নজরে।"],
      sysinfo: ["সিস্টেম তথ্য", "ফ্ল্যাশ, ফাঁকা RAM, MAC আর ফার্মওয়্যার ভার্সন।"],
      claim: ["পেয়ার", "একটা QR কোড, কয়েক সেকেন্ডে ফোনের সাথে জুড়ে যায়।"],
      wifi: ["Wi-Fi সেটআপ", "যেকোনো ব্রাউজার থেকে Wi-Fi দিন, অ্যাপ লাগবে না।"],
      notify: ["নোটিফিকেশন", "কল, মেসেজ আর অ্যালার্ট ভাসমান কাচের কার্ডে।"],
      games: ["আর্কেড", "সাতটা গেমের ক্যারোসেল, এক ছোঁয়ায় খেলা।"],
      dialogue: ["বাংলা কার্ড", "মায়া নিজের মুড নিয়ে বাংলায় কথা বলে।"],
      dino: ["ডাইনো রান", "দিনে-রাতে ক্যাকটাস টপকে দৌড়।"],
      flappy: ["ফ্ল্যাপি", "ছুঁয়ে ছুঁয়ে পাইপের ফাঁক দিয়ে ওড়া।"],
      shooter: ["স্পেস শুটার", "এলিয়েন বাহিনীর দিকে লেজার ছুড়ুন।"],
      stack: ["টাওয়ার স্ট্যাক", "ঠিক সময়ে ব্লক ফেলে উঁচু টাওয়ার।"],
      pong: ["সার্কেল পং", "গোল স্ক্রিনের চারপাশে পং।"],
      reflex: ["রিফ্লেক্স", "আলো জ্বলার অপেক্ষা, তারপর ছোঁয়া। মিলিসেকেন্ডের খেলা।"],
      brick: ["ব্রিক ব্রেকার", "রঙিন সব ইট ভেঙে ফেলুন।"],
    },
  },
  editions: {
    kicker: "প্রথম সিজন · লঞ্চ মূল্য", title: "সাতটা বাক্স।", titleSoft: "একটাই মায়া।",
    text: "প্রতিটা এডিশনে একই মায়া, শুধু আলাদা অ্যাক্সেসরি, চোখ আর মিনি কি-চেইন। এখন রিজার্ভ করুন, দাম দেবেন পাঠানোর সময়।",
    reserve: "রিজার্ভ", mini: "মিনি কি-চেইন",
    items: {
      bunny: ["বানি এডিশন", "খরগোশের কান", "কৌতূহলী চোখ"],
      panda: ["পান্ডা এডিশন", "পান্ডার কান", "বড় গোল চোখ"],
      crown: ["রয়্যাল এডিশন", "রত্নখচিত সোনালি মুকুট", "চোখ টিপ"],
      sprout: ["চারা এডিশন", "ছোট্ট সবুজ চারা", "ঘুম ঘুম চোখ"],
      headphones: ["বিটস এডিশন", "গাঢ় গোলাপি হেডফোন", "খুশি চোখ"],
      backpack: ["এক্সপ্লোরার এডিশন", "পকেটওয়ালা ব্যাকপ্যাক", "হার্ট চোখ"],
    },
    accessories: { bunny: "খরগোশের কান", panda: "পান্ডার কান", crown: "মুকুট", sprout: "চারা", headphones: "হেডফোন", backpack: "ব্যাকপ্যাক" },
    combo: {
      kicker: "কম্বো", name: "কমপ্লিট কালেকশন", best: "সেরা দামে",
      text: "একটা মায়া, সব সাজ। যখন খুশি অ্যাক্সেসরি বদলান।",
      save: "আপনি বাঁচাচ্ছেন", button: "কালেকশন রিজার্ভ করুন",
      features: ["পুরো জোড়া লাগানো মায়া", "৬টা অ্যাক্সেসরি", "৬টা মিনি কি-চেইন", "সিঙ্গেল অর্ডারের আগে পাঠানো হবে"],
    },
    extras: [
      ["বাড়তি অ্যাক্সেসরি", "সব মায়ায় লাগে"],
      ["বাড়তি মিনি কি-চেইন", "২৫ মি.মি., ছয়টার যেকোনোটা"],
      ["ডেলিভারি", "ঢাকার ভেতরে / ঢাকার বাইরে"],
    ],
  },
  specs: {
    kicker: "টেক স্পেক", title: "খুঁটিনাটি।", inBox: "বাক্সে যা আছে",
    startKicker: "শুরু করা", startTitle: "তিনটা ধাপ।", guideBefore: "বাকি সব আছে", guideLink: "ইউজার গাইডে",
    getApp: "Maya অ্যাপ নামান",
    steps: [
      ["প্লাগ লাগান", "যেকোনো ৫V চার্জারে USB-C লাগান। মায়া জেগে উঠে হাই বলবে।"],
      ["পেয়ার করুন", "Maya অ্যাপ ব্লুটুথে ওকে খুঁজে নিরাপদে আপনার Wi-Fi পাঠিয়ে দেয়।"],
      ["নিজের করে নিন", "শহর বেছে নিন, নোটিফিকেশন ঠিক করুন, ব্যস, সে আপনার টেবিলের সঙ্গী।"],
    ],
    rows: [
      ["মস্তিষ্ক", "ESP32-C3, ১৬০ MHz RISC-V, ৪০০ KB SRAM, ৪ MB ফ্ল্যাশ"],
      ["ডিসপ্লে", "১.২৮″ গোল IPS, ২৪০ × ২৪০, ৪০ MHz SPI"],
      ["টাচ", "দুটো ক্যাপাসিটিভ প্যাড"],
      ["ওয়্যারলেস", "২.৪ GHz Wi-Fi আর ব্লুটুথ LE সেটআপ"],
      ["ক্লাউড", "TLS-এ এনক্রিপ্টেড MQTT"],
      ["ইন্টারফেস", "LVGL 8.4, ১১টা স্ক্রিন, 3D ক্যারোসেল মেনু"],
      ["গেম", "৭টা বিল্ট-ইন, হাই স্কোর ডিভাইসেই সেভ থাকে"],
      ["ভাষা", "বাংলা কথোপকথন কার্ড"],
      ["পাওয়ার", "USB-C তে ৫V, সবসময় চালু"],
      ["বডি", "নরম টেক্সচারের 3D প্রিন্টেড PLA, প্লাগ-ইন অ্যাক্সেসরি"],
    ],
    box: ["মায়া, পুরো জোড়া লাগানো", "আপনার পছন্দের অ্যাক্সেসরি", "২৫ মি.মি. মিনি মায়া কি-চেইন", "USB-C কেবল", "কুইক স্টার্ট কার্ড"],
  },
  reserve: {
    title: "আপনার মায়া রিজার্ভ করুন।",
    text: "আজ কোনো টাকা লাগবে না, শুধু লাইনে আপনার জায়গা। প্রথম সিজন তৈরি হলে রিজার্ভের ক্রম অনুযায়ী আমরা ইমেইল করব।",
    count: (n: number) => `${n.toLocaleString("bn-BD")} জন ইতিমধ্যে রিজার্ভ করেছেন।`,
    thanks: "ধন্যবাদ!", thanksText: "আপনি লিস্টে আছেন। মায়া আপনার সাথে দেখা করার জন্য অপেক্ষা করছে।",
    name: "নাম", namePh: "আপনার নাম", email: "ইমেইল", edition: "এডিশন", qty: "সংখ্যা",
    submit: "রিজার্ভ করুন, পরে টাকা দিন", loading: "রিজার্ভ হচ্ছে…", error: "কিছু একটা ভুল হয়েছে।",
    classic: "ক্লাসিক, অ্যাক্সেসরি ছাড়া", surprise: "চমকে দিন",
  },
  footer: { rights: "Xentoryx Labs। বাংলাদেশে ডিজাইন ও প্রিন্ট করা।", guide: "ইউজার গাইড", app: "Maya অ্যাপ" },
  app: {
    kicker: "Maya অ্যাপ · অ্যান্ড্রয়েড",
    title: "Maya অ্যাপ নামিয়ে নিন।",
    text: "অ্যাপটা ব্লুটুথে আপনার মায়ার সাথে জুড়ে যায়, ওকে আপনার Wi-Fi দেয়, আর পাঠায় আবহাওয়া, সময় আর ফোনের নোটিফিকেশন।",
    download: "অ্যান্ড্রয়েডের জন্য ডাউনলোড",
    version: (v: string) => `ভার্সন ${bnDigits(v)} · অ্যান্ড্রয়েড ৭ বা নতুন`,
    requires: "অ্যান্ড্রয়েড ৭ বা নতুন",
    soonTitle: "অ্যাপটা প্রায় তৈরি।",
    soonText: "শেষ ঘষামাজা চলছে। অ্যাপ ছাড়াও মায়া চলে: মুখ, মুড, ঘড়ি, টাইমার আর গেম সব ওর ভেতরেই।",
    soonMail: "বের হলে আমাকে ইমেইল করুন",
    stepsTitle: "যেভাবে ইনস্টল করবেন",
    steps: [
      ["ডাউনলোড", "অ্যান্ড্রয়েড ফোনে ওপরের বোতামে চাপুন। ফাইলের নাম maya.apk।"],
      ["ইনস্টলের অনুমতি", "ফাইলটা খুলুন। অ্যান্ড্রয়েড জিজ্ঞেস করলে এই একটা অ্যাপের জন্য ব্রাউজার থেকে ইনস্টলের অনুমতি দিন।"],
      ["মায়াকে পেয়ার করুন", "অ্যাপ খুলে Pair New Maya চাপুন, তারপর মায়ার স্ক্রিনের QR কোড স্ক্যান করুন।"],
    ],
    note: "অ্যাপটা আমরা নিজেরাই দিই, Google Play-র বাইরে, তাই প্রথমবার অ্যান্ড্রয়েড একটা সতর্কবার্তা দেখায়। এটা স্বাভাবিক। শুধু এই পেজ থেকেই ডাউনলোড করুন।",
    scanTitle: "কম্পিউটারে আছেন?",
    scanText: "ফোনের ক্যামেরা দিয়ে এটা স্ক্যান করুন, পেজটা ফোনে খুলে যাবে।",
    iphone: "আইফোন? আপাতত অ্যাপটা শুধু অ্যান্ড্রয়েডে। অ্যাপ ছাড়াও মায়াকে Wi-Fi দেওয়া যায়: ওর Wi-Fi setup খুললে সে নিজের হটস্পট বানায়। কীভাবে, তা গাইডে আছে।",
    guide: "ইউজার গাইড পড়ুন",
  },
};

const DICTS: Record<Lang, Dict> = { en, bn };

const LangContext = createContext<{ lang: Lang; t: Dict }>({ lang: "en", t: en });

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={{ lang, t: DICTS[lang] }}>{children}</LangContext.Provider>;
}

export function useT() {
  return useContext(LangContext);
}

/** Taka with Bangla digits on the Bangla page. */
export function takaFor(lang: Lang, n: number) {
  return `৳${n.toLocaleString(lang === "bn" ? "bn-BD" : "en-IN")}`;
}

/** Western digits to Bangla digits. */
export function bnDigits(s: string) {
  return s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
}
