---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/work/[slug]/page.tsx"]
---

# Surface: portfolio home (and the case-study template)

Mode: Experience. Audience: hiring managers, design leads and recruiters at product companies. Job: decide within two minutes whether to interview. Action: open a case study, download the resume, or email.

## Direction contract

THESIS: The portfolio is a design handoff document. The work arrives with its measurements and decisions on it, because Manahari designs and ships. It refuses the category default of a big name over a grid of identical project cards.

OWN-WORLD: Daylight spec paper (neutral-50) with ink text, cobalt for links and actions, and redline magenta used only for annotations: selection frames, measurement brackets, numbered decision pins. Components are frames (1.5px outline, square handles), spec tables (label left, value right, tabular numerals), and decision pins (a numbered circle plus a one-line note). Light by scene: an office at daytime, next to a resume. Dark is offered too.

STORY: The visitor sees a real piece of the Surgical Console selected on the canvas, plays with it, reads the decision pins, and understands this person designs high-stakes interfaces and can build them. Then they skim four case studies, each opening with a spec block (problem, role, outcome), and reach the resume or email from anywhere.

FIRST VIEWPORT: The headline on the left (7 columns), set large: "I design interfaces for high-stakes work, then build them." Below it, three decision lines and the actions (Read the case study, Resume). On the right (5 columns), the arm-identity panel sits inside a magenta selection frame with handles and a size tag. Design tabs Before, A, B, C and Final switch the panel. Numbered pins mark arm color, state dot and on-picture warning. A spec table under it reads the current design's rule. The nav sits on top as a thin bar.

FORM: Design Handoff Spec, IMPECCABLE’S PICK (my list position 1), seed:f0bc1a5689b13c85. Signature interaction: switching between the tested designs changes the live arm panel and the pinned decision notes. Motion grammar: one entrance where the selection frame draws on and the pins drop in, plus input-driven state changes. Keys 1 to 5 switch designs.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
