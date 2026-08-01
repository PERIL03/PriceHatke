import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.amazon.in" },
      { protocol: "https", hostname: "*.flipkart.com" },
      { protocol: "https", hostname: "*.myntra.com" },
    ],
  },
};

export default nextConfig;
