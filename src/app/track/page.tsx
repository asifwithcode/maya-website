import type { Metadata } from "next";
import TrackPage from "@/components/site/TrackPage";

export const metadata: Metadata = {
  title: "অর্ডার ট্র্যাক · মায়া",
  description: "অর্ডার নম্বর বা ফোন নম্বর দিয়ে আপনার মায়া অর্ডারের অবস্থা দেখুন।",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/track", languages: { bn: "/track", en: "/en/track" } },
};

export default function Page() {
  return <TrackPage lang="bn" />;
}
