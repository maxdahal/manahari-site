"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type IndexCase = {
  slug: string;
  title: string;
  years: string;
  pic: { src: string; w: number; h: number };
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

/* Case studies: an intentional scatter. Each study keeps a row of its own,
   in order, but the cards differ in width, shape and side: they alternate
   left and right and each tucks up beside the one above, so the eye zigzags
   down from 1 to 5 without a strict staircase. Luna, first, is the widest.
   One focal point: the study nearest the middle of the screen is clear;
   the others fade, lose colour and soften at the edges into the page, more
   the further they are, like a vignette around the one in view. Each card
   gets --f (1 in focus, 0 far off) from the scroll; hover or keyboard focus
   brings a card fully forward. Without JS every card stays clear.
   A thread leads the eye from each study to the next: a soft S-curve from
   one card's inner side across the open space to the next card's side,
   with a small dot at each end. One Lake marker travels along the threads
   with the scroll, and the thread it is on turns Lake; the rest stay faint.
   The threads sit behind the cards and are hidden under 860px.
   Each card is one link: a darkened cover with its step number, title and
   years set on it. Under 860px the cards stack in one column. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const list = useRef<HTMLOListElement>(null);
  const marker = useRef<SVGGElement>(null);
  const threads = useRef<(SVGPathElement | null)[]>([]);
  type Thread = { d: string; a: [number, number]; b: [number, number] };
  const [map, setMap] = useState<{ w: number; h: number; threads: Thread[] } | null>(null);

  // lay the threads from the cards' positions; again when anything resizes
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const lay = () => {
      const o = ol.getBoundingClientRect();
      const cards = ([...ol.children] as HTMLElement[]).map((li) => li.querySelector(".wg__link")!.getBoundingClientRect());
      const out: Thread[] = [];
      for (let i = 0; i < cards.length - 1; i++) {
        const p = cards[i], q = cards[i + 1];
        const right = p.left + p.width / 2 < q.left + q.width / 2; // the next card sits to the right
        const a: [number, number] = [(right ? p.right + 10 : p.left - 10) - o.left, p.top - o.top + p.height * 0.68];
        const b: [number, number] = [(right ? q.left - 10 : q.right + 10) - o.left, q.top - o.top + q.height * 0.32];
        const k = Math.max(40, Math.abs(b[0] - a[0]) * 0.65) * (right ? 1 : -1);
        out.push({ d: `M${a[0]},${a[1]} C${a[0] + k},${a[1]} ${b[0] - k},${b[1]} ${b[0]},${b[1]}`, a, b });
      }
      setMap({ w: o.width, h: o.height, threads: out });
    };
    lay();
    const ro = new ResizeObserver(lay);
    ro.observe(ol);
    for (const li of ol.children) ro.observe(li);
    addEventListener("load", lay);
    return () => { ro.disconnect(); removeEventListener("load", lay); };
  }, []);

  // move the marker along the threads as the section passes the middle of the screen
  useEffect(() => {
    const ol = list.current, m = marker.current;
    const ps = threads.current.filter(Boolean) as SVGPathElement[];
    if (!ol || !m || !map || !ps.length) return;
    const lens = ps.map((p) => p.getTotalLength());
    const total = lens.reduce((x, y) => x + y, 0);
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top - r.height * 0.1) / Math.max(1, r.height * 0.8)));
      let at = t * total, i = 0;
      while (i < ps.length - 1 && at > lens[i]) { at -= lens[i]; i++; }
      const pt = ps[i].getPointAtLength(Math.min(at, lens[i]));
      m.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      ps.forEach((p, j) => p.classList.toggle("is-on", j === i));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [map]);

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const cards = [...ol.children] as HTMLElement[];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = innerHeight / 2, reach = innerHeight * 0.55;
      for (const li of cards) {
        const r = li.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid) / reach;
        const x = Math.min(1, Math.max(0, 1 - d));
        li.style.setProperty("--f", (x * x * (3 - 2 * x)).toFixed(3));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="wg__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>
      <div className="wg-route">
        {map ? (
          <svg className="wg-thread" viewBox={`0 0 ${map.w} ${map.h}`} width={map.w} height={map.h} aria-hidden="true">
            {map.threads.map((th, i) => (
              <g key={i}>
                <path className="wg-thread__line" ref={(el) => { threads.current[i] = el; }} d={th.d} />
                <circle className="wg-thread__end" cx={th.a[0]} cy={th.a[1]} r="3" />
                <circle className="wg-thread__end" cx={th.b[0]} cy={th.b[1]} r="3" />
              </g>
            ))}
            <g ref={marker}>
              <circle className="wg-thread__halo" r="12" />
              <circle className="wg-thread__dot" r="5" />
            </g>
          </svg>
        ) : null}
        <ol className="wg" ref={list}>
          {items.map((c, i) => (
            <li key={c.slug} className={`wg__card${i === 0 ? " is-lead" : ""}`}>
              <Link prefetch={false} href={`/work/${c.slug}`} className="wg__link">
                <span className={`wg__pic${c.contain ? " is-contain" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} />
                </span>
                <span className="wg__step" aria-hidden="true">{i + 1}</span>
                <span className="wg__row">
                  <span className="wg__title">{c.title}</span>
                  <span className="wg__years">{c.years}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
