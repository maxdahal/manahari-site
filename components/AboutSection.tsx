"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { NepalDots } from "./Shell";
import { profile } from "@/content/profile";
import { about } from "@/content/about";

/* About, on the homepage: the portrait and the three numbers stay in view
   beside four tabs (v1's own section titles), so only one part of the story
   is on screen at a time. The journey is a list of places that open one at a
   time. Tabs follow the ARIA pattern: arrow keys, Home and End. */

const TABS = ["About me", about.journeyTitle, about.skillsTitle, about.recTitle] as const;

export function AboutSection() {
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = TABS.length - 1;
    const next = { ArrowRight: tab === last ? 0 : tab + 1, ArrowLeft: tab === 0 ? last : tab - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setTab(next);
    refs.current[next]?.focus();
  }

  const panel = (i: number) => ({
    role: "tabpanel" as const,
    id: `about-panel-${i}`,
    "aria-labelledby": `about-tab-${i}`,
    className: `about__panel${tab === i ? " is-on" : ""}`,
    inert: tab !== i,
    tabIndex: 0,
  });

  return (
    <section className="wrap section" id="about" aria-labelledby="about-h">
      <div className="section__head">
        <h2 className="h2" id="about-h">About</h2>
      </div>

      <div className="about">
        <div className="about__side">
          <figure className="portrait">
            <img src="/images/index-01-5d96ff329c.webp" alt="Portrait of Manahari Dahal" width={900} height={900} loading="lazy" />
          </figure>
          <div className="about__stats">
            {about.stats.map((s) => (
              <p key={s.label}><b>{s.value}</b><span>{s.label}</span></p>
            ))}
          </div>
        </div>

        <div className="about__main">
          <div className="tabs" role="tablist" aria-label="About" onKeyDown={onKey}>
            {TABS.map((t, i) => (
              <button
                key={t}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="tab"
                id={`about-tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`about-panel-${i}`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="about__panels">
            <div {...panel(0)}>
              {about.intro.map((t) => <p key={t} className="about-lede">{t}</p>)}
              <dl className="about-facts">
                {about.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
              <div className="actions" style={{ marginTop: 32 }}>
                <a className="btn btn--primary" href={`mailto:${profile.email}`}>Get in touch</a>
                <a className="btn btn--line" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
              </div>
            </div>

            <div {...panel(1)}>
              <p className="about__sub">{about.journeySub}</p>
              <ol className="trip">
                {about.places.map((j, i) => (
                  <li key={j.place}>
                    <details name="journey" open={i === about.places.length - 1}>
                      <summary>
                        <span className="trip__place">{j.place}{j.place === "Nepal" ? <NepalDots /> : null}</span>
                        <time>{j.when}</time>
                        <svg className="trip__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                      </summary>
                      <div className="trip__body">
                        <p>{j.text}</p>
                        {j.items.length ? (
                          <ul className="journey__items">
                            {j.items.map((it) => (
                              <li key={it.title + it.when}>
                                <time>{it.when}</time>
                                <b>{it.title}</b>
                                <span>{it.org}</span>
                                {"text" in it ? <p>{it.text}{"link" in it ? <> <Link prefetch={false} href={it.link.href}>{it.link.text}</Link></> : null}</p> : null}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            </div>

            <div {...panel(2)}>
              <div className="skills">
                {Object.entries(about.skills).map(([group, list]) => (
                  <div key={group}>
                    <h3>{group}</h3>
                    <ul>{list.map((s) => <li key={s}>{s}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>

            <div {...panel(3)}>
              <div className="rec">
                {Object.entries(about.rec).map(([group, rows]) => (
                  <div key={group}>
                    <h3>{group}</h3>
                    <ul className="sheet__jobs">
                      {rows.map(([title, note, when]) => (
                        <li key={title}><span><b>{title}</b>{note ? <span className="muted"> {note}</span> : null}</span><time>{when}</time></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
