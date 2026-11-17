# DESIGN.md: Design Handoff Spec

The portfolio is a handoff document: daylight spec paper, ink type, Himalayan blue for action, and rhododendron crimson reserved for annotation. Both colours come from Nepal, and the footer says so. Every page reads like a design spec a developer would trust. The work leads; the chrome recedes.

## Thesis
- The first viewport pairs the headline with the Surgical Console editor in a redline Frame, linking to the study. The playable arm panel lives inside that study, where it shows the sketches being tested; the KU color sandbox lives in the KU study.
- Annotation is the only ornament. If a mark doesn't point at a decision, it doesn't ship.

## Colors (generated: `scripts/tokens.mjs` → `styles/tokens.css`)
- Strategy (impeccable colorize): cool-neutral temperature; paper and ink carry the page; colour is low-dose and every colour has one job. Both hues come from the owner's own story (Manahari is originally from Nepal), chosen by the owner over surgical green, blueprint blue and graphite. Built with the color-palette skill, one 11-shade scale per role. A footer colophon on every page names the source: "Colors from home: Himalayan blue and rhododendron, Nepal’s national flower." with a dot of each source hue; the same dots (`NepalDots` in `components/Shell.tsx`) follow "Nepal" in the About section's journey.
- Himalayan blue #003893 (the blue of Nepal's flag): buttons, links, focus, text selection, the rail tint. Light: the seed with white text 10.6:1, hover #002766, tints #E3EDFC. Dark: blue-400 #4289FA with ink text 5.3:1, hover #86B2F9, links #86B2F9 (8.3:1), tints #001433.
- Rhododendron #DC143C (crimson, Nepal's national flower): the redline, annotation only. #E0153D light (white text 4.8:1), #EB5270 dark.
- Uses colours, never the flag's shape or emblems.
- The stage (hero, case cards) is the ink neutral #15171E in both themes. Its action is a paper pill with ink text; blue-300 #86B2F9 shows only in the arrow chip, the focus ring and the Resume underline on hover, so the hero never reads as one bright accent on black.
- Browser surfaces: selection is the green tint, the caret and form controls take the action green, the scrollbar is a muted ink thumb.
| Role | Light | Dark | Rule |
|---|---|---|---|
| background | #F6F7F8 | #15171E | spec paper |
| foreground | #15171E | #F6F7F8 | ink |
| card | #FFFFFF | #2A2F3C | raised surfaces only |
| primary | Himalayan blue #003893 | blue-400 #4289FA (ink text) | actions and links only |
| muted-foreground | #545D78 | #B5BAC9 | captions, meta |
| border | #D9DCE3 | #383F51 | hairlines |
| redline (rhododendron) | #E0153D | #EB5270 | annotations only: frames, pins, the "Now" marker, bullets, struck "Replaced" text |

