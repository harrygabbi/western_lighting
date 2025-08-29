// next.config.js or next.config.mjs (if you're using ESM)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
