"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { about } from "@/content/about";

/* About, on the homepage: the portrait and the three numbers stay in view
   beside four tabs (v1's own section titles), so only one part of the story
   is on screen at a time. Each tab carries an icon and the open one is filled
   with the primary blue. Tabs follow the ARIA pattern: arrow keys, Home, End.
   - Journey: a route map. Five stops on one line; the line fills up to the
     chosen stop and its story shows in a card below. Nepal's stop wears the
     flag's two colours.
   - Research & recognition: research rows carry a coloured status badge;
     awards are cards with a medal, the fellowship featured in blue. */

const I = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONS = [
  I(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  I(<><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  I(<><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" /></>),
  I(<><circle cx="12" cy="9" r="6" /><path d="m8.5 14 -1.5 7 5-3 5 3-1.5-7" /></>),
];
const MEDAL = I(<><circle cx="12" cy="9" r="6" /><path d="m8.5 14 -1.5 7 5-3 5 3-1.5-7" /></>);

const TABS = ["About me", about.journeyTitle, about.skillsTitle, about.recTitle] as const;
const STATUS: Record<string, string> = { "In progress": "blue", Accepted: "green", Presented: "red" };

export function AboutSection() {
  const [tab, setTab] = useState(0);
  const [stop, setStop] = useState(about.places.length - 1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const place = about.places[stop];
  const [featured, ...awards] = about.rec["Awards & honors"];

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
                {ICONS[i]}
                <span>{t}</span>
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
              <ol className="route" style={{ "--fill": `${(stop / (about.places.length - 1)) * 100}%` } as React.CSSProperties}>
                {about.places.map((j, i) => (
                  <li key={j.place} className={i <= stop ? "is-past" : undefined}>
                    <button type="button" aria-pressed={i === stop} aria-controls="route-card" onClick={() => setStop(i)}>
                      <i className={`route__dot${j.place === "Nepal" ? " route__dot--np" : ""}`} aria-hidden="true" />
                      <span className="route__place">{j.place}</span>
                      <time>{j.when}</time>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="route__card" id="route-card" aria-live="polite" key={place.place}>
                <h3>{place.place} <time>{place.when}</time></h3>
                <p>{place.text}</p>
                {place.items.length ? (
                  <ul className="route__items">
                    {place.items.map((it) => (
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
              <h3 className="recog__h">Research</h3>
              <ul className="recog__research">
                {about.rec.Research.map(([title, note, status]) => (
                  <li key={title}>
                    <span><b>{title}</b>{note ? <span className="muted"> {note}</span> : null}</span>
                    <span className={`badge badge--${STATUS[status] ?? "blue"}`}>{status}</span>
                  </li>
                ))}
              </ul>

              <h3 className="recog__h">Awards &amp; honors</h3>
              <ul className="awards">
                <li className="award award--featured">
                  {MEDAL}
                  <b>{featured[0]}</b>
                  <time>{featured[2]}</time>
                </li>
                {awards.map(([title, note, when]) => (
                  <li key={title} className="award">
                    {MEDAL}
                    <b>{title}</b>
                    <time>{note ? `${note} · ${when}` : when}</time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
