// The user guide at /docs and /bn/docs. Facts follow the current firmware (firmware/device/src:
// main.cpp, MayaMenuUI, MayaGamesUI, MayaResetUI) and the quick start card in the box.
// Keep both languages saying the same thing: the card's QR code opens the Bangla page.

import type { Lang } from "./i18n";
import type { Mood } from "./data";

export type Pad = "T1" | "T2";
/** tap: n quick taps ("1", "3–4", "5+"); hold: seconds */
export type Gesture = { pads: Pad[]; kind: "tap" | "hold"; amount: string; face: string; menus: string };

type Section = { id: string; title: string };

export type GuideCopy = {
  meta: { title: string; description: string };
  hero: { kicker: string; title: string; titleScript: string; lede: string; jumpLabel: string; print: string };
  jump: [string, string][];
  toc: Section[];
  start: { steps: [string, string][]; offline: string; appCta: string; appNote: string };
  pads: {
    intro: string; facing: string; t1: string; t2: string; light: string;
    colFace: string; colMenus: string; tap: (n: string) => string; hold: (s: string) => string; both: string;
    gestures: Gesture[]; bootNote: string;
  };
  moods: { intro: string; labels: Record<string, string>; bedtime: string };
  menu: { intro: string; items: { glyph: string; name: string; text: string }[] };
  games: { intro: string; items: { id: string; name: string; text: string; control: string }[] };
  pairing: {
    intro: string; steps: [string, string][]; secure: string;
    noAppTitle: string; noApp: string; ghz: string; backTo: string;
  };
  accessories: { text: string; keychain: string };
  firmware: { intro: string; steps: string[]; erase: string };
  reset: { intro: string; erased: string[]; erasedLabel: string; steps: string[]; after: string };
  care: string[];
  specs: [string, string][];
  help: { items: [string, string][]; stuckTitle: string; stuckText: string; email: string; copy: string; copied: string; back: string };
  onThisPage: string;
};

