import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // M:\WEBSITES has its own lockfile; pin the workspace root to this project.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
