"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

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

/* Case studies: a list on the left (number, title, role line) and the chosen
   study on the right (cover, title, description, outcome, a button into it).
   Every title is readable at once, and choosing one never moves the page.
   Up/Down arrows move through the list. Under 860px the list goes away and
   every study is its own card, so nothing hides behind a tap. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const [open, setOpen] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  /* one ink blob slides to the chosen case: its leading edge moves first and
     the trailing edge catches up, so it stretches like a drop, then settles */
  const [blob, setBlob] = useState<{ top: number; bottom: number; dir: "up" | "down" } | null>(null);
  const prev = useRef(open);
  useLayoutEffect(() => {
    const place = () => {
      const li = btns.current[open]?.parentElement;
      const list = li?.parentElement;
      if (!li || !list) return;
      const top = li.offsetTop, bottom = list.clientHeight - (li.offsetTop + li.offsetHeight);
      setBlob({ top, bottom, dir: open >= prev.current ? "down" : "up" });
      prev.current = open;
    };
    place();
    addEventListener("resize", place);
    return () => removeEventListener("resize", place);
  }, [open]);
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
      </header>

      <div className="wk">
        <ol className="wk__list" aria-label="Choose a case study" onKeyDown={onKey}>
          {blob ? <span className={`wk__blob wk__blob--${blob.dir}`} style={{ top: blob.top, bottom: blob.bottom }} aria-hidden="true" /> : null}
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
              <Link prefetch={false} href={`/work/${c.slug}`} className={`wk__pic${c.contain ? " is-contain" : ""}`} tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} className={c.top ? "is-top" : undefined} />
              </Link>
              <div className="wk__body">
                <h3 className="wk__title" id={`wk-${c.slug}-h`}>{c.title}</h3>
                <Link prefetch={false} href={`/work/${c.slug}`} className="btn btn--primary wk__go">
                  View case study<span className="sr-only">: {c.title}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
