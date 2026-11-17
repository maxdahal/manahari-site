// Contrast gate from the color-palette skill: every token pair, light and dark.
import { check } from "./tokens.mjs";
const fails = check();
if (fails) { console.error(`\n${fails} token pair(s) fail WCAG AA. Fix scripts/tokens.mjs, then run node scripts/emit-tokens.mjs > styles/tokens.css`); process.exit(1); }
console.log("\nAll token pairs pass WCAG AA in light and dark.");
