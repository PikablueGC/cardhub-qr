// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cardhub-qr.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cardhub-qr.vercel.app',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;