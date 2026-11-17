"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";

/* For recruiters: the one-screen summary, as a dialog over whatever page is
   open, instead of a page of its own. A native modal <dialog>, so focus is
   kept inside, Escape closes it and the page behind is inert. It also opens
   from a #recruiter link (the old /recruiter address redirects there).
   Word for word from the published site's For recruiters panel; the research
   assistant row was added by Manahari for this version. */

const DEGREES = [
  { badge: "M.S.", full: "Master of Science", field: "Information Science (HCI)", school: "UNC Chapel Hill", meta: "May 2027 (expected) · Health Informatics cert." },
  { badge: "B.S.", full: "Bachelor of Science", field: "Computer Science", school: "BYU-Idaho", meta: "April 2022 · GPA 3.9" },
];
const JOBS = [
  { title: "UI/UX Design Intern", org: "Karl Storz (Asensus Surgical)", when: "May to Aug 2026" },
  { title: "Graduate Research Assistant", org: "UNC Chapel Hill", when: "Feb 2026 to Present" },
  { title: "UX Designer", org: "App Team Carolina", when: "Sep 2025 to May 2026" },
  { title: "UX Designer / Front-End Developer", org: "University of Kansas", when: "Jun 2022 to Apr 2025" },
  { title: "UI/UX Design and Front-End Intern", org: "Esri", when: "Jun to Aug 2021" },
];
const SKILLS = ["Figma", "AI-assisted design and development", "Prototyping", "Wireframing", "User research", "Usability testing", "Interaction design", "Design systems", "Accessibility (WCAG)", "HTML and CSS", "React", "User flows", "Visual design", "Typography", "Layout", "Heuristic analysis", "Component libraries", "Adobe Creative Suite", "JavaScript (TypeScript)", "Tailwind CSS", "Next.js", "Drupal", "Git", "Design documentation", "Design critiques", "Agile", "Miro", "Jira", "Trello"];

export function RecruiterDialog() {
  const dlg = useRef<HTMLDialogElement>(null);
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
                    <time>{d.meta}</time>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="exp-h">
              <h3 className="h3" id="exp-h" style={{ marginBottom: 12 }}>Experience</h3>
              <ul className="sheet__jobs">
                {JOBS.map((j) => (
                  <li key={j.title + j.org}><span><b>{j.title}</b> <span className="muted">@ {j.org}</span></span><time>{j.when}</time></li>
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
