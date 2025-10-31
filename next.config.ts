import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // TEMPORARILY ALLOWING ALL IMAGE PATHS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all https hosts
      },
      {
        protocol: 'http',
        hostname: '**', // allow all http hosts (optional)
      },
    ],
  },
};

export default nextConfig;
