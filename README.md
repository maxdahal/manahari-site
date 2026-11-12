# Manahari Dahal portfolio: site files

Plain HTML, CSS and JavaScript, with no framework, library or build step. Open any `.html` file through a local server (for example `python3 -m http.server 8000`) and edit the files directly.

## What's in the folder

```
index.html        Home: hello intro, opening statement, case study reel,
                  artwork, footer
about.html        About: statement, ID badge, journey, skills, recognition
work/surgical-console.html   Case study: Surgical Console (arm panel sandbox)
work/ku-brand.html           Case study: KU Brand (color sandbox, video)
work/asians.html             Case study: Asian's
work/esri.html               Case study: Esri Calcite documentation
vercel.json       Redirects and security headers (CSP, nosniff, referrer,
                  frame and permissions policies)
css/
  site.css        Every page: color tokens, paper grain, buttons, theme fade
  portavia.css, home.css, homepage.css   Older shared layers Home and About
                  still use (top bar pieces, recruiter summary, lightbox,
                  journey)
  carme.css       The current look: header, footer, hero, reel, About
  carme-case.css  The case studies in the current look: step bar,
                  image and text rows, diagrams, component previews
  article.css, case.css   The case study building blocks
  sandbox.css, arm-sandbox.css, ku-sandbox.css   The sandboxes
js/
  site.js         Every page: theme (with its fade), menu, ID badge, cursor
  home.js         Recruiter summary, in-page links, nav highlight, lightbox
  carme.js        Header hide and show, word-by-word statements, case study
                  reel, journey line, resume dialog, footer motion
  steps.js        Case studies: the sticky step bar
  case-scroll.js, toc.js, viewer.js   Case studies: scroll motion, outline
                  state, full-screen pictures
  roles.js, sandbox.js, arm-sandbox.js, ku.js   The sandboxes
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

The site uses Inter (the big footer line uses Geist); "code." in the home hero and the sandboxes use JetBrains Mono, and the handwritten notes Kalam. Body text is 18px (16px on small screens).

## Behaviour

- **Navigation**: a header on every page with About, Work and Artwork, the resume and the theme switch; it hides while you read down and returns on the way up. Case studies add a sticky step bar under it, one circle per section, with the line between circles filling as you scroll.
- **Scroll motion**: Home and About use plain scroll handlers (`carme.js`); the case studies add Lenis and GSAP ScrollTrigger (`case-scroll.js`), loaded from a CDN with integrity hashes.
- **Pictures**: on the case studies every picture opens full screen, with previous and next, arrow keys and swipe.
- **Page changes** cross-fade (cross-document view transitions) where the browser supports it.
- **Intro**: the "hello" plays once per visit (session storage).
- **Theme**: follows the device until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`. Switching cross-fades (instant with reduced motion or while motion is paused).
- **Motion**: everything respects `prefers-reduced-motion`, and every page has a pause button for anything that moves on its own.
