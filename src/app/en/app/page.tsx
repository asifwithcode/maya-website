import type { Metadata } from "next";
import AppPage from "@/components/site/AppPage";

export const metadata: Metadata = {
  title: "MAYA Companion app · Maya",
  description: "Download the Maya Android app and how to install it.",
  alternates: { canonical: "/en/app", languages: { bn: "/app", en: "/en/app" } },
};

export default function Page() {
  return <AppPage lang="en" />;
}
