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

/* A smooth curve through the points (Catmull-Rom, drawn as cubic Béziers). */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* Case studies: the lead study (Luna) runs the full width; the other four
   follow as steps, one per row, each set further right than the one above.
   A ghost kite flies down the steps as the section scrolls past: it keeps to
   the open space beside each step card, on an unseen curve, leaning the way
   it travels, its tail swaying; it passes behind the cards when it changes
   sides. Decoration only, hidden from assistive tech;
   hidden under 860px, where the cards take the full width.
   Each card is one link: a darkened cover with its step number, title and
   years set on it. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const list = useRef<HTMLOListElement>(null);
  const line = useRef<SVGPathElement>(null);
  const kite = useRef<SVGGElement>(null);
  const [route, setRoute] = useState<{ d: string; w: number; h: number } | null>(null);

  // plot the flight from the cards' positions; replot when anything resizes
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const plot = () => {
      const o = ol.getBoundingClientRect();
      const cards = ([...ol.children] as HTMLElement[]).map((li) => li.querySelector(".wg__link")!.getBoundingClientRect());
      if (cards.length < 3) return;
      const lead = cards[0];
      // beside each step card: the middle of its wider open side
      const pts: [number, number][] = cards.slice(1).map((r) => {
        const left = r.left - o.left, right = o.right - r.right;
        const x = right >= left ? r.right - o.left + right / 2 : left / 2;
        return [x, r.top - o.top + r.height / 2];
      });
      // take off from the gap under the lead, above the first open side
      const way: [number, number][] = [[pts[0][0], lead.bottom - o.top + 8]];
      pts.forEach((pt, i) => {
        const prev = pts[i - 1];
        // changing sides: cross in the gap between the two rows, behind the cards
        if (prev && Math.abs(prev[0] - pt[0]) > o.width / 3) {
          const a = cards[i], b = cards[i + 1];
          way.push([(prev[0] + pt[0]) / 2, (a.bottom + b.top) / 2 - o.top]);
        }
        way.push(pt);
      });
      setRoute({ d: smooth(way), w: o.width, h: o.height });
    };
    plot();
    const ro = new ResizeObserver(plot);
    ro.observe(ol);
    for (const li of ol.children) ro.observe(li);
    addEventListener("load", plot);
    return () => { ro.disconnect(); removeEventListener("load", plot); };
  }, []);

  // fly the kite along the curve with the scroll
  useEffect(() => {
    const p = line.current, k = kite.current, ol = list.current;
    if (!p || !k || !ol || !route) return;
    const len = p.getTotalLength();
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top - r.height * 0.15) / Math.max(1, r.height * 0.8)));
      const at = p.getPointAtLength(t * len), ahead = p.getPointAtLength(Math.min(len, t * len + 24));
      const dx = ahead.x - at.x, dy = ahead.y - at.y, run = Math.hypot(dx, dy) || 1;
      const lean = Math.max(-28, Math.min(28, (dx / run) * 32));
      k.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${lean})`);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [route]);

  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="wg__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>
      <div className="wg-route">
        {route ? (
          <svg className="wg-route__sky" viewBox={`0 0 ${route.w} ${route.h}`} width={route.w} height={route.h} aria-hidden="true">
            <path ref={line} d={route.d} fill="none" stroke="none" />
            <g ref={kite}>
              <g className="wg-kite">
                {/* tail: a hanging string with three bows */}
                <path className="wg-kite__tail" d="M0,34 C-8,48 8,60 0,74 C-8,88 6,98 -2,110" />
                <path className="wg-kite__bow" d="M-6,50 L6,56 M6,50 L-6,56 M-7,78 L5,84 M5,78 L-7,84 M-8,100 L4,106 M4,100 L-8,106" />
                {/* the kite: a diamond with its two spars */}
                <path className="wg-kite__sail" d="M0,-34 L24,-4 L0,34 L-24,-4 Z" />
                <path className="wg-kite__spar" d="M0,-34 L0,34 M-24,-4 L24,-4" />
              </g>
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
