// Content for the /showcase page. Facts come from the repo README and firmware.

export type Mood =
  | "idle"
  | "happy"
  | "love"
  | "sleepy"
  | "angry"
  | "annoyed"
  | "bored"
  | "dizzy"
  | "surprised";

export const MOODS: { id: Mood; label: string; bn: string; line: string }[] = [
  { id: "happy", label: "Happy", bn: "খুশি মায়া", line: "আজ আমার মনটা\nঅনেক ভালো!" },
  { id: "love", label: "Love", bn: "আপন মানুষ", line: "তুমি আমার\nসবচেয়ে কাছের বন্ধু!" },
  { id: "sleepy", label: "Sleepy", bn: "ঘুম পাচ্ছে", line: "উফফ...\nখুব ঘুম পাচ্ছে!" },
  { id: "surprised", label: "Surprised", bn: "ওমা!", line: "ওমা!\nএটা কী হলো?" },
  { id: "bored", label: "Bored", bn: "অলস সময়", line: "কী ভাবছ\nএতক্ষণ ধরে?" },
  { id: "annoyed", label: "Annoyed", bn: "বিরক্ত মায়া", line: "এই ফাজিল!\nবারবার গুঁতো দিচ্ছ কেন?" },
  { id: "angry", label: "Angry", bn: "রেগে আছি", line: "আর গুঁতো দিলে\nথাপ্পড় খাবা!" },
  { id: "dizzy", label: "Dizzy", bn: "মাথা ঘুরছে", line: "এই!\nআমাকে সোজা করো!" },
];

export type Look = {
  id: string;
  name: string;
  tagline: string;
  product: string;
  accessory?: string;
  swatch: string;
};

export const LOOKS: Look[] = [
  {
    id: "plain",
    name: "Classic",
    tagline: "Just Maya. Soft white, blush belly, nothing to hide.",
    product: "/showcase/art/maya-plain.svg",
    swatch: "#f8f8f6",
  },
  {
    id: "bunny",
    name: "Bunny",
    tagline: "Tall ears with a pink inside. Maya at her most curious.",
    product: "/showcase/art/maya-bunny.svg",
    accessory: "/showcase/art/acc-bunny.svg",
    swatch: "#f6c1cc",
  },
  {
    id: "panda",
    name: "Panda",
    tagline: "Two round black ears. Sleepy, chubby, very huggable.",
    product: "/showcase/art/maya-panda.svg",
    accessory: "/showcase/art/acc-panda.svg",
    swatch: "#1b1718",
  },
  {
    id: "crown",
    name: "Crown",
    tagline: "A gold crown with pink gems, for the boss of your desk.",
    product: "/showcase/art/maya-crown.svg",
    accessory: "/showcase/art/acc-crown.svg",
    swatch: "#e8b42c",
  },
  {
    id: "sprout",
    name: "Sprout",
    tagline: "A little green leaf on top. Growing with you, one day at a time.",
    product: "/showcase/art/maya-sprout.svg",
    accessory: "/showcase/art/acc-sprout.svg",
    swatch: "#6baf5b",
  },
  {
    id: "headphones",
    name: "Headphones",
    tagline: "Pink cans on, focus mode on. Pomodoro's best friend.",
    product: "/showcase/art/maya-headphones.svg",
    accessory: "/showcase/art/acc-headphones.svg",
    swatch: "#d65680",
  },
  {
    id: "backpack",
    name: "Backpack",
    tagline: "A tiny pink bag with a flap and pocket. Ready for adventure.",
    product: "/showcase/art/maya-backpack.svg",
    accessory: "/showcase/art/acc-backpack.svg",
    swatch: "#f6c1cc",
  },
];

