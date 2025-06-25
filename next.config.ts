import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: false,
  },
  // Turbopack configuration
  experimental: {
    turbo: {
      rules: {
        // Configure SVG handling for Turbopack
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Keep webpack config for build (production) - Turbopack is dev-only
  webpack(config, { dev }) {
    if (!dev) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
    }
    return config;
  },
};

export default nextConfig;
