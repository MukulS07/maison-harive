import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // M:\WEBSITES has its own lockfile; pin the workspace root to this project.
  turbopack: { root: __dirname },
};

export default nextConfig;
