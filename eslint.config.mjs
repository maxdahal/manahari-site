import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // defaults of eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // this project: dev build folder, the archived v1 site and the old static draft
    ".next-dev/**",
    "v1/**",
    "_static-draft/**",
  ]),
]);

export default eslintConfig;
