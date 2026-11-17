import type { Metadata } from "next";
import { Header, Footer } from "@/components/Shell";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "For recruiters",
  description: "Manahari Dahal. UX / Product Designer who builds in code.",
};

/* Word for word from the published site's For recruiters panel. The research
   assistant row was added by Manahari for this version. */
const DEGREES = [
  { badge: "M.S.", full: "Master of Science", field: "Information Science (HCI)", school: "UNC Chapel Hill", meta: "May 2027 (expected) · Health Informatics cert." },
  { badge: "B.S.", full: "Bachelor of Science", field: "Computer Science", school: "BYU-Idaho", meta: "April 2022 · GPA 3.9" },
];
const JOBS = [
  { title: "UI/UX Design Intern", org: "Karl Storz (Asensus Surgical)", when: "May to Aug 2026" },
  { title: "Graduate Research Assistant", org: "UNC Chapel Hill", when: "Feb 2026 to Present" },
  { title: "UX Designer", org: "AppTeamCarolina", when: "Sep 2025 to May 2026" },
  { title: "UX Designer / Front-End Developer", org: "University of Kansas", when: "Jun 2022 to Apr 2025" },
  { title: "UI/UX Design and Front-End Intern", org: "ESRI", when: "Jun to Aug 2021" },
];
const SKILLS = ["Figma", "AI-assisted design and development", "Prototyping", "Wireframing", "User research", "Usability testing", "Interaction design", "Design systems", "Accessibility (WCAG)", "HTML and CSS", "React", "User flows", "Visual design", "Typography", "Layout", "Heuristic analysis", "Component libraries", "Adobe Creative Suite", "JavaScript (TypeScript)", "Tailwind CSS", "Next.js", "Drupal", "Git", "Design documentation", "Design critiques", "Agile", "Miro", "Jira", "Trello"];

export default function Recruiter() {
  return (
    <>
      <Header current="Recruiter" />
      <main id="main" className="wrap">
        <section className="rec-top" aria-labelledby="r-h">
          <p className="status"><i aria-hidden="true" />Available for new roles</p>
          <h1 className="about-title" id="r-h">{profile.name}</h1>
          <p className="about-lede">UX / Product Designer who builds in code</p>
          <div className="actions" style={{ marginTop: 32 }}>
            <a className="btn btn--primary" href="/#work">See case studies</a>
            <a className="btn btn--line" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
          </div>
          <p className="rec-links"><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        </section>

        <div className="sheet">
          <section aria-labelledby="edu-h">
            <h2 className="h3" id="edu-h" style={{ marginBottom: 12 }}>Education</h2>
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
            <h2 className="h3" id="exp-h" style={{ marginBottom: 12 }}>Experience</h2>
            <ul className="sheet__jobs">
              {JOBS.map((j) => (
                <li key={j.title + j.org}><span><b>{j.title}</b> <span className="muted">@ {j.org}</span></span><time>{j.when}</time></li>
              ))}
            </ul>
          </section>
        </div>
        <section className="rec-skills" aria-labelledby="skills-h">
          <h2 className="h3" id="skills-h" style={{ marginBottom: 12 }}>Skills</h2>
          <div className="skills"><div><ul>{SKILLS.map((s) => <li key={s}>{s}</li>)}</ul></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
