/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, NepalDots } from "@/components/Shell";
import { Frame } from "@/components/Frame";
import { profile } from "@/content/profile";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description: about.intro[0],
};

export default function About() {
  return (
    <>
      <Header current="About" />
      <main id="main">
        <section className="wrap about-top" aria-labelledby="about-h">
          <div>
            <h1 className="about-title" id="about-h">About me</h1>
            {about.intro.map((t) => <p key={t} className="about-lede">{t}</p>)}
            <div className="actions" style={{ marginTop: 32 }}>
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>Get in touch</a>
              <a className="btn btn--line" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
            </div>
            <dl className="about-facts">
              {about.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
            </dl>
          </div>
          <div style={{ paddingTop: 36 }}>
            <Frame tag="Manahari Dahal">
              <figure className="portrait">
                <img src="/images/index-01-5d96ff329c.webp" alt="Portrait of Manahari Dahal" width={900} height={900} />
              </figure>
            </Frame>
          </div>
        </section>

        <div className="wrap">
          <div className="readouts about-stats">
            {about.stats.map((s) => <p key={s.label} className="readout"><b>{s.value}</b><span>{s.label}</span></p>)}
          </div>
        </div>

        <section className="wrap section" aria-labelledby="journey-h">
          <div className="section__head"><h2 className="h2" id="journey-h">{about.journeyTitle}</h2><p>{about.journeySub}</p></div>
          <ol className="journey">
            {about.places.map((j) => (
              <li key={j.place}>
                <div><h3>{j.place}{j.place === "Nepal" ? <NepalDots /> : null}</h3><time>{j.when}</time></div>
                <div>
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
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap section" aria-labelledby="skills-h">
          <div className="section__head"><h2 className="h2" id="skills-h">{about.skillsTitle}</h2></div>
          <div className="skills">
            {Object.entries(about.skills).map(([group, list]) => (
              <div key={group}>
                <h3>{group}</h3>
                <ul>{list.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" aria-labelledby="rec-h">
          <div className="section__head"><h2 className="h2" id="rec-h">{about.recTitle}</h2></div>
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
        </section>
      </main>
      <Footer />
    </>
  );
}
