import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

export const metadata: Metadata = {
  title: "MAYA — The Living Desk Robot | Xentoryx",
  description:
    "An ultra-tactile desk companion robot with a round living face, 8 moods, 11 screens, 7 games, and Bangla dialogue. Designed by Xentoryx.",
  alternates: { canonical: "/en", languages: { bn: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    url: "/en",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    title: "MAYA — The Living Desk Robot",
    description: "A round living face, 8 moods, 11 screens, 7 games and Bangla notes. Cash on delivery across Bangladesh.",
    images: [{ url: "/images/og-maya.jpg", width: 1200, height: 630, alt: "MAYA desk robot" }],
  },
};

export default function Home() {
  return <HomePage lang="en" />;
}
