import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

// content comes from the CMS; the admin revalidates on save, this is a safety net
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "মায়া (MAYA) — ডেস্ক কম্প্যানিয়ন রোবট | Smart Desk Robot Bangladesh",
  description:
    "মায়া একটা স্মার্ট ডেস্ক কম্প্যানিয়ন রোবট: গোল জীবন্ত মুখ, আটটা মুড, এগারোটা স্ক্রিন, সাতটা গেম আর বাংলা চিরকুট। অফিস বা পড়ার টেবিলের কিউট ডেস্ক গ্যাজেট, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
  alternates: { canonical: "/", languages: { bn: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    url: "/",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    title: "মায়া (MAYA) — ডেস্ক কম্প্যানিয়ন রোবট",
    description: "গোল জীবন্ত মুখ, আটটা মুড, এগারোটা স্ক্রিন, সাতটা গেম আর বাংলা চিরকুট। ক্যাশ অন ডেলিভারি।",
    images: [{ url: "/images/og-maya.jpg", width: 1200, height: 630, alt: "মায়া ডেস্ক রোবট" }],
  },
};

export default function HomeBn() {
  return <HomePage lang="bn" />;
}
