# Manahari Dahal portfolio: site files

Plain HTML, CSS and JavaScript, with no framework, library or build step. Open any `.html` file through a local server (for example `python3 -m http.server 8000`) and edit the files directly.

## What's in the folder

```
index.html        Home: hero, case studies on shelves, About me, artwork, contact
about.html        The full About page (from "More about me")
work/surgical-console.html   Case study: Surgical Console (arm panel sandbox)
work/ku-brand.html   Case study: KU Brand (color sandbox, wireframe video)
work/asians.html     Case study: Asian's
css/
  site.css        Every page: tokens, paper grain, top bar, menu, buttons,
                  motion button, cursor, scroll text
  portavia.css    The top bar, Home and About layouts, and the case-study bar
  home.css        Home only: hero, shelves, seasons, artwork, recruiter summary
  article.css     The case studies: outline, sections, cards, figures,
                  picture viewer, moving heroes, role buttons
  sandbox.css     The sandbox frame both case-study sandboxes share
  arm-sandbox.css, ku-sandbox.css   Each sandbox's own pieces
js/
  site.js         Every page: motion button, hero videos, theme, menu,
                  ID badge, cursor ring
  home.js         Home: hero, skill rings, recruiter summary, nav, seasons,
                  artwork lightbox
  toc.js          Case studies: marks the current section in the outline
                  and the phone tab strip; Show all
  viewer.js       Case studies: pictures open full screen with previous/next
  roles.js        Surgical Console: the role buttons over the room diagram
  sandbox.js      Shared sandbox behaviour: tabs, entrance demo, Try it pulse
  arm-sandbox.js, ku.js   Each sandbox's own behaviour
assets/
  images/         Images the pages use
  video/          The KU wireframe video (mp4 and webm)
  icons/          Favicon (svg, 32px png) and the Apple touch icon
```

The case-study pages are generated: each picture carries its width and height, so the page never shifts while pictures load.

## Colors and type

Every interface color is a token at the top of `css/site.css`, light values first, then dark (used for the system setting and the toggle):

| Token | Light | Dark |
|---|---|---|
| `--bg` | #F9F9F6 | #0F0F11 |
| `--surface` | #F1F1EC | #18181B |
| `--ink` | #1A1A1E | #E6E6E1 |
| `--text` | #4A4A4A | #B5B5B5 |
| `--accent` | #6C4EE6 | #D0FF71 |
| `--accent-text` | #5B3FD1 | #D0FF71 |

`--paper` holds the paper grain (dark specks in light mode, light specks in dark mode); it is baked into the page, section and footer backgrounds. Colors that belong to the work shown, not the site, are tokens in that page's CSS: the console's arm and status colors, and KU's brand colors.

Headings use Antonio; everything else uses Inter. The sandboxes use JetBrains Mono, and the handwritten notes Kalam. Body text is 18px (16px on small screens).

## Behaviour

- **Navigation**: a full-width top bar on Home and About (a menu below 860px). Case studies have a breadcrumb bar; from 1101px an outline on the left lists every section, showing only the current section's parts (Show all opens the rest); below that, a tab strip under the breadcrumb.
- **Scroll text**: headings, labels, paragraphs and list items ease in as they arrive and out under the top bar (pure CSS scroll-driven animations; text simply shows in browsers without them).
- **Pictures**: on the case studies every picture opens full screen, with previous and next, arrow keys and swipe.
- **Page changes** cross-fade (cross-document view transitions) where the browser supports it.
- **Intro**: the "hello" plays once per visit (session storage).
- **Theme**: follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`.
- **Motion**: everything respects `prefers-reduced-motion`, and every page has a pause button for anything that moves on its own.
