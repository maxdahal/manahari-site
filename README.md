# My portfolio (v2)

This is the second version of my portfolio. I'm a UX engineer and product designer, and I wanted the site itself to show both halves of that: I designed it and I built it.

The first version was plain HTML, which I later moved to Next.js with shadcn/ui. For v2 I started over instead of patching v1, because I wanted a tighter design system and a homepage someone could skim in under two minutes.

## What I built

- **A homepage built for skimming.** Hiring managers and recruiters usually give a portfolio a couple of minutes, so the homepage leads with who I am and what I do, then the case studies, then About, Experience and Artwork.
- **Five case studies:** Surgical Console, KU Brand, Luminary, Asian's and Esri Calcite. Each one opens with the problem, my role and the outcome, and every number carries its caveat. For example, the KU traffic increase was a team result of the campus rebrand, not mine alone.
- **Working pieces instead of screenshots.** The Surgical Console study has an arm panel you can click through, the same way I tested the sketches. The KU study has a color sandbox built on KU's real brand colors.
- **NDA work handled honestly.** Surgical Console screens are redrawn, the arm colors are stand-ins and clinical data is hidden. Luminary is still in development, so I only show my own low-fi greyscale wireframes, labeled as illustrations.
- **A recruiter summary.** It's a dialog on every page with my role, availability, education and resume, for people who need those details fast.
- **An artwork section.** It shows art I make for fun, and you fly through the pieces as you scroll.

## Design decisions

- **Colors from home.** I'm from Nepal, so the two accent colors come from there: Himalayan blue (`#003893`, the blue of Nepal's flag) for links and buttons, and rhododendron crimson (`#DC143C`, Nepal's national flower) only for annotations. The footer says where they come from.
- **The site as a design handoff.** Pages look like a spec a developer would trust: plain paper-like background, ink-colored type, and red annotation marks that point at real decisions instead of decorating.
- **No pure white or black.** The lightest surface is `#FBFCFD` and the darkest ink is `#15171E`, in both light and dark themes.
- **Accessibility as a build step.** I generate the color tokens with a script, and `npm run build` fails if any text and background pair misses WCAG AA contrast in either theme. Motion respects reduced-motion settings, and the interactive pieces work from the keyboard.

`DESIGN.md` has the full design rules, and `PRODUCT.md` has the audience, goals and constraints I designed against.

## How it's built

- Next.js 16 (App Router) with React 19 and TypeScript, exported as a static site. There's no server, database or analytics.
- Tailwind CSS 4 plus my own CSS in `app/globals.css`, with color tokens in `styles/tokens.css`.
- GSAP for the hero and scroll animations.
- The case-study text and data live in `content/`, so I can edit words without touching components.
- Hosted on Vercel.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # checks color contrast, then exports the static site to out/
```

`npm run check:contrast` runs only the contrast check, and `npm run lint` runs ESLint.

Before a production deploy, set `NEXT_PUBLIC_SITE_URL` to the real domain. The sitemap, canonical URLs and share cards use it.
