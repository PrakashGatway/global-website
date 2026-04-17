/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "recharts",
      "date-fns",
      "framer-motion"
    ],
  },
  modularizeImports: {
    "react-icons": {
      transform: "react-icons/{{member}}"
    },
  },
  compiler: {
    removeConsole: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/:slug",
        destination: "/destination/:slug",
      },
    ];
  },
};

module.exports = nextConfig;