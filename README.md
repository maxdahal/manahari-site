# Manahari Dahal portfolio: site files

This is the portfolio as it looks today, rebuilt from scratch. It is plain HTML, CSS and JavaScript, with no framework or library and no build step. Open any `.html` file in a browser to see it, and edit the files directly.

## What's in the folder

```
index.html        Home
about.html        About me
luna.html         Case study: Luna Surgical Console
ku-brand.html     Case study: KU Brand
asians.html       Case study: Asian's
css/
  site.css        Every page: tokens, base, layout, header and menu, buttons,
                  chips, tabs, the section band, cards, callouts, figures,
                  tables, footer, motion
  case-study.css  The three case studies: hero, stages rail, stage cards and
                  shared case-study blocks
  home.css        Home only
  about.css       About only
  luna.css        Luna only
  ku.css          KU Brand only
  asians.css      Asian's only
js/
  site.js         Every page: theme toggle, header, phone menu, tabs, reveals,
                  letter-by-letter headings, counters
  case-study.js   The three case studies: rail, principle tooltips, flip cards,
                  links into tabs
  home.js, about.js, luna.js, asians.js   Page-only behavior
assets/images/    The images the pages use
```

Each page loads `site.css`, then (for a case study) `case-study.css`, then its own file. A rule in a page file only affects that page.

## How the layout works

- Everything is laid out with **CSS grid and flexbox**, with `gap` for spacing. There is no `position: absolute` anywhere.
- `position: sticky` is used for the stages rail, Home's stacked sections, the artwork row and the footer reveal.
- `position: fixed` is used only for things that float over the page: the header, the phone menu, the phone rail pill, the principle tooltip and the skip link.
- When two things share one spot (the Home hero lines, a donut chart and its label, the two faces of a flip card, the Luna dashboard marks), they share one grid cell with `grid-area: 1 / 1` instead of being stacked with absolute positioning.
- Breakpoints are 860px (tablet) and 640px (phone). The case-study rail becomes a bottom pill under 1100px.

## The section band

The section heading sits on the top edge of a softly tinted band:

```html
<section class="block">
  <p class="eyebrow"><span class="marker">Overview</span></p>
  <h3 class="block__title">Designing for the operating room</h3>
  <div class="block__body"> … content … </div>
</section>
```

`.block__body` is the band. A negative top margin pulls it up under the heading, and `box-shadow` with `clip-path` stretches its color to the full screen width, so no script is needed. `.block--wide` drops the left indent and `.block--plain` drops the band.

## Colors and type

Every interface color is a token at the top of `css/site.css`, with light values first, then the dark values (used for the system dark mode and for the toggle). The main ones:

| Token | Light | Dark |
|---|---|---|
| `--bg` | #F9F9F6 | #0F0F11 |
| `--surface` | #F1F1EC | #18181B |
| `--ink` | #1A1A1E | #E6E6E1 |
| `--text` | #4A4A4A | #B5B5B5 |
| `--accent` | #0051BA | #1DB954 |
| `--accent-text` | #0046A0 | #5DD68A |
| `--band` | 8% accent over the page | 8% accent over the page |

Colors that belong to the work being shown, not to the site, are tokens at the top of that page's CSS file: Luna's arm and status colors in `luna.css`, KU's brand swatches in `ku.css`, and the Asian's app palette in `asians.css`.

Headings use Antonio 600; everything else uses Inter 400, 500 or 600. Body text is 18px (16px under 860px) with 1.6 line spacing. Nothing is smaller than 16px except the date pills on the About timeline (12px).

## Behavior

- **Tabs**: any `[role="tablist"]` with `[role="tab"]` buttons that point at panels with `aria-controls` works on its own. Selecting a tab sets `hidden` on the other panels. Arrow keys, Home and End move between tabs.
- **Reveals**: add `class="reveal"` to fade a block in as it scrolls into view. Add `data-split` to a heading for the letter-by-letter reveal.
- **Counters**: `<span data-count="30">30</span>` counts up when it comes into view.
- **Theme**: the site follows the device setting until someone uses the toggle; the choice is kept in `localStorage` under `mt-theme`.
- Everything respects reduced motion: with `prefers-reduced-motion: reduce`, nothing animates.

## Checked

Every page was checked in light and dark mode at 1440, 860 and 390 pixels wide: no horizontal scrolling, no script errors, and text contrast at AAA (7:1) with axe, including the content inside closed tabs. The tabs, rail, tooltips, flip cards, lightbox, phone menu, timeline switch, donut charts, design-system kit and card sort were all clicked through.
