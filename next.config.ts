import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'neoneo2.flyvn.xyz'
      ]
    }
  }
};

export default nextConfig;
