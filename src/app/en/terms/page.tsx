import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { TERMS } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Terms of Use · Maya",
  description: "The terms for ordering Maya and using the robot and the Just Maya app.",
  alternates: { canonical: "/en/terms", languages: { bn: "/terms", en: "/en/terms" } },
};

export default function Page() {
  return <LegalPage doc={TERMS.en} lang="en" otherHref="/terms" otherLabel="বাংলায় পড়ুন →" />;
}
