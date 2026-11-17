/* Tailwind runs as a PostCSS plugin, which Next watches natively, so CSS edits
   reach the dev server live. */
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
