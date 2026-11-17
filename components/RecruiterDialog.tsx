"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { profile } from "@/content/profile";

/* For recruiters: the one-screen summary, as a dialog over whatever page is
   open, instead of a page of its own. A native modal <dialog>, so focus is
   kept inside, Escape closes it and the page behind is inert. It also opens
   from a #recruiter link (the old /recruiter address redirects there).
   Word for word from the published site's For recruiters panel; the research
   assistant row was added by Manahari for this version. */

/* GPA as a tag: green for a grade; grey "No GPA" for the M.S., since UNC
   Chapel Hill's graduate school doesn't use GPAs (owner-supplied fact). */
const DEGREES: { badge: string; full: string; field: string; school: string; meta: string; gpa?: string; gpaNote?: string }[] = [
  { badge: "M.S.", full: "Master of Science", field: "Information Science (HCI)", school: "UNC Chapel Hill", meta: "May 2027 (expected) · Health Informatics cert.", gpaNote: "UNC Chapel Hill’s graduate school doesn’t use GPAs" },
  { badge: "B.S.", full: "Bachelor of Science", field: "Computer Science", school: "BYU-Idaho", meta: "April 2022", gpa: "GPA 3.9" },
];
/* from / to are [year, month 1-12]; to: null is "Present" */
type Ym = [number, number];
const JOBS: { title: string; org: string; when: string; from: Ym; to: Ym | null }[] = [
  { title: "UI/UX Design Intern", org: "Karl Storz (Asensus Surgical)", when: "May to Aug 2026", from: [2026, 5], to: [2026, 8] },
  { title: "Graduate Research Assistant", org: "UNC Chapel Hill", when: "Feb 2026 to Present", from: [2026, 2], to: null },
  { title: "UX Designer", org: "App Team Carolina", when: "Sep 2025 to May 2026", from: [2025, 9], to: [2026, 5] },
  { title: "UX Designer / Front-End Developer", org: "University of Kansas", when: "Jun 2022 to Apr 2025", from: [2022, 6], to: [2025, 4] },
  { title: "UI/UX Design and Front-End Intern", org: "Esri", when: "Jun to Aug 2021", from: [2021, 6], to: [2021, 8] },
];

/* Time in each role and in total, counted in whole months, start and end
   month included (May to Aug is 4 mos), written as LinkedIn does. The total
   counts each month once, so overlapping roles aren't added twice.
   "Present" is measured to this month in the visitor's browser; the static
   HTML carries the build month until the page loads. */
const BUILD_MONTH = (() => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); })();
const thisMonth = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };
const noSubscribe = () => () => {};
const idx = ([y, m]: Ym) => y * 12 + (m - 1);
const span = (from: Ym, to: Ym | null, now: number) => { const a = idx(from), b = to ? idx(to) : now; return { a, b }; };
const months = (from: Ym, to: Ym | null, now: number) => { const { a, b } = span(from, to, now); return Math.max(1, b - a + 1); };
const totalMonths = (now: number) => {
  const seen = new Set<number>();
  for (const j of JOBS) { const { a, b } = span(j.from, j.to, now); for (let m = a; m <= b; m++) seen.add(m); }
  return seen.size;
};
/* short form on screen ("2 yrs 11 mos"); full words for screen readers */
const say = (n: number, long: boolean) => {
  const y = Math.floor(n / 12), m = n % 12;
  const unit = (k: number, one: string, many: string) => (k ? `${k} ${k === 1 ? one : many}` : "");
  return [long ? unit(y, "year", "years") : unit(y, "yr", "yrs"), long ? unit(m, "month", "months") : unit(m, "mo", "mos")].filter(Boolean).join(" ");
};
const fmt = (n: number) => say(n, false);
const spoken = (n: number) => say(n, true);
const SKILLS = ["Figma", "AI-assisted design and development", "Prototyping", "Wireframing", "User research", "Usability testing", "Interaction design", "Design systems", "Accessibility (WCAG)", "HTML and CSS", "React", "User flows", "Visual design", "Typography", "Layout", "Heuristic analysis", "Component libraries", "Adobe Creative Suite", "JavaScript (TypeScript)", "Tailwind CSS", "Next.js", "Drupal", "Git", "Design documentation", "Design critiques", "Agile", "Miro", "Jira", "Trello"];

