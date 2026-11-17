---
name: mdahal.
description: Portfolio of a UX engineer who designs products and builds them in code
colors:
  wimbledon-green: "#006633"
  wimbledon-green-deep: "#004d26"
  court-mint: "#7ee8a2"
  court-mint-light: "#a6f0bf"
  sage-paper: "#e3eae2"
  sage-surface: "#ebf0ea"
  sage-tint: "#d3e8da"
  ink-green: "#14241f"
  moss-text: "#3f524b"
  lichen-text: "#4f6159"
  sage-rule: "#c3cfc3"
  night-lawn: "#082419"
  night-surface: "#0d2e21"
  night-surface-raised: "#11382a"
  night-tint: "#103d28"
  chalk: "#eef4ee"
  sage-mist-text: "#b7cdbf"
  fern-text: "#92ad9e"
  night-rule: "#214d3b"
  sage-key: "#c9d8c7"
  warn: "#8a5700"
  error: "#b42318"
typography:
  display:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 1.2rem + 3vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "2.64rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "1.74rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  stat:
    fontFamily: "Newsreader, Lyon Text, Iowan Old Style, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  card: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  page-max: "1520px"
  case-column: "1040px"
  reading: "32em"
  header: "84px"
components:
  button-primary:
    backgroundColor: "{colors.ink-green}"
    textColor: "{colors.sage-paper}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-green}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-resume:
    backgroundColor: "transparent"
    textColor: "{colors.ink-green}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  button-resume-focus:
    backgroundColor: "{colors.wimbledon-green}"
    textColor: "{colors.night-lawn}"
  chip:
    backgroundColor: "{colors.sage-tint}"
    textColor: "{colors.wimbledon-green}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  status-pill:
    backgroundColor: "{colors.sage-tint}"
    textColor: "{colors.wimbledon-green}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  card:
    backgroundColor: "rgba(20, 36, 31, 0.04)"
    textColor: "{colors.ink-green}"
    rounded: "{rounded.card}"
    padding: "22px"
---

# Design System: mdahal.

## Overview

**Creative North Star: "The Field Notebook"**

This is a designer-engineer's working notebook kept on sage paper. One serif, Newsreader, does all the talking, from the 60px opening statement down to 13px chips, the way a notebook keeps one hand throughout. The work is shown rather than described: real screens, interactive sandboxes to try, numbered wireframes and honest notes on what was left unfinished. Colour is almost absent. Wimbledon Green appears only where it means something: a reached step, a key phrase, a pressed control.

The pages are calm and generous. A big statement, a lot of air, then evidence. Case studies read like letters: one narrow column of text with pictures, cards and playgrounds stepping wider around it. Dark mode is not inverted chrome but a night lawn, deep green with chalk-white type and a bright Court Mint accent. Motion is scroll-linked and explains the reading order: words light up as you reach them, a journey line draws down to each stop. All of it steps aside for reduced motion and the pause button.

**Key Characteristics:**
- One serif family for every role. Mono appears only for code and data inside sandboxes.
- Two themes, both green: Sage Paper by day, Night Lawn by dark.
- Flat surfaces. Depth comes from tone and rules, never shadows.
- Pills and soft 16px cards that press down slightly when tapped.
- Scroll-linked motion that brightens text you can already read and never hides it.

## Colors

A near-monochrome green palette: sage neutrals carry the page and a single green does every job colour has to do.

