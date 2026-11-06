import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, hasDatabase } from "./index";
import { editions, settings, type Pricing } from "./schema";
import { EDITIONS as FALLBACK_EDITIONS, PRICING as FALLBACK_PRICING } from "@/components/site/data";
import type { SiteContent, SiteEdition, SiteCopy } from "@/components/site/content";

const BN_FALLBACK: Record<string, [string, string, string]> = {
  bunny: ["বানি এডিশন", "খরগোশের কান", "কৌতূহলী চোখ"],
  panda: ["পান্ডা এডিশন", "পান্ডার কান", "বড় গোল চোখ"],
  crown: ["রয়্যাল এডিশন", "রত্নখচিত সোনালি মুকুট", "চোখ টিপ"],
  sprout: ["চারা এডিশন", "ছোট্ট সবুজ চারা", "ঘুম ঘুম চোখ"],
  headphones: ["বিটস এডিশন", "গাঢ় গোলাপি হেডফোন", "খুশি চোখ"],
  backpack: ["এক্সপ্লোরার এডিশন", "পকেটওয়ালা ব্যাকপ্যাক", "হার্ট চোখ"],
};

export const DEFAULT_COPY: SiteCopy = {
  hero: {
    badgeEn: "Maya · Desk Companion",
    badgeBn: "মায়া · ডেস্ক রোবট",
    batchEn: "REV. 1.0 / BATCH 01",
    bullets: [
      '1.28" ROUND IPS DISPLAY (240×240)',
      "160 MHZ RISC-V 32-BIT ESP32-C3",
      "4 MB FLASH + 400 KB HIGH SPEED SRAM",
      "TWO CAPACITIVE TOUCH PADS (LEFT & RIGHT LEGS)",
      "8 LIVING MOOD EXPRESSIONS",
      "7 BUILT-IN ARCADE GAMES",
      "FLOATING BANGLA DIALOGUE CARDS",
      "USB-C CONTINUOUS 5V POWER",
    ],
  },
  manifesto: {
    kickerEn: "// 02 LIVING OBJECT ARCHITECTURE",
    kickerBn: "// ০২ লিভিং অবজেক্ট আর্কিটেকচার",
    titleEn: "DESK COMPANIONS SHOULD BE",
    titleBn: "ডেস্ক রোবট হওয়া উচিত",
    titleSoftEn: "TACTILE, EXPRESSIVE & ALIVE.",
    titleSoftBn: "স্পর্শগ্রাহ্য, আবেগপূর্ণ ও জীবন্ত।",
    textEn: "NOT ANOTHER GLOWING BLACK GLASS RECTANGLE. MAYA IS BUILT WITH INTENTIONAL TACTILITY — HIGH SPEED HARDWARE GRAPHICS, LIVING PIXEL EYES, AND DUAL CAPACITIVE FOOT SENSORS.",
    textBn: "কালো কাচের ফ্ল্যাট স্ক্রিন নয়। মায়াকে তৈরি করা হয়েছে নিপুণ স্পর্শগ্রাহ্যতায় — হাই-স্পিড হার্ডওয়্যার গ্রাফিক্স, জীবন্ত চোখের পলক এবং দুই পায়ে ক্যাপাসিটিভ টাচ প্যাড।",
  },
  features: {
    kickerEn: "// 04 HARDWARE CAPABILITIES",
    kickerBn: "// ০৪ হার্ডওয়্যার ক্ষমতা",
    titleEn: "SMALL ON YOUR DESK.",
    titleBn: "টেবিলে ছোট্ট এক সঙ্গী।",
    titleSoftEn: "BIG ON THE INSIDE.",
    titleSoftBn: "ভেতরে অসীম সম্ভাবনা।",
    items: [
      {
        fig: "FIG 01",
        badge: "240×240 IPS / 40MHZ",
        titleEn: "A perfectly round face.",
        titleBn: "একদম গোল একটা মুখ।",
        descEn: '1.28" round IPS display with 240×240 pixels on a 40 MHz high-speed bus. Zero flicker, fluid blinks.',
        descBn: "১.২৮″ গোল IPS ডিসপ্লে, ২৪০ × ২৪০ পিক্সেল, ৪০ MHz বাসে চলে, তাই প্রতিটা পলক মসৃণ।",
      },
      {
        fig: "FIG 02",
        badge: "BANGLA & ENGLISH",
        titleEn: "Speaks your native tongue.",
        titleBn: "ছোট্ট চিরকুট, আপনার ভাষায়।",
        descEn: "Shows floating cards in Bangla: greetings, reminders to drink water, or a playful grumble when poked.",
        descBn: "মাঝে মাঝে সে বাংলায় একটা কার্ড দেখায়: শুভ সকাল, পানি খাওয়ার তাগাদা, কিংবা দুষ্টুমি ভরা কথা।",
      },
      {
        fig: "FIG 03",
        badge: "2× CAPACITIVE TOUCH",
        titleEn: "Touch her feet. She notices.",
        titleBn: "পায়ে ছুঁলেই সে টের পায়।",
        descEn: "Dual capacitive sensors in her feet. Tap left foot to interact, tap right foot to enter the 3D menu.",
        descBn: "দুটো ক্যাপাসিটিভ টাচ প্যাড—বাঁ পা আর ডান পায়ে। বাঁ পায়ে স্পর্শ করলে খুশি হয়, ডান পায়ে ৩ডি মেনু খোলে।",
      },
      {
        fig: "FIG 04",
        badge: "25/5 MIN CYCLE",
        titleEn: "A dedicated focus buddy.",
        titleBn: "কাজের মনোযোগী সঙ্গী।",
        descEn: "Pomodoro timer on a neon arc: 25 minutes of deep focus, 5 minutes of rest, keeping you productive.",
        descBn: "উজ্জ্বল বৃত্তে পোমোডোরো: ২৫ মিনিট কাজ, ৫ মিনিট বিরতি, আর মনোযোগ ধরে রাখার চমৎকার সঙ্গী।",
      },
      {
        fig: "FIG 05",
        badge: "BLE + 2.4GHZ WI-FI",
        titleEn: "One-minute instant pairing.",
        titleBn: "এক মিনিটেই সেটআপ।",
        descEn: "Maya companion app detects her over Bluetooth LE and securely provisions Wi-Fi credentials in seconds.",
        descBn: "Maya অ্যাপ ব্লুটুথে ওকে খুঁজে নিয়ে আপনার Wi-Fi দিয়ে দেয়। তারপর আবহাওয়া, সময় আর নোটিফিকেশন।",
      },
      {
        fig: "FIG 06",
        badge: "END-TO-END TLS",
        titleEn: "Private & encrypted MQTT.",
        titleBn: "সম্পূর্ণ নিরাপদ ও আপনার।",
        descEn: "Each Maya holds unique device credentials. Direct TLS-encrypted MQTT broker telemetry only to your phone.",
        descBn: "প্রতিটা মায়ার নিজস্ব সিকিউর চাবি আছে। যোগাযোগ সম্পূর্ণ এনক্রিপ্টেড, শুধু মালিকই তাকে নিয়ন্ত্রণ করতে পারে।",
      },
    ],
  },
  specs: {
    kickerEn: "// 06 HARDWARE SPECIFICATIONS",
    kickerBn: "// ০৬ হার্ডওয়্যার স্পেসিফিকেশন",
    titleEn: "TECHNICAL SPECIFICATIONS",
    titleBn: "প্রযুক্তিগত খুঁটিনাটি",
    inBoxEn: "WHAT'S IN THE BOX",
    inBoxBn: "বাক্সে যা পাবেন",
    rows: [
      { labelEn: "Microcontroller", labelBn: "মস্তিষ্ক", valEn: "ESP32-C3, 160 MHz 32-bit RISC-V, 400 KB SRAM, 4 MB Flash", valBn: "ESP32-C3, ১৬০ MHz RISC-V, ৪০০ KB SRAM, ৪ MB ফ্ল্যাশ" },
      { labelEn: "Display", labelBn: "ডিসপ্লে", valEn: '1.28" Round IPS Retina Display, 240×240 Pixels, 40 MHz SPI', valBn: '১.২৮″ গোল IPS, ২৪০ × ২৪০, ৪০ MHz SPI' },
      { labelEn: "Touch Interface", labelBn: "টাচ কন্ট্রোল", valEn: "Dual Capacitive Touch Pads (Left Leg: Tap, Right Leg: Menu)", valBn: "দুটো ক্যাপাসিটিভ প্যাড: বাঁ পায়ে ট্যাপ, ডান পায়ে মেনু" },
      { labelEn: "Wireless", labelBn: "ওয়্যারলেস", valEn: "2.4 GHz Wi-Fi (802.11 b/g/n) & Bluetooth 5 (LE)", valBn: "২.৪ GHz Wi-Fi আর ব্লুটুথ LE সেটআপ" },
      { labelEn: "Cloud & IoT", labelBn: "ক্লাউড ও আইওটি", valEn: "Encrypted MQTT over TLS, Real-Time Mobile Sync", valBn: "TLS-এ এনক্রিপ্টেড MQTT, লাইভ অ্যাপ সিঙ্ক" },
      { labelEn: "UI System", labelBn: "ইন্টারফেস", valEn: "Custom LVGL 8.4 Engine, 11 Modular Screen Apps, 3D Carousel", valBn: "LVGL 8.4, ১১টা স্ক্রিন, 3D ক্যারোসেল মেনু" },
      { labelEn: "Retro Arcade", labelBn: "গেমস", valEn: "7 Embedded Retro Games with Flash Non-Volatile High Scores", valBn: "৭টা বিল্ট-ইন গেম, হাই স্কোর ডিভাইসেই সেভ থাকে" },
      { labelEn: "Power", labelBn: "পাওয়ার", valEn: "Continuous 5V DC via USB-C (Low-Power Desktop Standby)", valBn: "USB-C তে ৫V, সবসময় চালু লো-পাওয়ার ডেস্কটপ মোড" },
      { labelEn: "Materials & Craft", labelBn: "বডি ও ম্যাটেরিয়াল", valEn: "Precision 3D Printed Matte PLA Shell, Magnetic Modular Accessories", valBn: "ম্যাট ফিনিশ 3D প্রিন্টেড PLA, ম্যাগনেটিক মডুলার এক্সেসরিজ" },
    ],
    box: [
      { en: "Maya Robot Companion Unit", bn: "মায়া রোবট কমপ্যানিয়ন ইউনিট" },
      { en: "Modular Snap-On Edition Accessory", bn: "মডুলার স্ন্যাপ-অন এডিশন এক্সেসরি" },
      { en: "Matching Miniature Pocket Keychain", bn: "ম্যাচিং মিনি পকেট কি-চেইন" },
      { en: "High-Grade Braided USB-C Power Cable", bn: "হাই-গ্রেড ব্রেইডেড USB-C ক্যাবল" },
    ],
  },
  company: {
    brandName: "Xentoryx Labs",
    taglineEn: "Designed and engineered with passion in Bangladesh.",
    taglineBn: "বাংলাদেশে ভালোবাসায় ডিজাইন ও তৈরি।",
    email: "contact@xentoryxlabs.site",
    phone: "", // set in the web admin; hidden until then
    address: "Dhaka, Bangladesh",
    copyright: "© 2026 Xentoryx Labs. All rights reserved.",
  },
};

