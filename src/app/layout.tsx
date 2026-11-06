import type { Metadata, Viewport } from "next";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const DESCRIPTION =
  "An ultra-tactile desk companion robot with a round living face, 8 moods, 11 screens, 7 games, and Bangla dialogue. Designed by Xentoryx.";

export const metadata: Metadata = {
  metadataBase: new URL("https://themaya.site"),
  title: "MAYA — Desk Companion Robot | Xentoryx",
  description: DESCRIPTION,
  applicationName: "Maya",
  keywords: [
    // primary
    "desk companion robot", "desktop companion robot", "smart desk robot", "interactive desk robot",
    "mini desktop robot", "personal desk robot", "smart companion device",
    // secondary / long tail
    "cute desk robot", "smart desktop gadget", "interactive desktop gadget", "smart office companion",
    "IoT desktop device", "mini robot for home and office", "unique smart desk gadgets",
    "small robot for desktop", "desk robot gift",
    // Bangladesh
    "desk companion robot Bangladesh", "smart desk robot Bangladesh", "desktop robot price in Bangladesh",
    "robot price in Bangladesh", "smart gadgets Bangladesh", "unique desk gadgets BD",
    // brand
    "MAYA robot", "MAYA desk companion", "MAYA desktop robot", "MAYA robot Bangladesh", "Xentoryx",
    // Bangla
    "মায়া রোবট", "ডেস্ক রোবট", "ডেস্ক কম্প্যানিয়ন রোবট", "স্মার্ট গ্যাজেট", "রোবটের দাম", "বাংলা রোবট",
  ],
  authors: [{ name: "Xentoryx Labs", url: "https://themaya.site" }],
  creator: "Xentoryx Labs",
  publisher: "Xentoryx Labs",
  category: "technology",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Google Search Console "HTML tag" method: set GOOGLE_SITE_VERIFICATION to the content="" value.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  openGraph: {
    type: "website",
    siteName: "MAYA by Xentoryx Labs",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    title: "MAYA — Desk Companion Robot",
    description: DESCRIPTION,
    images: [{ url: "/images/og-maya.jpg", width: 1200, height: 630, alt: "MAYA desk robot, Bunny edition" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAYA — Desk Companion Robot",
    description: DESCRIPTION,
    images: ["/images/og-maya.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#1d1d1f] antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