const en: GuideCopy = {
  meta: {
    title: "Maya user guide",
    description:
      "Set up Maya, learn the touch pads, moods, menu and games, pair her with the app, update firmware and reset her.",
  },
  hero: {
    kicker: "User guide · Firmware v1",
    title: "Getting to know",
    titleScript: "Maya",
    lede: "Everything from the first plug-in to a factory reset. Five minutes to read, and she'll teach you the rest herself.",
    jumpLabel: "Jump to",
    print: "Save as PDF",
  },
  jump: [
    ["pairing", "Pair with the app"],
    ["pads", "Touch pads"],
    ["help", "Something's wrong"],
    ["reset", "Factory reset"],
  ],
  toc: [
    { id: "start", title: "Quick start" },
    { id: "pads", title: "Touch pads" },
    { id: "moods", title: "Moods" },
    { id: "menu", title: "The menu" },
    { id: "games", title: "Games" },
    { id: "pairing", title: "Pairing and Wi-Fi" },
    { id: "accessories", title: "Accessories" },
    { id: "firmware", title: "Firmware updates" },
    { id: "reset", title: "Factory reset" },
    { id: "care", title: "Care and safety" },
    { id: "specs", title: "Specifications" },
    { id: "help", title: "Troubleshooting" },
  ],
  start: {
    steps: [
      ["Plug in", "USB-C into any 5 V / 1 A charger or computer. Maya has no battery, so she stays plugged in."],
      ["Wait for hi", "She waves hello, then her eyes start looking around. Don't touch her for the first 3 seconds."],
      ["Pair in the app", "Open the Maya app, tap Pair a Maya, scan the QR code on her screen and pick your Wi-Fi."],
    ],
    offline:
      "Maya works without Wi-Fi too: her face, moods, clock, timers and games all run on the device. Wi-Fi adds weather, notifications and the exact time.",
    appCta: "Get the Maya app",
    appNote: "Android 7 or newer",
  },
  pads: {
    intro: "Maya has two hidden touch pads, one in each foot. A light touch is enough; you don't need to press.",
    facing: "Facing Maya",
    t1: "T1 · left foot",
    t2: "T2 · right foot",
    light: "Touch, don't press",
    colFace: "On her face",
    colMenus: "In menus and games",
    tap: (n) => (n === "1" ? "tap" : `${n} quick taps`),
    hold: (s) => `hold ${s}`,
    both: "both",
    gestures: [
      { pads: ["T1"], kind: "tap", amount: "1", face: "Pet her. She gets happy.", menus: "Select, jump, flap, fire, drop" },
      { pads: ["T1"], kind: "tap", amount: "3–4", face: "She gets annoyed", menus: "—" },
      { pads: ["T1"], kind: "tap", amount: "5+", face: "She gets angry", menus: "—" },
      { pads: ["T2"], kind: "tap", amount: "1", face: "Open the menu", menus: "Menu: next item. Screens: back to the menu" },
      { pads: ["T1"], kind: "hold", amount: "1 s", face: "—", menus: "Leave the current screen or game" },
      { pads: ["T2"], kind: "hold", amount: "1 s", face: "—", menus: "Leave the games list, back to the menu" },
      { pads: ["T1", "T2"], kind: "hold", amount: "2 s", face: "Go to sleep / wake up", menus: "—" },
      { pads: ["T2"], kind: "hold", amount: "2.5 s", face: "Setup and pairing, from anywhere", menus: "Setup and pairing, from anywhere" },
    ],
    bootNote: "For 3 seconds after she's plugged in, Maya ignores the pads while they calibrate.",
  },
  moods: {
    intro:
      "Her mood drifts through the day and changes with how you treat her. Now and then she shows a little card in Bangla. Tap T1 or T2 to close it.",
    labels: { happy: "Happy", love: "Love", sleepy: "Sleepy", surprised: "Surprised", bored: "Bored", annoyed: "Annoyed", angry: "Angry", dizzy: "Dizzy" },
    bedtime:
      "Bedtime: hold T1 and T2 together for about 2 seconds and she goes to sleep. Poke her while she sleeps and she grumbles, then dozes off again. Hold both pads again to wake her.",
  },
  menu: {
    intro: "Tap T2 on her face to open the carousel. Tap T2 again to turn to the next item and T1 to open it. Inside any screen, T2 takes you back.",
    items: [
      { glyph: "face", name: "Maya face", text: "Back to her eyes." },
      { glyph: "clock", name: "Digital clock", text: "Time and date, synced from the internet." },
      { glyph: "weather", name: "Live weather", text: "Temperature, sky and humidity for your city." },
      { glyph: "notify", name: "Notifications", text: "Your 5 latest alerts from the app." },
      { glyph: "pomodoro", name: "Pomodoro", text: "25 minutes of focus, 5 minutes of break." },
      { glyph: "stopwatch", name: "Timer & lap", text: "Stopwatch with laps. T1 starts and stops." },
      { glyph: "stats", name: "Focus stats", text: "How much you focused today and this week." },
      { glyph: "games", name: "Mini games", text: "The arcade. See Games below." },
      { glyph: "sysinfo", name: "System info", text: "Wi-Fi, memory, uptime and firmware version." },
      { glyph: "claim", name: "Setup / Reset device", text: "Setup until Maya is paired. After that, this slot becomes Reset device." },
    ],
  },
  games: {
    intro:
      "Open Mini games from the menu. T2 picks the next game and T1 starts it. Hold T1 for a second to stop a game, or hold T2 to leave the arcade. High scores stay on Maya, even unplugged.",
    items: [
      { id: "dino", name: "Dino Run", text: "Jump the cacti through day and night.", control: "T1 jump" },
      { id: "flappy", name: "Flappy", text: "Tap to flap through the pipes.", control: "T1 flap" },
      { id: "shooter", name: "Space Shooter", text: "Fire lasers at the alien fleet.", control: "T1 fire" },
      { id: "stack", name: "Tower Stack", text: "Drop blocks with perfect timing.", control: "T1 drop" },
      { id: "pong", name: "Circle Pong", text: "Pong around a round screen.", control: "T1 reverse" },
      { id: "reflex", name: "Reflex", text: "Wait for the flash. Tap. Milliseconds count.", control: "T1 on the flash" },
      { id: "brick", name: "Brick Breaker", text: "Smash every coloured brick.", control: "T1 paddle" },
    ],
  },
  pairing: {
    intro: "Pairing connects Maya to your Wi-Fi and to your account, so the app can send her weather, notifications and messages.",
    steps: [
      ["Install the app", "Get the Maya app for Android from our website. It needs Android 7 or newer."],
      ["Open setup on Maya", "A new Maya opens the setup screen by herself and shows a QR code. Otherwise hold T2 for 2.5 seconds."],
      ["Scan and choose Wi-Fi", "In the app, tap Pair a Maya, scan the code on her screen, then pick your Wi-Fi and enter its password."],
      ["She's yours", "Maya joins your Wi-Fi and your account. Nobody else can pair her until you remove her."],
    ],
    secure: "The app talks to her over Bluetooth, and the link is encrypted.",
    noAppTitle: "No app nearby?",
    noApp:
      "Open Wi-Fi setup on Maya: she makes her own hotspot called MAYA-SETUP and shows its password on her screen. Join it with any phone or laptop and enter your Wi-Fi in the page that opens.",
    ghz: "Maya needs 2.4 GHz Wi-Fi. Networks that are 5 GHz only won't show up.",
    backTo: "Back to setup at any time: hold T2 for 2.5 seconds.",
  },
  accessories: {
    text:
      "Bunny ears, panda ears, crown, sprout, headphones and backpack plug in without glue or tools. Pull the accessory straight up (or off her back, for the backpack) and push the new one in until it sits flat. Every accessory fits every Maya.",
    keychain: "Your box also has a 25 mm mini Maya keychain. It's small, so keep it away from young children.",
  },
  firmware: {
    intro: "Maya doesn't update over the air, so nothing changes without you knowing. When a new version is out, we'll email you a link to our web updater.",
    steps: [
      "Connect Maya to a computer with a USB-C data cable.",
      "Open the updater in Chrome or Edge on a computer, not a phone.",
      "Click Connect & Flash MAYA, pick her port, and wait until it says done. Don't unplug her during the update.",
    ],
    erase: "If the updater asks whether to erase the device, choose No to keep your Wi-Fi, pairing and high scores.",
  },
  reset: {
    intro: "A reset starts Maya over like new. Do it before you give her to someone else.",
    erasedLabel: "What's erased",
    erased: ["Wi-Fi", "Pairing", "Her name", "High scores"],
    steps: [
      "Tap T2 to open the menu and turn to Reset device.",
      "Tap T1 to open it.",
      "Hold T1 for 1.5 seconds until the ring fills. Tap T2 instead to cancel.",
    ],
    after: "After a reset, remove her from your account in the app too.",
  },
  care: [
    "Use a regulated 5 V USB power source only.",
    "Maya's body is PLA plastic. Keep her out of direct sun, hot cars and away from heaters: PLA softens above about 50 °C.",
    "Clean the screen with a dry microfibre cloth and the body with a soft dry brush. No water or solvents.",
    "Keep her dry. She isn't made for bathrooms or outdoors.",
    "Not for children under 3: the accessories and the keychain are small parts.",
  ],
  specs: [
    ["Brain", "ESP32-C3, 160 MHz RISC-V, 400 KB SRAM, 4 MB flash"],
    ["Display", '1.28" round IPS, 240 × 240'],
    ["Touch", "Two capacitive pads, one in each foot"],
    ["Wireless", "2.4 GHz Wi-Fi, Bluetooth LE for setup"],
    ["Interface", "11 screens on a 3D carousel menu"],
    ["Games", "7 built in, high scores saved on Maya"],
    ["Language", "Bangla dialogue cards"],
    ["Power", "5 V over USB-C, always on, no battery"],
    ["Body", "3D-printed PLA, plug-in accessories"],
    ["Size", "103 × 82 × 60 mm, about 74 g"],
  ],
  help: {
    items: [
      ["The screen stays black", "Use a 5 V charger that gives at least 1 A, and try another cable. Some thin cables only charge phones and drop the voltage."],
      ["Touch does nothing right after plugging in", "Maya ignores the pads for the first 3 seconds while they calibrate. Keep your hands off her until she says hi."],
      ["She won't join my Wi-Fi", "Maya works on 2.4 GHz only. If your router mixes 2.4 and 5 GHz under one name, turn on a separate 2.4 GHz network."],
      ["The app says my password is wrong", "Check the password letter by letter, including capitals. If it's right, hold T2 for 2.5 s on Maya, keep the phone close and try again."],
      ["Pairing fails or times out", "Hold T2 for 2.5 s to restart setup, keep the phone close, and try again from the app."],
      ["The app shows her offline", "Open System info on Maya. If Wi-Fi isn't connected, check the router. If it is, unplug Maya for a few seconds and plug her back in."],
      ["Weather or time is wrong", "Both come from the internet. Check System info for the Wi-Fi status, and set your city in the app."],
      ["An accessory is loose", "Push it straight down until it seats. If it still wobbles, write to us and we'll send a new one."],
    ],
    stuckTitle: "Still stuck?",
    stuckText: "Write to us. A real person answers, usually within a day.",
    email: "contact@xentoryx.com",
    copy: "Copy address",
    copied: "Copied",
    back: "Back to Maya",
  },
  onThisPage: "On this page",
};

