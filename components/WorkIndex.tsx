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

/* Case studies: a grid read as a route. The first study (Luna) is the lead
   and takes the wide cell of the top row; the next sits beside it, and the
   last three share the second row. A line runs through the cards' centres
   in order; the cards hide it, so it shows only in the gaps, turning in the
   gap between rows. It fills in with Lake as the section scrolls past.
   Each card is one link: a darkened cover with its step number, title and
   years set on it. Under 860px it is one column and the line runs down. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<{ d: string; w: number; h: number } | null>(null);

  // draw the route from the cards' positions; redraw when the grid resizes
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const draw = () => {
      const o = ol.getBoundingClientRect();
      const boxes = ([...ol.children] as HTMLElement[]).map((li) => {
        const r = li.querySelector(".wg__link")!.getBoundingClientRect();
        return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2, top: r.top - o.top, bottom: r.bottom - o.top };
      });
      if (boxes.length < 2) return;
      const pts: [number, number][] = [[boxes[0].x, boxes[0].y]];
      for (let i = 1; i < boxes.length; i++) {
        const a = boxes[i - 1], b = boxes[i];
        if (Math.abs(a.y - b.y) > 2 && Math.abs(a.x - b.x) > 2) {
          const mid = (a.bottom + b.top) / 2; // the middle of the gap between rows
          pts.push([a.x, mid], [b.x, mid]);
        }
        pts.push([b.x, b.y]);
      }
      setRoute({ d: rounded(pts, 28), w: o.width, h: o.height });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(ol);
    return () => ro.disconnect();
  }, []);

  // fill the route as the section passes the reading line (60% down the screen)
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
