import type { Metadata } from "next";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const DESCRIPTION =
  "An ultra-tactile desk companion robot with a round living face, 8 moods, 11 screens, 7 games, and Bangla dialogue. Designed by Xentoryx.";

export const metadata: Metadata = {
  metadataBase: new URL("https://maya.xentoryxlabs.site"),
  title: "MAYA — The Living Desk Robot | Xentoryx",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "MAYA by Xentoryx Labs",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
