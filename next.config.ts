import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'neoneo2.flyvn.xyz'
      ]
    }
  }
};

export default nextConfig;
