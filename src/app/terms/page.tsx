import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { TERMS } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলি · মায়া",
  description: "মায়া অর্ডার আর রোবট ও Just Just Maya অ্যাপ ব্যবহারের শর্ত।",
  alternates: { canonical: "/terms", languages: { bn: "/terms", en: "/en/terms" } },
};

export default function Page() {
  return <LegalPage doc={TERMS.bn} lang="bn" otherHref="/en/terms" otherLabel="Read in English →" />;
}
