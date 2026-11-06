import type { Metadata, Viewport } from "next";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const DESCRIPTION =
  "An ultra-tactile desk companion robot with a round living face, 8 moods, 11 screens, 7 games, and Bangla dialogue. Designed by Xentoryx.";

export const metadata: Metadata = {
  metadataBase: new URL("https://themaya.site"),
  title: "MAYA — The Living Desk Robot | Xentoryx",
  description: DESCRIPTION,
  applicationName: "Maya",
  keywords: [
    "Maya robot", "desk robot", "desk companion", "AI desk robot Bangladesh", "robot toy Bangladesh",
    "মায়া রোবট", "ডেস্ক রোবট", "বাংলা রোবট", "Xentoryx",
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
    title: "MAYA — The Living Desk Robot",
    description: DESCRIPTION,
    images: [{ url: "/images/og-maya.jpg", width: 1200, height: 630, alt: "MAYA desk robot, Bunny edition" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAYA — The Living Desk Robot",
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
