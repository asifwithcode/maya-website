import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { PRIVACY } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Maya",
  description: "How Xentoryx Labs handles your information when you order Maya or use the robot and app.",
  alternates: { canonical: "/en/privacy", languages: { bn: "/privacy", en: "/en/privacy" } },
};

export default function Page() {
  return <LegalPage doc={PRIVACY.en} lang="en" otherHref="/privacy" otherLabel="বাংলায় পড়ুন →" />;
}
