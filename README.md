# Manahari Dahal portfolio: site files

Plain HTML, CSS and JavaScript, with no framework, library or build step. Open any `.html` file through a local server (for example `python3 -m http.server 8000`) and edit the files directly.

## What's in the folder

```
index.html        Home: hero, case studies, artwork, contact
about.html        About: About me with the ID card, journey, skills,
                  recognition, contact
work/surgical-console.html   Case study: Surgical Console (arm panel sandbox)
work/ku-brand.html   Case study: KU Brand (color sandbox, wireframe video)
work/asians.html     Case study: Asian's
css/
  site.css        Every page: color tokens, paper grain, top bar, menu,
                  buttons, motion button, cursor, theme fade
  portavia.css    The top bar, Home layout and the closing row
  home.css        Home: recruiter summary, motion tip, artwork, lightbox
  homepage.css    Home: the hero sentence, case study panels, statement,
                  artwork and contact headings
  article.css     The case studies: outline, sections, cards, figures,
                  picture viewer, role buttons
  case.css        The case studies in the homepage's look
  sandbox.css     The sandbox frame both case-study sandboxes share
  arm-sandbox.css, ku-sandbox.css   Each sandbox's own pieces
js/
  site.js         Every page: motion button, theme (with its
                  fade), menu, ID badge, cursor ring
  home.js         Home: recruiter summary, motion tip, nav jumps and
                  highlight, artwork spotlight and lightbox
  scroll.js       Home: Lenis smooth scroll and GSAP scroll motion
  case-scroll.js  Case studies: Lenis and GSAP scroll motion
  toc.js          Case studies: marks the current section in the outline
                  and the phone tab strip; Show all
  viewer.js       Case studies: every picture and drawing opens full screen
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
| `--bg` (page) | #F7F8FA | #0F141C |
| `--surface` | #FFFFFF | #171E29 |
| `--surface-2` (elevated) | #FFFFFF | #202A38 |
| `--ink`, `--text` (primary) | #172033 | #F3F6FA |
| `--text-2` (secondary) | #526071 | #B5C0D0 |
| `--text-subtle` | #616E80 | #8E9BAD |
| `--line` (border) | #D7DEE8 | #334155 |
| `--accent` | #0F766E | #2DD4BF |
| `--accent-hover` | #115E59 | #5EEAD4 |
| `--accent-soft` | #E6F6F4 | #123533 |
| `--ok` / `--warn` / `--error` | #147A52 / #8A5700 / #B42318 | #69D3A5 / #F2C66D / #FF8A80 |

`--dark-bg`, `--on-dark` and `--accent-on-dark` are for the parts that stay dark in both themes (picture viewers, text over case study pictures, the KU sandbox). The hero's red sun and seals (`--seal`), the Nepal flag and the terminal "code." chip keep their own colours on purpose.

`--paper` holds the paper grain (faint slate specks in light mode, light specks in dark mode); it is baked into the page, section and footer backgrounds. Colors that belong to the work shown, not the site, are tokens in that page's CSS: the console's arm and status colors, and KU's brand colors.

Home and the case studies use Helvetica; "code." in the home hero and the sandboxes use JetBrains Mono, and the handwritten notes Kalam. Body text is 18px (16px on small screens).

## Behaviour

- **Navigation**: a full-width top bar on Home and About with Work, About and Artwork (a menu below 860px). Case studies have a breadcrumb bar; from 1101px an outline on the left lists every section, showing only the current section's parts (Show all opens the rest); below that, a tab strip under the breadcrumb.
- **Scroll motion**: Lenis smooth scroll with GSAP ScrollTrigger reveals on every page (`scroll.js`, `case-scroll.js`). If GSAP does not load, CSS scroll-driven animations ease the text in instead.
- **Pictures**: on the case studies every picture opens full screen, with previous and next, arrow keys and swipe.
- **Page changes** cross-fade (cross-document view transitions) where the browser supports it.
- **Intro**: the "hello" plays once per visit (session storage).
- **Theme**: follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`. Switching cross-fades (instant with reduced motion or while motion is paused).
- **Motion**: everything respects `prefers-reduced-motion`, and every page has a pause button for anything that moves on its own.
