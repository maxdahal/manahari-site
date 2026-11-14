# Manahari Dahal portfolio

Next.js (App Router) with React, Tailwind CSS and shadcn/ui, built as a static site: `next build` writes plain HTML, CSS and JS to `out/`, and Vercel serves it with the redirects and security headers in `vercel.json`.

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
npm run build      # static site in out/
python3 .claude/serve.py 8000   # serve out/ with clean URLs, like Vercel
```

## What's in the folder

```
src/app/
  globals.css          Tailwind, shadcn/ui and the design tokens (@theme)
  (site)/              Home and About: their own root layout and stylesheets
    page.tsx           Home: hello intro, statement, case study reel,
                       artwork, footer
    about/page.tsx     About: statement, ID badge, journey, skills,
                       recognition
  (case)/work/         Case studies: KU Brand, Asian's, Esri Calcite
  (case-ref)/work/     Surgical Console (case study layout plus the reading
                       hierarchy, .cs-ref)
src/components/
  ui/                  shadcn/ui: button, dialog, tabs
  site/
    document.tsx       html, head and body shared by every page
    header.tsx, footer.tsx
    theme-provider.tsx, theme-toggle.tsx   next-themes, html[data-theme]
    resume-dialog.tsx  The resume in a dialog (shadcn Dialog)
    recruiter-dialog.tsx, recruiter-summary.tsx   Quick summary (Dialog)
    roles-tabs.tsx, roles-room.tsx         Surgical Console roles (Tabs)
    legacy-scripts.tsx Runs a page's behaviour scripts from public/js
src/styles/
  entry-site.css, entry-case.css   What each layout loads, in order
  site.css             Colour tokens, paper grain, theme fade
  carme.css            The current look: header, footer, hero, reel, About
  carme-case.css       Case studies: step bar, image and text rows,
                       diagrams, component previews
  portavia.css, home.css, homepage.css, article.css, case.css   Older
                       shared layers still in use
  sandbox.css, arm-sandbox.css, ku-sandbox.css   The sandboxes
public/
  js/                  Behaviour that is still plain JavaScript (see below)
  assets/              Images, the KU video, icons
  resume.pdf
vercel.json            Redirects and security headers (CSP, nosniff,
                       referrer, frame and permissions policies)
```

### How the styles fit together

The site's own stylesheets are imported into a cascade layer, `legacy`, which sits above Tailwind's reset and below its utilities (`@layer theme, base, legacy, components, utilities`). The pages keep their look from the older CSS, and any Tailwind class on a shadcn/ui component wins over it. New work should use Tailwind utilities and the tokens below.

Home and About, and the case studies, are separate root layouts (route groups) because they load different stylesheets. Links between pages are plain `<a>` so each page loads fresh.

### What is still plain JavaScript

These run from `public/js` through `LegacyScripts`, in the same order as before:

- `site.js`: phone menu, motion pause, ID badge, cursor ring
- `home.js`: in-page links, nav highlight, artwork lightbox
- `carme.js`: header hide and show, word-by-word statements, case study reel, journey line, footer motion
- `steps.js`: the sticky step bar
- `case-scroll.js`, `toc.js`, `viewer.js`: scroll motion (Lenis and GSAP ScrollTrigger from a CDN, with integrity hashes), outline state, full-screen pictures
- `sandbox.js`, `arm-sandbox.js`, `ku.js`: the sandboxes

Theme, the resume dialog, the quick summary and the Surgical Console roles are React now.

## Colours and type

Light mode is soft sage, dark mode deep teal. The values live in `src/styles/carme.css` (the `.cm` blocks) on top of the base tokens in `src/styles/site.css`, and `globals.css` maps them to Tailwind and shadcn/ui names:

| Tailwind / shadcn | Site token | Light | Dark |
|---|---|---|---|
| `background` | `--bg` | #E3EAE2 | #0A2B2D |
| `card`, `popover` | `--surface` | #EBF0EA | #0F3538 |
| `muted`, `secondary` | `--surface-2` | #EEF2ED | #143F42 |
| `foreground`, `primary` | `--ink` | #14241F | #EAF5F3 |
| (text) | `--text-2` | #3F524B | #B2CDC9 |
| `muted-foreground` | `--text-subtle` | #4F6159 | #8FB2AD |
| `border`, `input` | `--line` | #C3CFC3 | #25565A |
| `brand`, `ring` | `--accent` | #0F6A63 | #4FD1C0 |
| `accent` | `--accent-soft` | #D3E6DF | #14444A |

The type is Newsreader (a free serif close to Lyon Text). Diagrams and sandboxes use Inter, Geist Mono and JetBrains Mono, and the handwritten notes Kalam.

## Behaviour

- **Navigation**: a header on every page with About, Work and Artwork, the resume and the theme switch; it hides while you read down and returns on the way up. Case studies add a sticky step bar, one circle per section.
- **Theme**: next-themes. Follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`. Switching cross-fades (instant with reduced motion or while motion is paused).
- **Intro**: the "hello" plays once per visit (session storage).
- **Motion**: everything respects `prefers-reduced-motion`, and every page has a pause button for anything that moves on its own.
