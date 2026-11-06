import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { TERMS } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলি · মায়া",
  description: "মায়া অর্ডার আর রোবট ও MAYA Companion অ্যাপ ব্যবহারের শর্ত।",
  alternates: { languages: { en: "/terms", bn: "/bn/terms" } },
};

export default function Page() {
  return <LegalPage doc={TERMS.bn} lang="bn" otherHref="/terms" otherLabel="Read in English →" />;
}
