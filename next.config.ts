import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy Snack runtime to bypass cross-origin browser storage partitioning on Vercel
  async rewrites() {
    return [
      {
        source: '/snack-runtime/:path*',
        destination: 'https://snack-runtime.eascdn.net/:path*',
      },
    ];
  },
  experimental: {
    // Next.js config for turbopack root might vary slightly between minor versions
    // but usually setting it properly inside experimental or top level works.
    // In Next 15+ turbopack options are top-level or slightly different.
    // Let's remove this if it's causing issues, but the user's warning text says:
    // `To silence this warning, set turbopack.root in your Next.js config`
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
