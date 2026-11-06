import type { Metadata } from "next";
import AppPage from "@/components/site/AppPage";

export const metadata: Metadata = {
  title: "Just Maya অ্যাপ · মায়া",
  description: "মায়ার অ্যান্ড্রয়েড অ্যাপ ডাউনলোড আর ইন্সটলের নিয়ম।",
  alternates: { canonical: "/app", languages: { bn: "/app", en: "/en/app" } },
};

export default function Page() {
  return <AppPage lang="bn" />;
}
