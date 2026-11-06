import type { NextConfig } from "next";

// The Android app the site and the printed booklet point to. The booklet's QR code opens
// /app, so only this line changes when a new APK is put in public/downloads/.
const CURRENT_APK = "/downloads/MAYA-Companion-1.6.0.apk";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.199"],
  experimental: {
    cpus: 1,
  },
  redirects() {
    return [
      // Temporary (307): the target changes with every app release.
      { source: "/app", destination: CURRENT_APK, permanent: false },
      // Bangla is the default language now (plain paths); English moved to /en.
      // Old /bn links (and the booklet's QR codes) keep working.
      { source: "/bn", destination: "/", permanent: true },
      { source: "/bn/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
