import {scale,contrast} from './palette.mjs';
// Colour strategy (impeccable colorize): paper and ink neutrals carry the page; one action hue
// and one annotation hue, each an 11-shade scale from the color-palette skill. Both come from
// Nepal, where Manahari is from (the footer says so):
//   Himalayan blue #003893 (the blue of Nepal's flag) = action: buttons, links, focus,
//     selection, the rail tint.
//   Rhododendron #DC143C (crimson, Nepal's national flower) = the redline, annotation only.
// Light: the seed blue with white text; dark: blue-400 with ink text (white on it fails).
const SEED='#003893';
const P=scale(SEED), R=scale('#DC143C');
const N=scale('#191C24'), W='#FFFFFF';
export const scales={primary:P,neutral:N,redline:R};
export const light={
  background:N[50], foreground:N[950], card:W, 'card-foreground':N[950], popover:W, 'popover-foreground':N[950],
  primary:SEED, 'primary-foreground':W, 'primary-hover':P[900], secondary:P[100], 'secondary-foreground':P[900],
  muted:N[100], 'muted-foreground':N[600], accent:P[100], 'accent-foreground':P[900],
  destructive:'#DC2626', 'destructive-foreground':W, border:N[200], input:N[500], ring:SEED, link:SEED, error:'#B91C1C', redline:R[500], 'redline-foreground':W, 'redline-text':R[500]};
export const dark={
  background:N[950], foreground:N[50], card:N[900], 'card-foreground':N[50], popover:N[900], 'popover-foreground':N[50],
  primary:P[400], 'primary-foreground':N[950], 'primary-hover':P[300], secondary:P[950], 'secondary-foreground':P[100],
  muted:N[900], 'muted-foreground':N[300], accent:P[950], 'accent-foreground':P[100],
  destructive:'#DC2626', 'destructive-foreground':W, border:N[800], input:N[500], ring:P[400], link:P[300], error:'#F87171', redline:R[400], 'redline-foreground':N[950], 'redline-text':R[300]};
// pairs from the skill's verification checklist: [fg, bg, min, label]
export const pairs=t=>[
 ['foreground','background',4.5,'Body text'],['card-foreground','card',4.5,'Card text'],['popover-foreground','popover',4.5,'Popover text'],
 ['primary-foreground','primary',4.5,'Primary button text'],['primary-foreground','primary-hover',4.5,'Primary button text on hover'],['secondary-foreground','secondary',4.5,'Secondary button text'],
 ['muted-foreground','muted',4.5,'Muted text on muted'],['muted-foreground','background',4.5,'Muted text on page'],
 ['accent-foreground','accent',4.5,'Accent text'],['link','background',4.5,'Links on page'],['link','card',4.5,'Links on card'],
 ['error','background',4.5,'Error text'],['error','card',4.5,'Error text on card'],['destructive-foreground','destructive',4.5,'Destructive button text'],
 ['redline-foreground','redline',4.5,'Annotation tag text'],['redline','background',3,'Annotation frame'],['redline','card',3,'Annotation frame on card'],['redline-text','background',4.5,'Annotation text on page'],['redline-text','card',4.5,'Annotation text on card'],
 ['input','background',3,'Input borders'],['ring','background',3,'Focus ring']];
export function check(){let fail=0;for(const [mode,t] of [['light',light],['dark',dark]]){for(const [f,b,min,l] of pairs(t)){const r=contrast(t[f],t[b]);const ok=r>=min;if(!ok)fail++;console.log(`${mode.padEnd(5)} ${ok?'pass':'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${min}) ${l}: ${f} ${t[f]} on ${b} ${t[b]}`);}}return fail;}

