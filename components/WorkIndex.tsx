"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type IndexCase = {
  slug: string;
  title: string;
  meta: string;
  desc: string;
  outcome: { value: string; label: string };
  pic: { src: string; w: number; h: number };
  top?: boolean;
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

/* Case studies: one row of large covers that scrolls sideways, the next one
   peeking in from the right. Swipe, scroll, or use the arrows; the segments
   underneath show where you are and jump to a study. Each cover and title is
   a link into the study. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const track = useRef<HTMLOListElement>(null);
  const [at, setAt] = useState(0);

  // the slide nearest the track's left edge is the current one
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const read = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slides = [...t.children] as HTMLElement[];
        const end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
        let best = 0;
        slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - t.offsetLeft - t.scrollLeft) < Math.abs(slides[best].offsetLeft - t.offsetLeft - t.scrollLeft)) best = i; });
        setAt(end ? slides.length - 1 : best);
      });
    };
    t.addEventListener("scroll", read, { passive: true });
    return () => { t.removeEventListener("scroll", read); cancelAnimationFrame(raf); };
  }, []);

  function go(i: number) {
    const t = track.current;
    const s = t?.children[i] as HTMLElement | undefined;
    if (!t || !s) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ left: s.offsetLeft - t.offsetLeft, behavior: still ? "auto" : "smooth" });
    setAt(i);
  }

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="ws__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>

      <div className="wc">
        <ol className="wc__track" ref={track} aria-label="Case studies, scrolls sideways">
          {items.map((c, i) => (
            <li key={c.slug} className="wc__slide" aria-current={i === at ? "true" : undefined}>
              <Link prefetch={false} href={`/work/${c.slug}`} className="wc__link">
                <span className={`wc__pic${c.contain ? " is-contain" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} className={c.top ? "is-top" : undefined} />
                </span>
                <span className="wc__title">{c.title}</span>
                <span className="wc__go">View case study</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="wc__bar">
          <div className="wc__segs">
            {items.map((c, i) => (
              <button key={c.slug} type="button" className="wc__seg" aria-current={i === at ? "true" : undefined} onClick={() => go(i)}>
                <span className="sr-only">Show {c.title}</span>
              </button>
            ))}
          </div>
          <p className="wc__count" aria-live="polite"><b>{at + 1}</b> / {items.length}<span className="sr-only">: {items[at]?.title}</span></p>
          <div className="wc__arrows">
            <button type="button" className="wc__arrow" onClick={() => go(Math.max(0, at - 1))} disabled={at === 0}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
              <span className="sr-only">Previous case study</span>
            </button>
            <button type="button" className="wc__arrow" onClick={() => go(Math.min(items.length - 1, at + 1))} disabled={at === items.length - 1}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <span className="sr-only">Next case study</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
