import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/mythstride-site" : "",
  assetPrefix: isProd ? "/mythstride-site/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
