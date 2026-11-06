import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { PRIVACY } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "প্রাইভেসি পলিসি · মায়া",
  description: "মায়া অর্ডার আর রোবট ও অ্যাপ ব্যবহারে Xentoryx Labs আপনার তথ্য কীভাবে রাখে।",
  alternates: { canonical: "/privacy", languages: { bn: "/privacy", en: "/en/privacy", "x-default": "/privacy" } },
};

export default function Page() {
  return <LegalPage doc={PRIVACY.bn} lang="bn" otherHref="/en/privacy" otherLabel="Read in English →" />;
}
