import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { PRIVACY } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Maya",
  description: "How Xentoryx Labs handles your information when you order Maya or use the robot and app.",
  alternates: { languages: { en: "/privacy", bn: "/bn/privacy" } },
};

export default function Page() {
  return <LegalPage doc={PRIVACY.en} lang="en" otherHref="/bn/privacy" otherLabel="বাংলায় পড়ুন →" />;
}
