import type { NextConfig } from "next";

const githubPagesBasePath = "/mythstride-site";
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? githubPagesBasePath : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: isProd ? `${githubPagesBasePath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
