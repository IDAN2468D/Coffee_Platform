/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  experimental: {
    reactCompiler: true,
    optimizePackageImports: [
      'lucide-react',
      'zustand',
      'clsx',
      'tailwind-merge',
      'zod',
      '@google/generative-ai',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
