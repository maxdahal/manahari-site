export type Img = { src: string; alt: string; w: number; h: number };

export type Metric = { value: string; label: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  /* numbered decision pins: the choice, and the pattern it replaced */
  | { type: "decisions"; items: { title: string; text: string; instead?: string }[] }
  /* tried versions in order, e.g. V1 to V6 */
  | { type: "versions"; items: { tag: string; title: string; text: string; kept?: boolean }[] }
  /* size: "sm" for small diagrams, so they don't blow up to full width */
  | { type: "figure"; img: Img; caption: string; frame?: string; size?: "sm" | "md" }
  /* text beside a picture: breaks up long runs of copy */
  | { type: "split"; text: string; title?: string; img: Img; caption?: string; flip?: boolean }
  | { type: "video"; webm: string; mp4: string; poster: string; w: number; h: number; caption: string; label: string }
  /* more: fold supporting shots behind a disclosure labelled with this text */
  | { type: "gallery"; items: (Img & { caption: string })[]; cols?: 2 | 3 | 4 | 5; more?: string }
  /* the same screen at each fidelity, left to right */
  | { type: "stages"; rows: { name: string; note: string; items: (Img & { caption: string })[] }[] }
  | { type: "pairs"; items: { term: string; text: string }[] }
  | { type: "quote"; text: string; by: string }
  | { type: "checks"; items: { tag: string; title: string; text: string; fixed: boolean }[] }
  | { type: "armpanel" }
  /* KU color sandbox: contrast-check any two Brand Center colors */
  | { type: "kusandbox" }
  /* numbers inside a section: the value, and what it counts */
  | { type: "stats"; items: { term: string; text: string }[] }
  | { type: "link"; text: string; href: string };

export type Section = {
  id: string;
  /* the act this part belongs to, as v1 names it: The setup, Trade-offs ... */
  stage: string;
  title: string;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  /* the page heading when it differs from the card title */
  heading?: string;
  /* one-line card description */
  short: string;
  /* the homepage card's metadata strip: role, domain, impact, readable in seconds */
  glance?: { role: string; domain: string; impact: string };
  problem: string;
  part?: string;
  years: string;
  /* the case's own accent, used only inside the study */
  accent: string;
  cover: Img;
  /* homepage tile image, when it differs from the cover */
  card?: Img;
  metrics: Metric[];
  caveat: string;
  spec: { label: string; value: string }[];
  sections: Section[];
  takeaways: { title: string; text: string }[];
  note?: string;
  /* buttons under the case header: a sandbox or wireframes on the page (#id), or a live site or prototype */
  actions?: { label: string; href: string; play?: boolean }[];
};
