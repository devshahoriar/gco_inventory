import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    reactCompiler: true
  },
  reactStrictMode: false,
  eslint:{
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
