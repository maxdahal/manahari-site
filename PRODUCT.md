# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js 16 (App Router, static export to `out/`), React 19, TypeScript, Tailwind CSS 4 via `@tailwindcss/turbopack`. Deploys to Vercel. Chosen by the user over static HTML and over rebuilding v1 in place.

## Users
Hiring managers, design leads and recruiters at product companies (broadly, not one industry) who are filling UX engineer or product designer roles. They arrive from a resume, LinkedIn or an application, usually skim for under two minutes, and decide whether to book an interview. Design leads go deeper into one case study; recruiters need role, availability, education and a resume fast.

## Product Purpose
Get Manahari Dahal hired as a UX engineer or product designer. Success: a visitor understands the role, sees proof of design and engineering skill within seconds, and takes a next step (opens a case study, downloads the resume, or emails).

## Positioning
Manahari both designs and builds. The portfolio itself is evidence: real, working pieces of the work (the Surgical Console arm-identity panel) run on the page instead of static screenshots.

## Operating Context
- Visited on desktop during hiring review, and on phones from LinkedIn.
- Often opened next to a resume or an applicant tracking system.
- Design leads may share a case-study link with their team.

## Capabilities and Constraints
- Pages: home (with About, Experience and Artwork sections) and four case studies (Surgical Console, KU Brand, Asian's, Esri Calcite). The recruiter summary is a dialog available from every page.
- Static export only: no server, forms or analytics backend.
- Luna Surgical Console is under NDA. The owner approved naming Luna and Karl Storz; screens stay redrawn, arm colors are stand-ins (lavender, sand, pine, pink), and clinical data is hidden. Don't say how the project ended; talk only about the owner's work.
- Luminary (App Team Carolina) is in development and under NDA: show only our own low-fi greyscale wireframes (`public/images/luminary-*.svg`, made by a script), always captioned as illustrations. The prototype can't be shown; offer a walkthrough on a call.

## Brand Commitments
- Name: Manahari Dahal. Roles: UX engineer, product designer.
- Voice: crisp and executive. Impact first, short sentences, minimal story, built for skimming. Numbers always keep their honest caveats.
- Colors: Himalayan blue `#003893` for action and rhododendron crimson `#DC143C` for annotation, on ink `#191C24` neutrals. Both come from Nepal, where Manahari is from; a footer line says so. Chosen by the owner after an impeccable colorize pass (Nov 2026); generated with the color-palette skill into `styles/tokens.css`.

## Evidence on Hand
- Case-study text and images from v1: `../manahari-site/src/app/(case*)/work/*/page.tsx`, `../manahari-site/public/assets/images/`.
- Metrics, with required caveats:
  - Surgical Console: >50% less task-completion time (exploratory usability tests of a prototype, pre-launch), 30+ workflow screens, 100+ Figma components, 6 of 10 heuristic issues fixed.
  - KU Brand: +30% traffic across ku.edu after launch, 100k+ daily visitors. A team result of the campus rebrand, not Manahari's alone.
  - Asian's: ~50 surveyed, 10+ guests tested. The restaurant closed before build, so 0 orders were measured.
  - Esri Calcite: 50%+ improvement in content discoverability, 20+ designers and developers served.
- Resume: `public/resume.pdf`. Artwork: 10 pieces. Portrait: `index-01` in v1.
- Profile: M.S. Information Science (HCI), UNC Chapel Hill, fall 2025 to May 2027 (expected). B.S. Computer Science, BYU-Idaho, 2022. Associate's, University of Louisiana at Monroe, 2018. Michael Hooker Fellow. ASIS&T poster accepted.
- No testimonials or quotes from managers exist. Do not invent any.

## Product Principles
1. Show, then tell: a working artifact beats a description of one.
2. Impact first: every case study leads with problem, role and outcome in one screen.
3. Honest numbers: every metric carries its source and limits.
4. Every page has a next step: case study, resume or email.

## Accessibility & Inclusion
WCAG 2.1 AA in both light and dark themes (contrast pairs enforced by `scripts/check-contrast.mjs`), keyboard-operable interactive pieces, reduced motion respected, real alt text.
