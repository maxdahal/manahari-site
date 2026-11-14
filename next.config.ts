import type { NextConfig } from "next";

/* A static site: `next build` writes plain HTML, CSS and JS to out/, and
   Vercel serves it with the redirects and security headers in vercel.json. */
const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
