# Manahari Dahal portfolio: site files

Plain HTML, CSS and JavaScript, with no framework, library or build step. Serve the folder locally and edit the files directly. Pages link to clean URLs like `/work/luna` (Vercel maps them to `work/luna.html`), so use a server that does the same, for example `npx vercel dev`, or open `/work/luna.html` directly with `python3 -m http.server 8000`.

## What's in the folder

```
index.html        Home: hero, selected work, about, capabilities, artwork,
                  design system, contact
about.html        The full About page (/about)
work/luna.html    Case study: Luna Surgical Console (/work/luna, arm panel sandbox)
work/ku-brand.html  Case study: KU Brand (/work/ku-brand, color sandbox, video)
work/asians.html  Case study: Asian's (/work/asians)
vercel.json       Clean URLs, and redirects from the old /luna, /ku-brand and
                  /asians addresses
css/
  site.css        Every page: tokens, paper grain, top bar, menu, buttons, tabs,
                  section band, cards, figures, footer, motion, scroll text
  compact.css     The case-study layout: outline column, sections, type scale,
                  and the stage button and sheet on smaller screens
  case-study.css  Components shared by the three case studies
  sandbox.css     The Storybook-style sandbox frame (Luna and KU Brand)
  home.css, about.css, luna.css, ku.css, asians.css   Page-only styles
js/
  site.js         Every page: theme, menu, tabs, section bands, ID badge,
                  reveals, counters, cursor ring
  case-study.js   The three case studies: stage button and sheet,
                  scrollytelling steps, principle tooltips, flip cards,
                  wireframe video, links into tabs
  sandbox.js      Shared sandbox behaviour: tabs, entrance demo, outline pulse
  home.js, about.js, luna.js, ku.js, asians.js   Page-only behaviour
assets/
  images/         Images the pages use
  video/          The KU wireframe video (mp4 and webm)
  icons/          Favicon (svg, 32px png) and the Apple touch icon
```

Each page loads `site.css`, then its layout and page files. A rule in a page file only affects that page.

## Colors and type

Every interface color is a token at the top of `css/site.css`, light values first, then dark (used for the system setting and the toggle):

| Token | Light | Dark |
|---|---|---|
| `--bg` | #F9F9F6 | #0F0F11 |
| `--surface` | #F1F1EC | #18181B |
| `--ink` | #1A1A1E | #E6E6E1 |
| `--text` | #4A4A4A | #B5B5B5 |
| `--accent` | #E65F2E | #FF7A45 |
| `--accent-text` | #A43E19 | #FF9D73 |

`--paper` holds the paper grain (dark specks in light mode, light specks in dark mode); it is baked into the page, section and footer backgrounds. Colors that belong to the work shown, not the site, are tokens in that page's CSS: Luna's arm and status colors, KU's brand colors, the Asian's app palette.

Headings use Figtree; everything else uses Inter. The sandboxes use JetBrains Mono. Body text is 18px (16px on small screens).

## Behaviour

- **Navigation**: the top bar links to Work, About, Artwork and Contact. On the case studies the outline on the left takes over from 1101px wide. Below 1101px the top bar has a hamburger that opens a full-height menu, and case studies get a stage button at the bottom that opens the outline in a sheet. Without JavaScript the top bar keeps its links.
- **Tabs**: any `[role="tablist"]` with `[role="tab"]` buttons pointing at panels with `aria-controls` works on its own, with arrow keys, Home and End.
- **Scroll text**: section headings rise gently into view (pure CSS scroll-driven animations); body text simply shows.
- **Page changes** cross-fade (cross-document view transitions) where the browser supports it.
- **Hello**: the handwritten "hello" in the hero draws itself once per visit (session storage) and never blocks the page.
- **Theme**: follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`.
- **Motion**: everything respects `prefers-reduced-motion`, and Home has a pause button for anything that moves on its own.
