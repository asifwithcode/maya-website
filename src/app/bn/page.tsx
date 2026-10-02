import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

// content comes from the CMS; the admin revalidates on save, this is a safety net
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "মায়া — জীবন্ত মুখের এক ছোট্ট ডেস্ক রোবট",
  description:
    "মায়া একটা নরম ডেস্ক রোবট: গোল জীবন্ত মুখ, আটটা মুড, এগারোটা স্ক্রিন, সাতটা গেম আর বাংলা চিরকুট। সাতটা এডিশন, প্লাগ-ইন অ্যাক্সেসরি আর প্রতিটা বাক্সে একটা মিনি কি-চেইন।",
  alternates: { languages: { en: "/", bn: "/bn" } },
};

export default function HomeBn() {
  return <HomePage lang="bn" />;
}