- Light is the default scene (an office, daytime review); dark follows the system or the toggle, stored as `theme` in localStorage.
- Case-study accents (#13B3B9, #0051BA, #FF5200, #007AC2) appear only inside their own imagery.
- Console colors live in `.armkit`. They are real product values, not theme tokens: arms #b9a4ff, #e3c48f, #1f5f4a, #f49ac9. Severity: running #2e9e5b, warning #e0a93b, error #d93a2b, inactive #8a8f98.
- Gate: `npm run build` runs `scripts/check-contrast.mjs` first. Every token pair must pass AA in both modes.

## Typography
- Urbanist (headings, wordmark, display numbers; `--font-display`) and Work Sans (body and UI; `--font-sans`), both variable via next/font. Display tracking -0.02em (Urbanist is set tight); hero name 700, role line 500 at 0.45em of the name.
- Scale: display `clamp(2.5rem…5.25rem)` /800/−0.04em, h2 `clamp(1.75rem…2.5rem)` /800, h3 1.25rem /700, lead `clamp(1.19…1.375rem)`, body 1.0625rem, small 0.875rem.
- Numbers in metrics and tables use `tabular-nums`. Text wraps with `balance` on headings. Measure is 68ch.

## Vocabulary (components)
- **Frame** (`components/Frame.tsx`): 1.5px redline outline, 6px offset, four square handles, a name tag top-left and an optional size tag bottom-right. It wraps framed figures and the portrait. On the work index it appears only on hover or focus.
- **Pin** (`.pin`): a 26px magenta disc with a number. It marks a decision in sequence, never as decoration. The `i` pin marks a caveat.
- **Spec table** (`.spec`): label and value in a dl, with an ink top rule and hairline rows.
- **Decision log** (`.decision`): a pin, then the title and reason, then a "Replaced" column with struck-through redline text.
- **Versions** (`.version`): dashed cards. The chosen one gets a solid redline border.
- **Readouts**: 3 metrics under an ink rule. A caveat always follows them.

## Layout
- 1280 max width, gutter `clamp(16px, 4vw, 48px)`. The hero is left-aligned: the v1 badge, the v1 headline (name and roles in full weight, joining words muted), "See case studies" and "Resume", then the full-width annotated console. The console starts in the first screen at 1440x900 and links to the Surgical Console study (pointer only; the caption link is the accessible one).
- Home order: hero, case studies, artwork, experience. The page ends on the timeline and the footer email.
- Experience (`components/Timeline.tsx`): horizontal, one row per role on a shared 2021 to 2027 axis (cobalt work, redline research, grey education, dashed for time to come), one Now line. Under 860px the axis sticks under the header.
- Case study (`app/work/[slug]/page.tsx`, content generated from v1 into `content/cases.ts`): header (v1 problem, my part, outcome numbers, caveat, facts), cover, then v1's acts (The setup, Trade-offs, Resolution and impact...) each holding its parts. Acts are 160 to 240px apart, parts 96 to 144px; body text 16px at 1.75 line height, 62ch. Outcomes have their own band under the cover: the numbers large in a row under an ink rule, the caveat below. The sticky rail is navigation only; the section being read gets a bold label over a tint of the action color that fades out to the right (and fades in as it moves), ("On this page"): one track runs down the left, stepping in to the open act's parts and back out with an S-bend; it is lit from a start dot down to the part being read, and sections already read stay in ink while the rest are muted. Under 960px the rail becomes a sticky bar of acts.
- Header (`components/Shell.tsx`): a full-width sticky bar on the 1280 page grid: "md." left; Work, About, Artwork, the "For recruiters" pill and a round theme toggle right. Clear at the top of the page; frosted with a hairline once scrolled (`data-scrolled`). The current page gets ink text and a short ink rule under it. Under 640px: wordmark, recruiter pill, theme and v1's "Open menu" button; the links open as 48px rows in a panel under the bar.

## Copy
- Every visible word on every page comes from the published v1 site, word for word: homepage (with its About, Experience and Artwork sections), header, footer, the For recruiters dialog, case studies, 404, metadata. Do not invent copy. The one addition is the Graduate Research Assistant row, which Manahari supplied. The arm panel and KU sandbox labels also use v1's own sandbox wording (`public/js/arm-sandbox.js`, `ku.js`). The only non-v1 text: image alt text, the owner's own facts, and the footer colour colophon and the artwork "keep scrolling" hint, both asked for by the owner. Check with the word audit (every visible segment vs. manaharidahal.me plus the v1 source) before shipping.

## Depth
- One glow on the page: blue light pooling under the hero console (`--glow-a`). Shadows elsewhere are neutral.
- A 48px measurement grid fades out behind the hero (a spec surface behind a redlined screen).
- Buttons are pills with a top highlight and a neutral lift; hover lifts 2px.
- All depth tokens are redefined for dark mode.

## Motion
- Theme switch: the new theme pours out of the toggle as a wobbling blob (View Transition, clip-path polygon baked per frame, 1.4s ease-in-out-cubic, wobble fades as it covers). No View Transitions: 600ms colour cross-fade. Reduced motion: instant.
- Engine: GSAP 3.15 ScrollTrigger (pinned version). No ScrollSmoother: native scroll stays, so jump links and focus work. Every effect sits inside `gsap.matchMedia()` under `prefers-reduced-motion: no-preference`; with reduced motion or no JS, all content is visible and static.
- Scroll reveals (`components/ScrollFx.tsx`, one list of selectors): section heads and case-study blocks rise 36px and fade in once, `expo.out`, 0.9s, staggered in batches. Experience bars grow from their start date, staggered, and the Now line drops in. Reveals use opacity, never visibility, so content stays in the accessibility tree.
- Arm panel: pins drop in (420ms, `cubic-bezier(0.16,1,0.3,1)`) when the visitor switches designs.
- In-page jumps are scrolled by `components/HashScroll.tsx` (header offset, focus moves to the target), not CSS smooth scrolling. `prefers-reduced-motion` makes jumps instant and removes the pin drop and every GSAP effect.

## Signature interactions
`components/KuSandbox.tsx`: the KU color sandbox, Storybook-style. Presets (Use/Avoid), a live Brand Center preview with the Fire holding box, and Controls / Accessibility (WCAG 4.5, 3, 7) / Code tabs with arrow-key navigation. KU colors appear only inside it.

`components/ArmPanel.tsx`:
- Tabs Before / A / B / C / A+C, with keys 1 to 5.
- Click an arm to cycle its state.
- A 1-second glance test asks "Which arm needs help?" and reports right or wrong plus the time.
- NDA: names masked, screens redrawn. The design rules match the v1 sandbox.

## Bans (craft floor)
- No eyebrow labels, gradient text, identical card grids, thick side-border accents, offset shadows, emoji icons or mono-as-costume.
- Copy: sentence case, no invented facts, metrics or quotes.

## Accessibility
- WCAG 2.1 AA: themed `::selection`, 2px ring focus with 3px offset, skip link, 40–48px targets, aria-pressed tabs, live regions for panel notes and glance results, and a dialog lightbox with arrow keys.
- Lighthouse on the production build: 95+ in all four categories (home, case study, about).

## Case-study rules (critique pass, Nov 2026)
- Wordmark is "md." with the dot in redline; the favicon and touch icon are the same mark on ink.
- Header contract: every study has a problem (≤2 sentences), a one-sentence part, readouts and a caveat that states limits, never a claim.
- Decisions render as `decisions` (with "Instead of" split out), tried versions as `versions` (kept one marked), heuristic reviews as `checks`. Plain `pairs` are for definitions only.
- Parts with no image and little text sit closer together (`case-section--short`); a short text beside a tall image stacks (`split--stack`).
- Captions render only when they have text. Every study ends with Resume and Get in touch before More projects.
- Phones: the sticky bar shows acts only; the cover and the outcome band sit above the spec.
- Content edits on top of the v1 text live in the converter's edits.py; v1 wording stays word for word except the owner-approved rewordings.

## Home stage (Nov 2026, replaces the annotated console hero and the work index)
- Hero (`components/HeroStage.tsx`): on a dark stage (`--stage` #0E1015, fixed in both themes): the availability line, a two-tone headline at medium weight ("Hi, I’m Manahari." 600 in ink, the role line 500 in grey #8A90A2), the first sentence of the v1 lede, and two actions. Behind, right of the text: 12 cards (9 artworks, plus the KU tower, Asian’s and the console cover, as 520–640px JPEG thumbs) drift toward the viewer from a vanishing point (CSS 3D, perspective 900px, 30s loop, staggered), fading in far away and out as they pass; a mask keeps them off the text. Paused off screen; still under reduced motion. Under 900px the field sits above the text.
- Case studies (`components/WorkIndex.tsx`): a header row with a hairline under it (v1 heading and subline on the left; a "01 / 04" counter, previous/next arrows and a four-step bar on the right) over a full-width accordion of tall image panels. One panel is open with title, role, outcome and "View project"; the rest are numbered strips with the title running up them. Hover, focus or the arrows open a panel (700ms flex, expo-out); clicking opens the study. Under 960px the panels stack as rows, the open one tall.

## Dev setup
- Tailwind runs as a PostCSS plugin (`postcss.config.mjs`), so CSS edits reach `npm run dev` live. Dev writes to `.next-dev`, builds to `.next`, so a build never clobbers a running dev server.

## Site structure
- One homepage carries everything except the case studies: hero, Case studies, About, Experience, Artwork. `/about`, `/artwork` and `/recruiter` redirect to `/#about`, `/#artwork` and `/#recruiter` (vercel.json).
- About (`components/AboutSection.tsx`): portrait and the three numbers beside four ARIA tabs named with v1's section titles (About me, My journey so far, Skills & expertise, Research & recognition). The journey is an exclusive accordion (`<details name="journey">`), newest place open. Phones: tabs become a 2 × 2 grid.
- Experience (`components/Timeline.tsx`): a key (Work, Research, Education) with the same colour as a dot on each label; shaded year bands with each year label centred over its band; pointing at a row dims the others; a Now line. Below 860px it becomes a vertical rail of coloured dots.
- Artwork (`components/DollyStage.tsx`): a dolly shot through all ten pieces. The section is pinned and the page scroll moves the camera down a corridor of pieces (CSS 3D, no WebGL), alternating left and right; "Keep scrolling to see all the artwork" (owner-requested copy) is a frosted pill under the heading, over the pieces, fading at the last one; a counter and progress bar sit underneath. Only the piece in focus takes clicks; any piece opens the lightbox; tabbing to a piece moves the camera to it. Reduced motion gets the masonry grid.
- For recruiters (`components/RecruiterDialog.tsx`): a native modal `<dialog>` from the header button on every page; also opens from `#recruiter`. A bottom sheet on phones.
