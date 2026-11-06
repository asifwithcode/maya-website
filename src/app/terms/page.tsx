import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { TERMS } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Terms of Use · Maya",
  description: "The terms for ordering Maya and using the robot and the MAYA Companion app.",
  alternates: { languages: { en: "/terms", bn: "/bn/terms" } },
};

export default function Page() {
  return <LegalPage doc={TERMS.en} lang="en" otherHref="/bn/terms" otherLabel="বাংলায় পড়ুন →" />;
}
