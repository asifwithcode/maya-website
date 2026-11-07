import type { Metadata } from "next";
import TrackPage from "@/components/site/TrackPage";

export const metadata: Metadata = {
  title: "Track your order · Maya",
  description: "See where your Maya order is with your order number or phone number.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/en/track", languages: { bn: "/track", en: "/en/track" } },
};

export default function Page() {
  return <TrackPage lang="en" />;
}
