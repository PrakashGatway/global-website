/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
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
    removeConsole: false,
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