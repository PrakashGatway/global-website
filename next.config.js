/** @type {import('next').NextConfig} */
const nextConfig = {
  
  compress: true,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

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