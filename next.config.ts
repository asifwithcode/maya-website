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
    ];
  },
};

export default nextConfig;