### Primary
- **Wimbledon Green** (#006633 by day; Court Mint #7ee8a2 at night): links, key phrases in the opening statement, reached steps and timeline pins, the status pill, focus fills. Wimbledon Green Deep (#004d26) is its hover; Court Mint Light (#a6f0bf) is the night hover.

### Neutral
- **Sage Paper** (#e3eae2): the day page. Softer than white on purpose.
- **Sage Surface** (#ebf0ea): cards and raised panels by day. Sage Tint (#d3e8da) fills chips and the status pill.
- **Ink Green** (#14241f): headings and primary text by day; the primary button's fill.
- **Moss Text** (#3f524b): body paragraphs and secondary text (6.8:1 on Sage Paper). Lichen Text (#4f6159) for metadata (5.4:1).
- **Sage Rule** (#c3cfc3): hairlines, card borders, the resume pill's outline.
- **Night Lawn** (#082419): the dark page. Night Surface (#0d2e21) and Night Surface Raised (#11382a) for cards; Night Tint (#103d28) for chips.
- **Chalk** (#eef4ee): headings and primary text at night. Sage Mist (#b7cdbf) for body (9.8:1); Fern (#92ad9e) for metadata (6.8:1); Night Rule (#214d3b) for hairlines.
- **Sage Key** (#c9d8c7): the night colour of key phrases in the opening statement.

### Named Rules
**The One Green Rule.** Green is the only hue. It marks meaning (a link, a key phrase, a reached state, focus) and never decorates. Status colours (warn #8a5700, error #b42318) exist for sandboxes and forms only.

**The Both Lawns Rule.** Every colour change is made in both themes, and the dark values are defined once for `[data-theme="dark"]` and once for the system preference. Edit both or neither.

**The Readable Floor Rule.** Text is never dimmed below AA. Scroll effects rest at 3:1 for large text and 4.5:1 for body text in both themes (see `--sw-floor*` and `--stop-floor` in `carme.css`).

## Typography

**Display Font:** Newsreader (with Lyon Text, Iowan Old Style, Georgia)
**Body Font:** Newsreader (same stack)
**Label/Mono Font:** Geist Mono for code; Inter and JetBrains Mono only inside product sandboxes that reproduce other products' UIs

**Character:** a single variable serif with optical sizing, set tight and medium-weight at display sizes and open and regular for reading. It reads like a careful letter, not a brochure.

### Hierarchy
- **Display** (500, clamp(2rem → 3.75rem), 1.1, -0.025em): the Home and About opening statements. Never more than one per page.
- **Headline** (500, about 2.6rem, 1.1): case-study act titles and Home section titles. The case-study page title runs larger (about 4rem).
- **Title** (500, about 1.75rem, 1.1): parts within an act.
- **Lede** (400, clamp(1.125rem → 1.375rem), 1.55): the paragraph under an opening statement, capped at 31em (about 75 characters).
- **Body** (400, 1.1875rem, 1.75): case-study prose, held to a 32em reading column (about 75 characters at any size).
- **Label** (500, 0.875rem, 1.6): labels, metadata, outline links, chips (0.8125rem).
- **Stat** (700, 3rem, 1, -0.04em): the outcome numbers on case studies.

### Named Rules
**The One Hand Rule.** Newsreader sets every role. A second family appears only when the content itself is code, or is a faithful reproduction of another product's interface.

**The Measure-in-Em Rule.** Reading widths are set in em, never px, so a line holds about 75 characters at whatever size the text renders.

## Layout

Two spatial models share one gutter (clamp(20px, 4vw, 56px)) and a 1520px page maximum.

- **Home and About** are image-led and airy: one centred statement held in place while it lights up, then work panels, an artwork grid and a big name in the footer.
- **Case studies** are letter-style: a 1040px content column, with running text stopping at the 32em reading width on the same left edge. Pictures, cards and playgrounds fill the column. On wide screens, parts with a picture alternate text and image side by side. A sticky outline sits beside the article, and a sticky step bar (60px, 66px at 760px and below) tracks the four acts under the 84px header.
- **Breakpoints** in use: 480, 640, 760/761 (cards stack; three-up card rows become swipe strips; step labels hide), 809, 861 (side-by-side parts start), 1100.
- The header hides on scroll down and returns on scroll up; sticky elements follow it via `--cm-top`.
- Space reserved for script-built UI must match its final size, so nothing shifts on load (layout shift is 0 on every page).

## Elevation & Depth

The system is flat. No component carries a box shadow. Depth comes from tone: a card is one step lighter than the page by day and one step lighter (greener) at night, with a one-pixel Sage Rule or Night Rule border. Sticky bars use the page colour at 92% with a 10px backdrop blur, so content passes softly beneath them.

### Named Rules
**The Flat Paper Rule.** Surfaces never float. If something needs separating, give it a tone step or a hairline, not a shadow.

## Shapes

Two corner radii only. Interactive controls are full pills (999px): buttons, the resume link, chips, the status pill, sandbox presets. Containers are softly rounded cards (16px). Images and figures follow the card radius. Hairline rules (1px) divide sections; the case-study timeline and step bar use 2px lines with round 14px dots.

## Components

Tactile and friendly: soft pills and quiet cards that answer every touch.

### Buttons
- **Shape:** full pill (999px), 52px tall in the hero, 40px in the header.
- **Primary:** Ink Green fill with Sage Paper text by day (Chalk fill with Night Lawn text at night), 0 28px padding, weight 500.
- **Secondary:** transparent with a Sage Rule outline and Ink Green text.
- **Press:** every button scales to 0.96 while pressed (off when motion is paused or reduced).
- **Hover / Focus:** the resume pill and nav pills fill with Wimbledon Green (Court Mint at night) and switch to the page colour for text on focus-visible.

### Chips
- **Style:** Sage Tint fill, Wimbledon Green text, 13px weight 500, 4px 10px padding, full pill. At night: Night Tint fill with Court Mint text.
- **Status pill:** the same shape at 16px weight 600, with a small green dot, for "Available for … roles".

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** ink at 4% over the page by day; Night Surface at night.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Sage Rule / Night Rule.
- **Internal Padding:** 22px.
- Point cards in case studies drop the box entirely: a label, a short heading and text, separated by space.

### Navigation
- **Header:** brand mark ("M–D", Newsreader 700) with a rolling role caption, regular-weight text links, the resume pill and a theme toggle. 84px tall, page colour at 92% with blur, hides on scroll down.
- **Case-study step bar:** four acts as dots on a line that fills with green as you read; the current step is bold with a soft green ring.
- **Outline:** a sticky "On this page" list in Label type, Wimbledon Green links.

### Scroll-lit Statement (signature)
The Home and About opening statement is held in place while each word lights from a readable floor to full as you scroll; green key phrases keep their colour throughout. With reduced motion or the pause button, it simply reads in full.

### Journey Timeline (signature)
A vertical line draws down as you scroll and each stop lights in colour as the line reaches its pin. Unreached stops are grey and slightly dim but stay readable.

### Sandboxes (signature)
Interactive playgrounds inside case studies (arm identity panels, KU brand colours) let the reader try the work. They may reproduce the original product's fonts and colours, including deliberately failing colour pairs, because they are evidence, not site chrome.

## Do's and Don'ts

### Do:
- **Do** set every new piece of text in Newsreader, using the hierarchy above.
- **Do** make every colour change in both themes, in both dark blocks.
- **Do** keep reading text at 32em (case studies) or 31em (ledes).
- **Do** use the pill (999px) for anything you can press and 16px for anything that contains.
- **Do** give every scroll effect a reduced-motion path that shows the final state, and keep dimmed text at AA.
- **Do** reserve space for anything a script inserts after load.

### Don't:
- **Don't** add box shadows; use a tone step or a hairline.
- **Don't** introduce a second accent hue or use green decoratively.
- **Don't** dim text below 3:1 (large) or 4.5:1 (body) at rest, in either theme.
- **Don't** add a new font family for site chrome.
- **Don't** set reading widths in px.
