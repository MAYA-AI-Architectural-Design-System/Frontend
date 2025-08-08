import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'my.mayaai.online',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'project.mayaai.online',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
