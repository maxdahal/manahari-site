import type { NextConfig } from "next";

/* A static site: `next build` writes plain HTML, CSS and JS to out/, and
   Vercel serves it with the redirects and security headers in vercel.json. */
const nextConfig: NextConfig = {
  output: "export",
  /* one 404 page for the whole site, though it has more than one root
     layout (src/app/global-not-found.tsx) */
  experimental: {
    globalNotFound: true,
  },
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