export function RecruiterDialog() {
  const dlg = useRef<HTMLDialogElement>(null);
  const now = useSyncExternalStore(noSubscribe, thisMonth, () => BUILD_MONTH);
  const total = totalMonths(now);
  const open = () => { if (!dlg.current?.open) dlg.current?.showModal(); };
  const close = () => dlg.current?.close();

  // #recruiter in the address opens it, on load and on later hash changes
  useEffect(() => {
    const check = () => { if (location.hash === "#recruiter") open(); };
    check();
    addEventListener("hashchange", check);
    return () => removeEventListener("hashchange", check);
  }, []);

  // closing clears the #recruiter hash so a refresh doesn't reopen it
  function onClose() {
    if (location.hash === "#recruiter") history.replaceState(null, "", location.pathname + location.search);
  }

  return (
    <>
      <button type="button" className="nav__cta" aria-haspopup="dialog" onClick={open}>For recruiters</button>
      <dialog
        ref={dlg}
        className="rdlg"
        aria-labelledby="r-h"
        onClose={onClose}
        onClick={(e) => { if (e.target === dlg.current) close(); }}
      >
        <div className="rdlg__in">
          <button type="button" className="rdlg__close" onClick={close}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            <span className="sr-only">Close</span>
          </button>

          <section className="rec-top" aria-labelledby="r-h">
            <p className="status"><i aria-hidden="true" />Available for new roles</p>
            <h2 className="rdlg__name" id="r-h">{profile.name}</h2>
            <p className="about-lede">UX / Product Designer who builds in code</p>
            <div className="actions" style={{ marginTop: 24 }}>
              <Link prefetch={false} className="btn btn--primary" href="/#work" onClick={close}>See case studies</Link>
              <a className="btn btn--line" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
            </div>
            <p className="rec-links"><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          </section>

          <div className="sheet">
            <section aria-labelledby="edu-h">
              <h3 className="h3" id="edu-h" style={{ marginBottom: 12 }}>Education</h3>
              <ul className="sheet__jobs">
                {DEGREES.map((d) => (
                  <li key={d.badge}>
                    <span><b><span className="sr-only">{d.full}, </span><span aria-hidden="true">{d.badge} </span>{d.field}</b><br /><span className="muted">{d.school}</span></span>
                    <span className="rdlg__when">
                      <time>{d.meta}</time>
                      {d.gpa ? <span className="tenure">{d.gpa}</span> : null}
                      {d.gpaNote ? <span className="gpa-none"><span className="tenure tenure--plain">No GPA</span><span className="gpa-none__why">{d.gpaNote}</span></span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="exp-h">
              <div className="rdlg__exphead">
              <h3 className="h3" id="exp-h">Experience</h3>
              <span className="tenure tenure--total"><span aria-hidden="true">{fmt(total)}</span><span className="sr-only">{spoken(total)}</span> total</span>
            </div>
              <ul className="sheet__jobs">
                {JOBS.map((j) => (
                  <li key={j.title + j.org}>
                    <span><b>{j.title}</b> <span className="muted">@ {j.org}</span></span>
                    <span className="rdlg__when">
                      <time>{j.when}</time>
                      <span className="tenure"><span aria-hidden="true">{fmt(months(j.from, j.to, now))}</span><span className="sr-only">, {spoken(months(j.from, j.to, now))}</span></span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className="rec-skills" aria-labelledby="rskills-h">
            <h3 className="h3" id="rskills-h" style={{ marginBottom: 12 }}>Skills</h3>
            <div className="skills"><div><ul>{SKILLS.map((s) => <li key={s}>{s}</li>)}</ul></div></div>
          </section>
        </div>
      </dialog>
    </>
  );
}
