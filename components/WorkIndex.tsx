"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type IndexCase = {
  slug: string;
  title: string;
  pic: { src: string; w: number; h: number };
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

const headH = () => (document.querySelector(".site-head") as HTMLElement | null)?.offsetHeight ?? 64;
/* where the pinned block rests: centred in the space under the header */
const restTop = (h: number) => { const head = headH(); return Math.round(head + Math.max(0, (innerHeight - head - h) / 2)); };

/* Case studies: one row of covers that scrolls sideways, the next one peeking
   in from the right. On wide screens the row is pinned in the middle of
   the screen while the page scrolls, and scrolling down moves it sideways, so nobody skips past it;
   once the last study is in view the page carries on. The arrows and the
   segments sit next to the heading and jump to a study. On phones it is a
   plain swipeable row. Each cover and title is a link into the study. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const track = useRef<HTMLOListElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [pin, setPin] = useState<{ dist: number; h: number; top: number } | null>(null);

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
        const pl = parseFloat(getComputedStyle(t).paddingLeft) || 0;
        const off = (s: HTMLElement) => Math.abs(s.offsetLeft - t.offsetLeft - pl - t.scrollLeft);
        let best = 0;
        slides.forEach((s, i) => { if (off(s) < off(slides[best])) best = i; });
        setAt(end ? slides.length - 1 : best);
      });
    };
    t.addEventListener("scroll", read, { passive: true });
    return () => { t.removeEventListener("scroll", read); cancelAnimationFrame(raf); };
  }, []);

  // wide screens: pin the block; the page's scroll through it drives the row
  useEffect(() => {
    const t = track.current, o = outer.current, k = stick.current;
    if (!t || !o || !k) return;
    const wide = matchMedia("(min-width: 861px)");
    let raf = 0;
    const measure = () => {
      // room after the last cover, so every study can come to rest at the left edge
      const first = t.children[0] as HTMLElement | undefined;
      const pl = parseFloat(getComputedStyle(t).paddingLeft) || 0;
      if (first) t.style.paddingRight = `${Math.max(0, t.clientWidth - pl - first.offsetWidth)}px`;
      t.style.scrollPaddingInlineStart = `${pl}px`;
      if (!wide.matches) { setPin(null); return; }
      const dist = t.scrollWidth - t.clientWidth;
      setPin(dist > 0 ? { dist, h: k.offsetHeight, top: restTop(k.offsetHeight) } : null);
    };
    const drive = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!wide.matches) return;
        const dist = t.scrollWidth - t.clientWidth;
        const p = Math.min(1, Math.max(0, (restTop(k.offsetHeight) - o.getBoundingClientRect().top) / Math.max(1, dist)));
        t.scrollLeft = p * dist;
      });
    };
    measure(); drive();
    addEventListener("resize", measure);
    addEventListener("scroll", drive, { passive: true });
    wide.addEventListener("change", measure);
    return () => {
      removeEventListener("resize", measure);
      removeEventListener("scroll", drive);
      wide.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(i: number) {
    const t = track.current;
    const s = t?.children[i] as HTMLElement | undefined;
    if (!t || !s) return;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const pl = parseFloat(getComputedStyle(t).paddingLeft) || 0;
    const left = Math.min(s.offsetLeft - t.offsetLeft - pl, t.scrollWidth - t.clientWidth);
    if (pin && outer.current) {
      // pinned: move the page to the point where the row shows this study
      const top = outer.current.getBoundingClientRect().top + scrollY - pin.top;
      scrollTo({ top: top + left, behavior });
    } else {
      t.scrollTo({ left, behavior });
    }
    setAt(i);
  }

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <div className={`wc${pin ? " is-pinned" : ""}`} ref={outer} style={pin ? { height: pin.h + pin.dist } : undefined}>
        <div className="wc__stick" ref={stick} style={pin ? { top: pin.top } : undefined}>
          <header className="wc__head">
            <h2 className="h2" id="work-h">Case studies</h2>
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
          </header>

          <ol className="wc__track" ref={track} aria-label="Case studies, scrolls sideways">
            {items.map((c, i) => (
              <li key={c.slug} className="wc__slide" aria-current={i === at ? "true" : undefined}>
                <Link prefetch={false} href={`/work/${c.slug}`} className="wc__link">
                  <span className={`wc__pic${c.contain ? " is-contain" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} />
                  </span>
                  <span className="wc__title">{c.title}</span>
                  <span className="wc__go">View case study</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
