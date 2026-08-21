/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // אופטימיזציית React Compiler 19 מתקדמת
    reactCompiler: {
      compilationMode: 'infer',
      panicThreshold: 'none',
    },
    // אופטימיזציית ייבוא חבילות ענקיות (מאיץ את הקומפילציה פי 3 ומונע טעינת מודולים עודפים)
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
      'canvas-confetti',
      'googleapis',
      'zod',
      'zustand',
    ],
  },
  compiler: {
    // הסרת console.log בייצור לשמירה על ביצועים וגודל באנדל מינימלי
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
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

