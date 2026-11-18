"use client";

import Link from "next/link";
import { useState } from "react";

export type IndexCase = {
  slug: string;
  title: string;
  meta: string;
  outcome: { value: string; label: string };
  pic: { src: string; w: number; h: number };
  top?: boolean;
};

/* Case studies: a header row (heading and subline, then the counter, steps
   and arrows) over a full-width accordion of tall image panels. One is open: its cover,
   title, role line and outcome. The rest are numbered strips; pointing at or
   focusing one opens it, and clicking opens the study. A counter, arrows and a
   stepped bar say where you are among the four. On narrow screens the panels
   stack. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const [open, setOpen] = useState(0);
  const go = (i: number) => setOpen((i + items.length) % items.length);
  const n = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="ws__head">
        <div>
          <h2 className="h2" id="work-h">Case studies</h2>
          <p className="ws__sub">A surgical console, a campus navigation app, a website, a phone app and a documentation site.</p>
        </div>
        <div className="ws__ctl">
        <div className="ws__nav">
          <p className="ws__count" aria-live="polite">
            <b>{n(open)}</b> / {n(items.length - 1)}
            <span className="sr-only">: {items[open].title}</span>
          </p>
          <div className="ws__arrows">
            <button type="button" onClick={() => go(open - 1)} aria-label="Previous case study">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button type="button" onClick={() => go(open + 1)} aria-label="Next case study">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
        <ol className="ws__steps" aria-hidden="true">
          {items.map((c, i) => (
            <li key={c.slug} className={i === open ? "is-on" : i < open ? "is-past" : undefined} />
          ))}
        </ol>
        </div>
      </header>

      <ol className="ws__panels">
        {items.map((c, i) => (
          <li key={c.slug} className={`ws__panel${i === open ? " is-open" : ""}`}>
            <Link
              prefetch={false}
              href={`/work/${c.slug}`}
              className="ws__card"
              onPointerEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} className={c.top ? "is-top" : undefined} />
              <span className="ws__num" aria-hidden="true">{n(i)}</span>
              <span className="ws__strip" aria-hidden="true">{c.title}</span>
              <span className="ws__body">
                <span className="ws__title">{c.title}</span>
                <span className="ws__role">{c.meta}</span>
                <span className="ws__outcome"><b>{c.outcome.value}</b> {c.outcome.label}</span>
                <span className="ws__go" aria-hidden="true">
                  View project
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
