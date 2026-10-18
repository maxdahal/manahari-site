# Manahari Dahal portfolio: site files

Plain HTML, CSS and JavaScript, with no framework, library or build step. Open any `.html` file through a local server (for example `python3 -m http.server 8000`) and edit the files directly.

## What's in the folder

```
index.html        Home: intro, About me, case studies on shelves, artwork, contact
about.html        The full About page (reached from "More about me" on the ID badge)
luna.html         Case study: Luna Surgical Console (with the arm panel sandbox)
ku-brand.html     Case study: KU Brand (with the color sandbox and wireframe video)
asians.html       Case study: Asian's
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
| `--accent-text` | #B0441C | #FF9D73 |

`--paper` holds the paper grain (dark specks in light mode, light specks in dark mode); it is baked into the page, section and footer backgrounds. Colors that belong to the work shown, not the site, are tokens in that page's CSS: Luna's arm and status colors, KU's brand colors, the Asian's app palette.

Headings use Antonio; everything else uses Inter. The sandboxes use JetBrains Mono. Body text is 18px (16px on small screens).

## Behaviour

- **Navigation**: from 1101px wide, the outline on the left of Home and the case studies does the navigating. Below that, the top bar has a hamburger that opens a full-height menu, and case studies get a stage button at the bottom that opens the outline in a sheet.
- **Tabs**: any `[role="tablist"]` with `[role="tab"]` buttons pointing at panels with `aria-controls` works on its own, with arrow keys, Home and End.
- **Scroll text**: headings, labels, paragraphs and list items ease in as they scroll into view (pure CSS scroll-driven animations; text simply shows in browsers without them).
- **Page changes** cross-fade (cross-document view transitions) where the browser supports it.
- **Intro**: the "hello" plays once per visit (session storage).
- **Theme**: follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`.
- **Motion**: everything respects `prefers-reduced-motion`, and Home has a pause button for anything that moves on its own.
