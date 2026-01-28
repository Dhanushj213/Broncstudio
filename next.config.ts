import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false, // Enable PWA in dev mode for testing, change to process.env.NODE_ENV === "development" for prod only if needed
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "share.google" }, // User requested specific host
      { protocol: "https", hostname: "*.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default withPWA(nextConfig);

