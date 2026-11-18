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

/* A polyline with rounded corners (radius r, shrunk to fit short legs). */
function rounded(pts: [number, number][], r: number) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const a = Math.min(r, Math.hypot(x - px, y - py) / 2), b = Math.min(r, Math.hypot(nx - x, ny - y) / 2);
    const ux = Math.sign(x - px), uy = Math.sign(y - py), vx = Math.sign(nx - x), vy = Math.sign(ny - y);
    d += ` L${x - ux * a},${y - uy * a} Q${x},${y} ${x + vx * b},${y + vy * b}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx},${ly}`;
}

/* Case studies: a staircase. Each study takes a row of its own, each set
   further right than the one above, Luna first and a little wider.
   A thin stair line leads the eye: out of each card's right side, along
   to the next card, then down into it. It runs behind the cards, so only
   the stair shows, and fills with Lake as the section scrolls past.
   Each card is one link: a darkened cover with its step number, title and
   years set on it. Under 860px the cards stack and the line drops down
   the right side between them. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<{ d: string; w: number; h: number } | null>(null);

  // draw the stair from the cards' positions; redraw when anything resizes
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const draw = () => {
      const o = ol.getBoundingClientRect();
      const cards = ([...ol.children] as HTMLElement[]).map((li) => li.querySelector(".wg__link")!.getBoundingClientRect());
      if (cards.length < 2) return;
      const mid = (r: DOMRect) => r.top - o.top + r.height / 2;
      const pts: [number, number][] = [[cards[0].left - o.left + cards[0].width / 2, mid(cards[0])]];
      for (let i = 1; i < cards.length; i++) {
        const a = cards[i - 1], b = cards[i];
        // drop into the next card three quarters along, clear of the one above
        const x = Math.max(a.right - o.left + 28, b.left - o.left + b.width * 0.75);
        pts.push([Math.min(x, b.right - o.left - 24), mid(a)], [Math.min(x, b.right - o.left - 24), mid(b)]);
      }
      setRoute({ d: rounded(pts, 22), w: o.width, h: o.height });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(ol);
    for (const li of ol.children) ro.observe(li);
    addEventListener("load", draw);
    return () => { ro.disconnect(); removeEventListener("load", draw); };
  }, []);

  // fill the stair as the section passes the reading line (60% down the screen)
  useEffect(() => {
    const p = fill.current, ol = list.current;
    if (!p || !ol || !route) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { p.style.strokeDashoffset = "0"; return; }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / Math.max(1, r.height)));
      p.style.strokeDashoffset = `${len * (1 - t)}`;
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
          <svg className="wg-route__line" viewBox={`0 0 ${route.w} ${route.h}`} width={route.w} height={route.h} aria-hidden="true">
            <path className="wg-route__track" d={route.d} />
            <path className="wg-route__fill" ref={fill} d={route.d} />
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