const bn: GuideCopy = {
  meta: {
    title: "মায়া ইউজার গাইড",
    description: "মায়াকে চালু করা, টাচ প্যাড, মুড, মেনু আর গেম, অ্যাপের সাথে পেয়ার করা, ফার্মওয়্যার আপডেট আর রিসেট।",
  },
  hero: {
    kicker: "ইউজার গাইড · ফার্মওয়্যার v1",
    title: "পরিচয় হোক",
    titleScript: "মায়া",
    lede: "প্রথম প্লাগ লাগানো থেকে ফ্যাক্টরি রিসেট, সব এক জায়গায়। পড়তে পাঁচ মিনিট, বাকিটা মায়া নিজেই শিখিয়ে দেবে।",
    jumpLabel: "সরাসরি যান",
    print: "PDF হিসেবে রাখুন",
  },
  jump: [
    ["pairing", "অ্যাপে পেয়ার করুন"],
    ["pads", "টাচ প্যাড"],
    ["help", "কোনো সমস্যা?"],
    ["reset", "ফ্যাক্টরি রিসেট"],
  ],
  toc: [
    { id: "start", title: "শুরু করুন" },
    { id: "pads", title: "টাচ প্যাড" },
    { id: "moods", title: "মুড" },
    { id: "menu", title: "মেনু" },
    { id: "games", title: "গেম" },
    { id: "pairing", title: "পেয়ারিং আর Wi-Fi" },
    { id: "accessories", title: "অ্যাক্সেসরি" },
    { id: "firmware", title: "ফার্মওয়্যার আপডেট" },
    { id: "reset", title: "ফ্যাক্টরি রিসেট" },
    { id: "care", title: "যত্ন ও সাবধানতা" },
    { id: "specs", title: "স্পেসিফিকেশন" },
    { id: "help", title: "সমস্যা হলে" },
  ],
  start: {
    steps: [
      ["প্লাগ লাগান", "USB-C কেবল দিয়ে যেকোনো ৫V / ১A চার্জার বা কম্পিউটারে লাগান। মায়ার ব্যাটারি নেই, তাই ও সবসময় প্লাগে থাকে।"],
      ["হাই বলার অপেক্ষা", "মায়া হাত নেড়ে হাই বলবে, তারপর চোখ এদিক-ওদিক ঘোরাবে। প্রথম ৩ সেকেন্ড ওকে ছোঁবেন না।"],
      ["অ্যাপে পেয়ার করুন", "Maya অ্যাপ খুলে Pair a Maya চাপুন, মায়ার স্ক্রিনের QR কোড স্ক্যান করুন, তারপর আপনার Wi-Fi বেছে নিন।"],
    ],
    offline: "Wi-Fi ছাড়াও মায়া চলে: মুখ, মুড, ঘড়ি, টাইমার আর গেম সব ওর ভেতরেই। Wi-Fi দিলে আবহাওয়া, নোটিফিকেশন আর ঠিক সময় পাবেন।",
    appCta: "Maya অ্যাপ নামান",
    appNote: "অ্যান্ড্রয়েড ৭ বা নতুন",
  },
  pads: {
    intro: "মায়ার দুই পায়ে দুটো লুকানো টাচ প্যাড আছে। আলতো ছোঁয়াই যথেষ্ট, চাপ দিতে হবে না।",
    facing: "মায়ার দিকে মুখ করে",
    t1: "T1 · বাঁ পা",
    t2: "T2 · ডান পা",
    light: "ছোঁবেন, চাপবেন না",
    colFace: "মুখের স্ক্রিনে",
    colMenus: "মেনু আর গেমে",
    tap: (n) => (n === "1" ? "একবার ছোঁয়া" : `${n} বার দ্রুত ছোঁয়া`),
    hold: (s) => `${s} ধরে রাখা`,
    both: "দুটোই",
    gestures: [
      { pads: ["T1"], kind: "tap", amount: "1", face: "আদর করুন, মায়া খুশি হবে।", menus: "বেছে নেওয়া, লাফ, ডানা ঝাপটানো, গুলি, ব্লক ফেলা" },
      { pads: ["T1"], kind: "tap", amount: "৩–৪", face: "মায়া বিরক্ত হবে", menus: "—" },
      { pads: ["T1"], kind: "tap", amount: "৫+", face: "মায়া রেগে যাবে", menus: "—" },
      { pads: ["T2"], kind: "tap", amount: "1", face: "মেনু খোলে", menus: "মেনুতে: পরের আইটেম। স্ক্রিনে: মেনুতে ফেরা" },
      { pads: ["T1"], kind: "hold", amount: "১ সেকেন্ড", face: "—", menus: "চলতি স্ক্রিন বা গেম থেকে বের হওয়া" },
      { pads: ["T2"], kind: "hold", amount: "১ সেকেন্ড", face: "—", menus: "গেমের তালিকা ছেড়ে মেনুতে ফেরা" },
      { pads: ["T1", "T2"], kind: "hold", amount: "২ সেকেন্ড", face: "ঘুম পাড়ানো / জাগানো", menus: "—" },
      { pads: ["T2"], kind: "hold", amount: "২.৫ সেকেন্ড", face: "যেকোনো জায়গা থেকে সেটআপ আর পেয়ারিং", menus: "যেকোনো জায়গা থেকে সেটআপ আর পেয়ারিং" },
    ],
    bootNote: "প্লাগ লাগানোর পর প্রথম ৩ সেকেন্ড প্যাডগুলো নিজেদের ঠিক করে নেয়, তখন ছোঁয়া কাজ করে না।",
  },
  moods: {
    intro: "দিনের সাথে সাথে মায়ার মুড বদলায়, আর আপনি ওর সাথে কেমন আচরণ করছেন তার উপরও। মাঝে মাঝে ও বাংলায় একটা ছোট্ট কার্ড দেখায়। বন্ধ করতে T1 বা T2 ছুঁয়ে দিন।",
    labels: { happy: "খুশি", love: "ভালোবাসা", sleepy: "ঘুম ঘুম", surprised: "অবাক", bored: "একঘেয়ে", annoyed: "বিরক্ত", angry: "রাগী", dizzy: "মাথা ঘোরা" },
    bedtime:
      "ঘুমের সময়: T1 আর T2 একসাথে প্রায় ২ সেকেন্ড ধরে রাখুন, মায়া ঘুমিয়ে পড়বে। ঘুমের মধ্যে খোঁচালে একটু গজগজ করে আবার ঘুমিয়ে যাবে। জাগাতে আবার দুটো প্যাড ধরে রাখুন।",
  },
  menu: {
    intro: "মুখের স্ক্রিনে T2 ছুঁলে ক্যারোসেল মেনু খোলে। আবার T2 ছুঁলে পরের আইটেম, T1 ছুঁলে সেটা খোলে। যেকোনো স্ক্রিন থেকে T2 ছুঁলে মেনুতে ফিরে আসবেন।",
    items: [
      { glyph: "face", name: "মায়ার মুখ", text: "আবার ওর চোখে ফেরা।" },
      { glyph: "clock", name: "ডিজিটাল ঘড়ি", text: "ইন্টারনেট থেকে মেলানো সময় আর তারিখ।" },
      { glyph: "weather", name: "লাইভ আবহাওয়া", text: "আপনার শহরের তাপমাত্রা, আকাশ আর আর্দ্রতা।" },
      { glyph: "notify", name: "নোটিফিকেশন", text: "অ্যাপ থেকে আসা সর্বশেষ ৫টা অ্যালার্ট।" },
      { glyph: "pomodoro", name: "পোমোডোরো", text: "২৫ মিনিট মনোযোগ, ৫ মিনিট বিরতি।" },
      { glyph: "stopwatch", name: "টাইমার ও ল্যাপ", text: "ল্যাপসহ স্টপওয়াচ। T1 চালু আর বন্ধ করে।" },
      { glyph: "stats", name: "ফোকাস হিসাব", text: "আজ আর এই সপ্তাহে কতটা মনোযোগ দিলেন।" },
      { glyph: "games", name: "মিনি গেম", text: "আর্কেড। নিচে গেম অংশ দেখুন।" },
      { glyph: "sysinfo", name: "সিস্টেম তথ্য", text: "Wi-Fi, মেমরি, কতক্ষণ চালু আর ফার্মওয়্যার ভার্সন।" },
      { glyph: "claim", name: "সেটআপ / রিসেট", text: "পেয়ার হওয়ার আগে এখানে সেটআপ থাকে, তারপর এটা হয়ে যায় Reset device।" },
    ],
  },
  games: {
    intro:
      "মেনু থেকে মিনি গেম খুলুন। T2 পরের গেম বাছে, T1 শুরু করে। গেম থামাতে T1 এক সেকেন্ড ধরে রাখুন, আর্কেড ছাড়তে T2 ধরে রাখুন। হাই স্কোর মায়ার ভেতরেই থাকে, প্লাগ খুললেও মোছে না।",
    items: [
      { id: "dino", name: "ডাইনো রান", text: "দিনে-রাতে ক্যাকটাস টপকে দৌড়।", control: "T1 লাফ" },
      { id: "flappy", name: "ফ্ল্যাপি", text: "ছুঁয়ে ছুঁয়ে পাইপের ফাঁক দিয়ে ওড়া।", control: "T1 ডানা" },
      { id: "shooter", name: "স্পেস শুটার", text: "এলিয়েন বাহিনীর দিকে লেজার ছুড়ুন।", control: "T1 গুলি" },
      { id: "stack", name: "টাওয়ার স্ট্যাক", text: "ঠিক সময়ে ব্লক ফেলে উঁচু টাওয়ার।", control: "T1 ফেলা" },
      { id: "pong", name: "সার্কেল পং", text: "গোল স্ক্রিনের চারপাশে পং।", control: "T1 দিক বদল" },
      { id: "reflex", name: "রিফ্লেক্স", text: "আলো জ্বলার অপেক্ষা, তারপর ছোঁয়া। মিলিসেকেন্ডের খেলা।", control: "আলো জ্বললে T1" },
      { id: "brick", name: "ব্রিক ব্রেকার", text: "রঙিন সব ইট ভেঙে ফেলুন।", control: "T1 প্যাডেল" },
    ],
  },
  pairing: {
    intro: "পেয়ার করলে মায়া আপনার Wi-Fi আর আপনার অ্যাকাউন্টে যুক্ত হয়, তখন অ্যাপ ওকে আবহাওয়া, নোটিফিকেশন আর মেসেজ পাঠাতে পারে।",
    steps: [
      ["অ্যাপ ইনস্টল করুন", "আমাদের ওয়েবসাইট থেকে অ্যান্ড্রয়েডের Maya অ্যাপ নামান। অ্যান্ড্রয়েড ৭ বা নতুন লাগবে।"],
      ["মায়ায় সেটআপ খুলুন", "নতুন মায়া নিজেই সেটআপ স্ক্রিন খোলে আর একটা QR কোড দেখায়। না দেখালে T2 আড়াই সেকেন্ড ধরে রাখুন।"],
      ["স্ক্যান করে Wi-Fi দিন", "অ্যাপে Pair a Maya চাপুন, মায়ার স্ক্রিনের কোড স্ক্যান করুন, তারপর আপনার Wi-Fi বেছে পাসওয়ার্ড দিন।"],
      ["মায়া এখন আপনার", "মায়া আপনার Wi-Fi আর অ্যাকাউন্টে যুক্ত হয়ে যায়। আপনি সরিয়ে না দেওয়া পর্যন্ত আর কেউ ওকে পেয়ার করতে পারবে না।"],
    ],
    secure: "অ্যাপ ব্লুটুথে মায়ার সাথে কথা বলে, আর সংযোগটা এনক্রিপ্টেড।",
    noAppTitle: "অ্যাপ হাতের কাছে নেই?",
    noApp:
      "মায়ায় Wi-Fi setup খুলুন: ও MAYA-SETUP নামে নিজের হটস্পট বানাবে আর স্ক্রিনে তার পাসওয়ার্ড দেখাবে। যেকোনো ফোন বা ল্যাপটপ দিয়ে সেটায় যুক্ত হয়ে যে পেজ খুলবে সেখানে আপনার Wi-Fi দিন।",
    ghz: "মায়া শুধু ২.৪ GHz Wi-Fi চেনে। শুধু ৫ GHz নেটওয়ার্ক তালিকায় আসবে না।",
    backTo: "যেকোনো সময় সেটআপে ফিরতে T2 আড়াই সেকেন্ড ধরে রাখুন।",
  },
  accessories: {
    text:
      "খরগোশের কান, পান্ডার কান, মুকুট, চারা, হেডফোন আর ব্যাকপ্যাক আঠা বা যন্ত্র ছাড়াই লাগে। অ্যাক্সেসরি সোজা উপরে টেনে খুলুন (ব্যাকপ্যাক পিঠ থেকে টেনে), নতুনটা চেপে বসান যতক্ষণ না সমান হয়। সব অ্যাক্সেসরি সব মায়ায় লাগে।",
    keychain: "বাক্সে একটা ২৫ মি.মি. মিনি মায়া কি-চেইনও আছে। এটা ছোট, তাই ছোট বাচ্চাদের থেকে দূরে রাখুন।",
  },
  firmware: {
    intro: "মায়া নিজে থেকে ইন্টারনেটে আপডেট হয় না, তাই আপনার অজান্তে কিছু বদলায় না। নতুন ভার্সন এলে আমরা ওয়েব আপডেটারের লিংক ইমেইল করব।",
    steps: [
      "USB-C ডেটা কেবল দিয়ে মায়াকে কম্পিউটারে লাগান।",
      "কম্পিউটারের Chrome বা Edge-এ আপডেটার খুলুন, ফোনে নয়।",
      "Connect & Flash MAYA চাপুন, মায়ার পোর্ট বেছে নিন, আর done লেখা পর্যন্ত অপেক্ষা করুন। আপডেটের মাঝে প্লাগ খুলবেন না।",
    ],
    erase: "আপডেটার ডিভাইস মুছবে কিনা জিজ্ঞেস করলে No বাছুন, তাহলে Wi-Fi, পেয়ারিং আর হাই স্কোর থেকে যাবে।",
  },
  reset: {
    intro: "রিসেট করলে মায়া একদম নতুনের মতো শুরু হয়। অন্য কাউকে দেওয়ার আগে রিসেট করে নিন।",
    erasedLabel: "যা মুছে যাবে",
    erased: ["Wi-Fi", "পেয়ারিং", "ওর নাম", "হাই স্কোর"],
    steps: [
      "T2 ছুঁয়ে মেনু খুলুন, Reset device-এ যান।",
      "T1 ছুঁয়ে সেটা খুলুন।",
      "রিংটা ভরা পর্যন্ত T1 দেড় সেকেন্ড ধরে রাখুন। বাতিল করতে বরং T2 ছুঁয়ে দিন।",
    ],
    after: "রিসেটের পর অ্যাপ থেকেও আপনার অ্যাকাউন্ট থেকে মায়াকে সরিয়ে দিন।",
  },
  care: [
    "শুধু ৫V USB পাওয়ার ব্যবহার করুন।",
    "মায়ার শরীর PLA প্লাস্টিকের। রোদ, গরম গাড়ি আর হিটার থেকে দূরে রাখুন: প্রায় ৫০°C-এর বেশি গরমে PLA নরম হয়ে যায়।",
    "স্ক্রিন শুকনো মাইক্রোফাইবার কাপড়ে, শরীর নরম শুকনো ব্রাশে মুছুন। পানি বা কোনো কেমিক্যাল নয়।",
    "শুকনো জায়গায় রাখুন। বাথরুম বা বাইরের জন্য মায়া বানানো হয়নি।",
    "৩ বছরের কম বয়সী শিশুর জন্য নয়: অ্যাক্সেসরি আর কি-চেইন ছোট জিনিস।",
  ],
  specs: [
    ["মস্তিষ্ক", "ESP32-C3, ১৬০ MHz RISC-V, ৪০০ KB SRAM, ৪ MB ফ্ল্যাশ"],
    ["ডিসপ্লে", "১.২৮″ গোল IPS, ২৪০ × ২৪০"],
    ["টাচ", "দুটো ক্যাপাসিটিভ প্যাড, দুই পায়ে"],
    ["ওয়্যারলেস", "২.৪ GHz Wi-Fi, সেটআপের জন্য ব্লুটুথ LE"],
    ["ইন্টারফেস", "3D ক্যারোসেল মেনুতে ১১টা স্ক্রিন"],
    ["গেম", "৭টা বিল্ট-ইন, হাই স্কোর মায়াতেই থাকে"],
    ["ভাষা", "বাংলা কথোপকথন কার্ড"],
    ["পাওয়ার", "USB-C-তে ৫V, সবসময় চালু, ব্যাটারি নেই"],
    ["শরীর", "3D প্রিন্টেড PLA, প্লাগ-ইন অ্যাক্সেসরি"],
    ["মাপ", "১০৩ × ৮২ × ৬০ মি.মি., প্রায় ৭৪ গ্রাম"],
  ],
  help: {
    items: [
      ["স্ক্রিন কালো হয়ে আছে", "অন্তত ১A দেয় এমন ৫V চার্জার আর অন্য একটা কেবল দিয়ে দেখুন। কিছু পাতলা কেবল শুধু ফোন চার্জ করে, ভোল্টেজ কমে যায়।"],
      ["প্লাগ লাগানোর পরপরই ছোঁয়া কাজ করছে না", "প্রথম ৩ সেকেন্ড প্যাডগুলো নিজেদের ঠিক করে নেয়। মায়া হাই না বলা পর্যন্ত ওকে ছোঁবেন না।"],
      ["Wi-Fi-তে যুক্ত হচ্ছে না", "মায়া শুধু ২.৪ GHz চেনে। রাউটারে ২.৪ আর ৫ GHz এক নামে থাকলে আলাদা ২.৪ GHz নেটওয়ার্ক চালু করুন।"],
      ["অ্যাপ বলছে পাসওয়ার্ড ভুল", "বড়-ছোট হাতের অক্ষরসহ পাসওয়ার্ড মিলিয়ে দেখুন। ঠিক থাকলে মায়ায় T2 আড়াই সেকেন্ড ধরে রাখুন, ফোন কাছে রেখে আবার চেষ্টা করুন।"],
      ["পেয়ারিং হচ্ছে না বা সময় শেষ হয়ে যাচ্ছে", "T2 আড়াই সেকেন্ড ধরে আবার সেটআপ শুরু করুন, ফোন কাছে রাখুন, তারপর অ্যাপ থেকে আবার চেষ্টা করুন।"],
      ["অ্যাপে মায়া অফলাইন দেখাচ্ছে", "মায়ায় সিস্টেম তথ্য খুলুন। Wi-Fi যুক্ত না থাকলে রাউটার দেখুন। যুক্ত থাকলে কয়েক সেকেন্ডের জন্য প্লাগ খুলে আবার লাগান।"],
      ["আবহাওয়া বা সময় ভুল", "দুটোই ইন্টারনেট থেকে আসে। সিস্টেম তথ্যে Wi-Fi দেখুন, আর অ্যাপে আপনার শহর ঠিক করুন।"],
      ["অ্যাক্সেসরি ঢিলা", "সোজা নিচে চেপে বসান। তারপরও নড়লে আমাদের লিখুন, নতুন একটা পাঠিয়ে দেব।"],
    ],
    stuckTitle: "এখনও সমাধান হয়নি?",
    stuckText: "আমাদের লিখুন। একজন মানুষই উত্তর দেবেন, সাধারণত এক দিনের মধ্যে।",
    email: "contact@xentoryx.com",
    copy: "ঠিকানা কপি করুন",
    copied: "কপি হয়েছে",
    back: "মায়ার পেজে ফিরুন",
  },
  onThisPage: "এই পেজে",
};

export const GUIDE: Record<Lang, GuideCopy> = { en, bn };
export type { Mood };