export const SCREENS = [
  { id: "clock", name: "Clock", text: "Neon analog clock with a smooth second hand, plus date." },
  { id: "weather", name: "Weather", text: "Temperature, sky, humidity and your city, live." },
  { id: "pomodoro", name: "Pomodoro", text: "25 minutes focus, 5 minutes break, on a glowing arc." },
  { id: "stopwatch", name: "Stopwatch", text: "Millisecond timing with laps, pause and reset." },
  { id: "stats", name: "Stats", text: "Uptime, CPU load and memory at a glance." },
  { id: "sysinfo", name: "System info", text: "Flash, free RAM, MAC and firmware version." },
  { id: "claim", name: "Pair", text: "A QR code that pairs Maya with your phone in seconds." },
  { id: "wifi", name: "Wi-Fi setup", text: "Join Wi-Fi from any browser. No app needed." },
  { id: "notify", name: "Notifications", text: "Calls, messages and alerts on floating glass cards." },
  { id: "games", name: "Arcade", text: "A carousel of seven games, one tap to play." },
  { id: "dialogue", name: "Bangla cards", text: "Maya talks to you in Bangla, with her own moods." },
] as const;

export const GAMES = [
  { id: "dino", name: "Dino Run", text: "Jump the cacti through day and night." },
  { id: "flappy", name: "Flappy", text: "Tap to flap through the pipes." },
  { id: "shooter", name: "Space Shooter", text: "Fire lasers at the alien fleet." },
  { id: "stack", name: "Tower Stack", text: "Drop blocks with perfect timing." },
  { id: "pong", name: "Circle Pong", text: "Pong around a round screen." },
  { id: "reflex", name: "Reflex", text: "Wait for the flash. Tap. Milliseconds count." },
  { id: "brick", name: "Brick Breaker", text: "Smash every coloured brick." },
] as const;

export const SPECS: [string, string][] = [
  ["Brain", "ESP32-C3, 160 MHz RISC-V, 400 KB SRAM, 4 MB flash"],
  ["Display", '1.28" round IPS, 240 × 240, 40 MHz SPI'],
  ["Touch", "Two capacitive pads: left leg for tap, right leg for menu"],
  ["Wireless", "2.4 GHz Wi-Fi and Bluetooth LE setup"],
  ["Cloud", "Encrypted MQTT over TLS"],
  ["Interface", "LVGL 8.4, 11 screens, 3D carousel menu"],
  ["Games", "7 built-in, high scores saved on device"],
  ["Language", "Bangla dialogue cards"],
  ["Power", "5 V over USB-C, always on"],
  ["Body", "3D-printed PLA with a soft textured finish, plug-in accessories"],
];

export const IN_THE_BOX = [
  "Maya, fully assembled",
  "Your chosen accessory",
  "A 25 mm mini Maya keychain",
  "USB-C cable",
  "Quick start card",
];

// Prices in BDT. Suggested launch prices, based on a build cost of about
// ৳2,000–2,700 per Maya (print, electronics, box, keychain). Change them here.
export const PRICING = {
  maya: 3490,
  collector: 4490,
  accessory: 249,
  mini: 79,
  delivery: { dhaka: 70, outside: 130 },
};

export const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

// The six boxed editions plus the combo, same names and eyes as the retail boxes.
// `look` matches the 3D model accessories and the SVG art in /public/showcase/art.
export const EDITIONS = [
  { look: "bunny", name: "Bunny Edition", variant: "Bunny", accessory: "Bunny ears", eyes: "Curious eyes", tint: "#fbe7ef" },
  { look: "panda", name: "Panda Edition", variant: "Panda", accessory: "Panda ears", eyes: "Big round eyes", tint: "#f1eee8" },
  { look: "crown", name: "Royal Edition", variant: "Crown", accessory: "Gold crown with gems", eyes: "Wink", tint: "#fbeedb" },
  { look: "sprout", name: "Sprout Edition", variant: "Sprout", accessory: "Little green sprout", eyes: "Sleepy eyes", tint: "#ebf4e7" },
  { look: "headphones", name: "Beats Edition", variant: "Headphones", accessory: "Dark pink headphones", eyes: "Happy eyes", tint: "#fff2c9" },
  { look: "backpack", name: "Explorer Edition", variant: "Backpack", accessory: "Backpack with pocket", eyes: "Heart eyes", tint: "#e4ecf6" },
] as const;

export const COMBO = { name: "Complete Collection", variant: "Collector's Set" } as const;

// accessories beyond the one included in a single edition
export const SEPARATELY = PRICING.maya + (EDITIONS.length - 1) * (PRICING.accessory + PRICING.mini);
