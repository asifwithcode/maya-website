import type { Metadata } from "next";
import GuidePage from "@/components/site/GuidePage";
import { GUIDE } from "@/components/site/guide-content";

export const metadata: Metadata = {
  title: GUIDE.bn.meta.title,
  description: GUIDE.bn.meta.description,
  alternates: { languages: { en: "/docs", bn: "/bn/docs" } },
};

export default function DocsBn() {
  return <GuidePage lang="bn" />;
}
