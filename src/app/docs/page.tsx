import type { Metadata } from "next";
import GuidePage from "@/components/site/GuidePage";
import { GUIDE } from "@/components/site/guide-content";

export const metadata: Metadata = {
  title: GUIDE.en.meta.title,
  description: GUIDE.en.meta.description,
  alternates: { languages: { en: "/docs", bn: "/bn/docs" } },
};

export default function DocsPage() {
  return <GuidePage lang="en" />;
}
