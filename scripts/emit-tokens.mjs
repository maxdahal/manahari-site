import {scales,light,dark} from './tokens.mjs';
const ref=(v)=>{for(const [n,s] of Object.entries(scales))for(const [k,h] of Object.entries(s))if(h===v)return `var(--color-${n}-${k})`;return v;};
let o=`/* Generated with the color-palette skill; strategy from impeccable colorize.
   Both hues come from Nepal. Action: Himalayan blue #003893 (buttons, links, focus, selection,
   highlight tints). Redline: rhododendron crimson #DC143C, annotations only (frames, pins).
   Neutral: ink #191C24 (surfaces, text, borders, muted text).
   No pure white or black: the lightest surface is paper #FBFCFD, text on dark
   or colour is neutral-50 #F6F7F8, the darkest ink is neutral-950 #15171E.
   Every pair is checked by scripts/check-contrast.mjs (WCAG AA, light and dark). */
@import "tailwindcss";
/* v1's source lives in v1/ on the repo for safekeeping; keep its classes out of this build */
@source not "../v1";
@source not "../_static-draft";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
`;
for(const [n,s] of Object.entries(scales)){o+=`  /* ${n} scale */\n`;for(const [k,h] of Object.entries(s))o+=`  --color-${n}-${k}: ${h};\n`;o+='\n';}
o+='  /* Light mode semantic tokens */\n';
for(const [k,v] of Object.entries(light))o+=`  --color-${k}: ${ref(v)};\n`;
o+='  --radius: 0.5rem;\n}\n\n/* Dark mode overrides */\n.dark {\n';
for(const [k,v] of Object.entries(dark))o+=`  --color-${k}: ${ref(v)};\n`;
o+='}\n';
o+='@media (prefers-color-scheme: dark) {\n  :root:not(.light) {\n';
for(const [k,v] of Object.entries(dark))o+=`    --color-${k}: ${ref(v)};\n`;
o+='  }\n}\n';
process.stdout.write(o);
