import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";

// content comes from the CMS; the admin revalidates on save, this is a safety net
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Maya — a tiny desk robot with a living face",
  description:
    "Maya is a soft desk robot with a round living face, eight moods, eleven screens, seven games and Bangla notes. Seven editions, plug-in accessories and a mini keychain in every box.",
  alternates: { languages: { en: "/", bn: "/bn" } },
};

export default function Home() {
  return <HomePage lang="en" />;
}
