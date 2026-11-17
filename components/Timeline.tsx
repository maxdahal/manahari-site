import Link from "next/link";

/* Career on a horizontal year axis, one row per role so labels never collide.
   Each row: organisation, title and dates on the left; its bar on the right.
   A key names the three kinds (blue work, crimson research, grey education) and
   the same colour marks each label, so a bar and its row read as one. Years are
   shaded bands with the label centred over its own year. Pointing at a row dims
   the others. A dashed tail marks time still to come; the Now line crosses all.
   On phones the chart becomes a vertical rail of coloured dots. */

const FROM = 2021;
const SPAN = 6.5; // Jan 2021 to Jun 2027
const NOW = 5.87; // Nov 2026
const pct = (y: number) => `${((y / SPAN) * 100).toFixed(2)}%`;

type Kind = "work" | "research" | "education";
type Entry = { title: string; org: string; dates: string; start: number; end: number; kind: Kind; href?: string };

/* Titles, organisations and dates as the published site lists them. The
   research assistant role was added by Manahari for this version. */
const ENTRIES: Entry[] = [
  { title: "UI/UX Design Intern", org: "Karl Storz (Asensus Surgical)", dates: "May to Aug 2026", start: 5.33, end: 5.58, kind: "work", href: "/work/surgical-console" },
  { title: "Graduate Research Assistant", org: "UNC Chapel Hill", dates: "Feb 2026 to Present", start: 5.08, end: NOW, kind: "research" },
  { title: "UX Designer", org: "AppTeamCarolina", dates: "Sep 2025 to May 2026", start: 4.67, end: 5.33, kind: "work" },
  { title: "Information Science (HCI)", org: "UNC Chapel Hill", dates: "May 2027 (expected) · Health Informatics cert.", start: 4.58, end: 6.33, kind: "education" },
  { title: "UX Designer / Front-End Developer", org: "University of Kansas", dates: "Jun 2022 to Apr 2025", start: 1.42, end: 4.25, kind: "work", href: "/work/ku-brand" },
  { title: "Computer Science", org: "BYU-Idaho", dates: "April 2022 · GPA 3.9", start: 1.25, end: 1.25, kind: "education" },
  { title: "UI/UX Design and Front-End Intern", org: "ESRI", dates: "Jun to Aug 2021", start: 0.42, end: 0.67, kind: "work", href: "/work/esri" },
];

const YEARS = Array.from({ length: 7 }, (_, i) => FROM + i);
const KINDS: { kind: Kind; label: string }[] = [
  { kind: "work", label: "Work" },
  { kind: "research", label: "Research" },
  { kind: "education", label: "Education" },
];

export function Timeline() {
  return (
    <div className="gt" style={{ "--n": (NOW / SPAN).toFixed(4) } as React.CSSProperties}>
      <ul className="gt__key" aria-label="Key">
        {KINDS.map((k) => <li key={k.kind} className={`gt__key--${k.kind}`}>{k.label}</li>)}
      </ul>
      <div className="gt__chart">
      <div className="gt__axis" aria-hidden="true">
        {YEARS.map((y) => (
          <span key={y} style={{ left: pct(Math.min(y - FROM + 0.5, SPAN - 0.25)) }}>{y}</span>
        ))}
        <span className="gt__now" style={{ left: pct(NOW) }}>Now</span>
      </div>
      <ol className="gt__rows">
        {ENTRIES.map((e) => {
          const point = e.start === e.end;
          const style = {
            "--s": pct(e.start),
            "--w": pct(Math.max(e.end - e.start, 0)),
            "--done": e.end > NOW ? `${(((NOW - e.start) / (e.end - e.start)) * 100).toFixed(1)}%` : "100%",
          } as React.CSSProperties;
          return (
            <li key={e.org + e.title} className={`gt__row gt__row--${e.kind}${point ? " is-point" : ""}`}>
              <div className="gt__label">
                <h3 className="gt__org"><span className="sr-only">{KINDS.find((k) => k.kind === e.kind)!.label}: </span>{e.href ? <Link prefetch={false} href={e.href}>{e.org}</Link> : e.org}</h3>
                <p className="gt__title">{e.title}</p>
                <p className="gt__dates"><time>{e.dates}</time></p>
              </div>
              <div className="gt__track" aria-hidden="true">
                <span className="gt__bar" style={style} />
              </div>
            </li>
          );
        })}
      </ol>
      <span className="gt__nowline" aria-hidden="true" />
      </div>
    </div>
  );
}
