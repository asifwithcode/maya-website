import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

export const metadata: Metadata = {
  title: "MAYA — Desk Companion Robot | Smart Desktop Robot in Bangladesh",
  description:
    "Meet MAYA, a smart desk companion robot with a round living face, 8 moods, 11 screens, 7 games and Bangla notes. A cute desktop robot for your office or study desk, with cash on delivery across Bangladesh.",
  alternates: { canonical: "/en", languages: { bn: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    url: "/en",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    title: "MAYA — Desk Companion Robot",
    description: "A round living face, 8 moods, 11 screens, 7 games and Bangla notes. Cash on delivery across Bangladesh.",
    images: [{ url: "/images/og-maya.jpg", width: 1200, height: 630, alt: "MAYA desk robot" }],
  },
};

export default function Home() {
  return <HomePage lang="en" />;
}