export const FALLBACK: SiteContent = {
  pricing: FALLBACK_PRICING,
  editions: FALLBACK_EDITIONS.map((e) => ({
    slug: e.look,
    variant: e.variant,
    name: { en: e.name, bn: BN_FALLBACK[e.look][0] },
    accessory: { en: e.accessory, bn: BN_FALLBACK[e.look][1] },
    eyes: { en: e.eyes, bn: BN_FALLBACK[e.look][2] },
    tint: e.tint,
    price: null,
  })),
  copy: DEFAULT_COPY,
};

/** Prices, editions, and dynamic web copy for the public site. Falls back to built-in content if unreachable. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasDatabase()) return FALLBACK;
  try {
    const [rows, pricingRow, copyRow] = await Promise.all([
      db().select().from(editions).where(eq(editions.active, true)).orderBy(asc(editions.sortOrder), asc(editions.id)),
      db().select().from(settings).where(eq(settings.key, "pricing")),
      db().select().from(settings).where(eq(settings.key, "site_copy")),
    ]);

    const pricing = { ...FALLBACK_PRICING, ...((pricingRow[0]?.value as Partial<Pricing>) ?? {}) };
    
    // Deep merge dynamic copy from DB
    const dbCopy = copyRow[0]?.value as Partial<SiteCopy> | undefined;
    const copy: SiteCopy = {
      hero: { ...DEFAULT_COPY.hero, ...(dbCopy?.hero ?? {}) },
      manifesto: { ...DEFAULT_COPY.manifesto, ...(dbCopy?.manifesto ?? {}) },
      features: {
        ...DEFAULT_COPY.features,
        ...(dbCopy?.features ?? {}),
        items: dbCopy?.features?.items && dbCopy.features.items.length > 0
          ? dbCopy.features.items
          : DEFAULT_COPY.features.items,
      },
      specs: {
        ...DEFAULT_COPY.specs,
        ...(dbCopy?.specs ?? {}),
        rows: dbCopy?.specs?.rows && dbCopy.specs.rows.length > 0
          ? dbCopy.specs.rows
          : DEFAULT_COPY.specs.rows,
        box: dbCopy?.specs?.box && dbCopy.specs.box.length > 0
          ? dbCopy.specs.box
          : DEFAULT_COPY.specs.box,
      },
      company: { ...DEFAULT_COPY.company, ...(dbCopy?.company ?? {}) },
    };

    const list: SiteEdition[] = rows.map((r) => ({
      slug: r.slug,
      variant: r.variant,
      name: { en: r.nameEn, bn: r.nameBn },
      accessory: { en: r.accessoryEn, bn: r.accessoryBn },
      eyes: { en: r.eyesEn, bn: r.eyesBn },
      tint: r.tint,
      price: r.price,
    }));

    return {
      pricing,
      editions: list.length ? list : FALLBACK.editions,
      copy,
    };
  } catch (err) {
    console.error("getSiteContent: using fallback content", err);
    return FALLBACK;
  }
}
