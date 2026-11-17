import type { NextConfig } from "next";

/* Static site: `next build` writes plain HTML, CSS and JS to out/. Dev and
   build use separate folders, so a build never clobbers a running dev server. */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  turbopack: { root: process.cwd() },
};

export default nextConfig;
