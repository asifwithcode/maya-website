import type { Metadata } from "next";
import AppPage from "@/components/site/AppPage";

export const metadata: Metadata = {
  title: "Maya অ্যাপ নামিয়ে নিন",
  description: "অ্যান্ড্রয়েডের জন্য Maya অ্যাপ। ব্লুটুথে মায়ার সাথে জুড়ে ওকে আপনার Wi-Fi দেয়।",
  alternates: { languages: { en: "/app", bn: "/bn/app" } },
};

export default function AppBn() {
  return <AppPage lang="bn" />;
}
