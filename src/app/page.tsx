import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

export const metadata: Metadata = {
  title: "MAYA — The Living Desk Robot | Xentoryx",
  description:
    "An ultra-tactile desk companion robot with a round living face, 8 moods, 11 screens, 7 games, and Bangla dialogue. Designed by Xentoryx.",
  alternates: { languages: { en: "/", bn: "/bn" } },
};

export default function Home() {
  return <HomePage lang="en" />;
}
