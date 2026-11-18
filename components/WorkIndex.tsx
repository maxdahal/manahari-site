"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type IndexCase = {
  slug: string;
  title: string;
  meta: string;
  desc: string;
  outcome: { value: string; label: string };
  pic: { src: string; w: number; h: number };
  top?: boolean;
};

/* Case studies: a list on the left (number, title, role line) and the chosen
   study on the right (cover, title, description, outcome, a button into it).
   Every title is readable at once, and choosing one never moves the page.
   Up/Down arrows move through the list. Under 860px the list goes away and
   every study is its own card, so nothing hides behind a tap. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const [open, setOpen] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const n = (i: number) => `${i + 1}.`;

  function onKey(e: React.KeyboardEvent) {
    const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = (open + d + items.length) % items.length;
    setOpen(i);
    btns.current[i]?.focus();
  }

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="ws__head">
        <h2 className="h2" id="work-h">Case studies</h2>
        <p className="ws__sub">A surgical console, a campus navigation app, a website, a phone app and a documentation site.</p>
      </header>

      <div className="wk">
        <ol className="wk__list" aria-label="Choose a case study" onKeyDown={onKey}>
          {items.map((c, i) => (
            <li key={c.slug}>
              <button
                ref={(el) => { btns.current[i] = el; }}
                type="button"
                className="wk__pick"
                aria-pressed={i === open}
                aria-controls={`wk-${c.slug}`}
                onClick={() => setOpen(i)}
              >
                <span className="wk__n" aria-hidden="true">{n(i)}</span>
                <span className="wk__t">{c.title}</span>
                <svg className="wk__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </li>
          ))}
        </ol>

        <div className="wk__panels">
          {items.map((c, i) => (
            <article key={c.slug} id={`wk-${c.slug}`} className={`wk__panel${i === open ? " is-on" : ""}`} aria-labelledby={`wk-${c.slug}-h`}>
              <Link prefetch={false} href={`/work/${c.slug}`} className="wk__pic" tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} className={c.top ? "is-top" : undefined} />
              </Link>
              <div className="wk__body">
                <div className="wk__text">
                  <p className="wk__meta">{c.meta}</p>
                  <h3 className="wk__title" id={`wk-${c.slug}-h`}>{c.title}</h3>
                  <p className="wk__desc">{c.desc}</p>
                  <p className="wk__outcome"><b>{c.outcome.value}</b> {c.outcome.label}</p>
                </div>
                <Link prefetch={false} href={`/work/${c.slug}`} className="btn btn--primary wk__go">
                  View case study<span className="sr-only">: {c.title}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
