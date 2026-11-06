import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.199"],
  experimental: {
    cpus: 1,
  },
  redirects() {
    return [
      // Bangla is the default language now (plain paths); English moved to /en.
      // Old /bn links (and the booklet's QR codes) keep working.
      { source: "/bn", destination: "/", permanent: true },
      { source: "/bn/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
