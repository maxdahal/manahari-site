import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Links between pages are plain <a> on purpose: each page loads its own
      // behaviour scripts (public/js) once, so it needs a full page load.
      "@next/next/no-html-link-for-pages": "off",
      // Images are already sized and compressed (webp), and the site is a
      // static export, so next/image would add nothing.
      "@next/next/no-img-element": "off",
      // The root layouts (components/site/document.tsx) write their own head.
      "@next/next/no-head-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/js/**",
  ]),
]);

export default eslintConfig;
