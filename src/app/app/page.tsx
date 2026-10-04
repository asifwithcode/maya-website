import type { Metadata } from "next";
import AppPage from "@/components/site/AppPage";

export const metadata: Metadata = {
  title: "Get the Maya app",
  description: "Download the Maya app for Android. It pairs your Maya over Bluetooth and gives her your Wi-Fi.",
  alternates: { languages: { en: "/app", bn: "/bn/app" } },
};

export default function App() {
  return <AppPage lang="en" />;
}
