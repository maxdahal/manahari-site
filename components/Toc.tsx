"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { headerOffset } from "./HashScroll";

type Part = { id: string; title: string };
type Act = { id: string; title: string; parts: Part[] };
type Item = { id: string; title: string; level: 0 | 1 };

/* The sticky rail. One track runs down the left of the study's acts and the
   parts of the act being read; it steps in and out with an S-bend wherever the
   level changes. The track is lit from the start down to the part being read,
   and the sections already read stay bright. Under 960px it becomes a bar of
   acts under the header. */
const X = [5, 21]; // track x per level
const BEND = 12; // vertical room an S-bend takes

export function Toc({ acts }: { acts: Act[] }) {
  const ids = acts.flatMap((a) => [a.id, ...a.parts.map((p) => p.id)]);
  const [active, setActive] = useState(ids[0]);
  const listRef = useRef<HTMLOListElement>(null);
  const [geo, setGeo] = useState<{ d: string; h: number; lit: number }>({ d: "", h: 0, lit: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = headerOffset() + 8;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
    // ids is derived from acts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acts]);

  const openAct = acts.find((a) => a.id === active || a.parts.some((p) => p.id === active))?.id;
  const items: Item[] = acts.flatMap((a) => [
    { id: a.id, title: a.title, level: 0 as const },
    ...(a.id === openAct && a.parts.length > 1 ? a.parts.map((p) => ({ id: p.id, title: p.title, level: 1 as const })) : []),
  ]);
  const order = ids.indexOf(active);
  const read = (id: string) => ids.indexOf(id) <= order;

  /* trace the track through the rendered links */
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const links = [...list.querySelectorAll<HTMLAnchorElement>("a[data-level]")];
    // the bar layout (narrow screens) has no track
    if (!links.length || getComputedStyle(list).display === "flex") return;
    const base = list.getBoundingClientRect().top;
    let d = "";
    let lit = 0;
    let prev: { x: number; bottom: number } | null = null;
    links.forEach((a) => {
      const r = a.getBoundingClientRect();
      const top = r.top - base + 6;
      const bottom = r.bottom - base - 6;
      const x = X[Number(a.dataset.level)];
      if (!prev) d += `M${x} ${top + 4}`;
      else if (prev.x !== x) {
        const y0 = Math.max(prev.bottom, top - BEND);
        d += ` L${prev.x} ${y0} C${prev.x} ${y0 + BEND / 2} ${x} ${top - BEND / 2} ${x} ${top}`;
      } else d += ` L${x} ${top}`;
      d += ` L${x} ${bottom}`;
      prev = { x, bottom };
      if (a.getAttribute("aria-current") === "true" || a.dataset.read === "true") lit = bottom;
    });
    setGeo({ d, h: list.offsetHeight, lit: Math.max(0, lit) });
  }, []);

  useLayoutEffect(() => { measure(); }, [measure, openAct, active]);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  // on the small-screen bar, keep the active act scrolled into view (horizontally only)
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`a[href="#${openAct}"]`);
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    const left = link.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft || left + link.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - 16), behavior: "auto" });
    }
  }, [openAct]);

  // on the desktop rail, keep the active item inside the rail's own scroll box
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".toc");
    const link = rail?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!rail || !link || rail.scrollHeight <= rail.clientHeight) return;
    const top = link.getBoundingClientRect().top - rail.getBoundingClientRect().top;
    if (top < 80 || top > rail.clientHeight - 48) rail.scrollTo({ top: rail.scrollTop + top - rail.clientHeight / 2 });
  }, [active]);

  return (
    <nav className="toc" aria-labelledby="toc-h">
      <p className="toc__head" id="toc-h">
        <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M3 5h14M3 10h10M3 15h12" />
        </svg>
        On this page
      </p>
      <div className="toc__body">
        <svg className="toc__track" width="28" height={geo.h} aria-hidden="true">
          <defs>
            <clipPath id="toc-lit"><rect className="toc__litrect" x="0" y="0" width="28" height={geo.lit} /></clipPath>
          </defs>
          <path className="toc__line" d={geo.d} />
          <path className="toc__line toc__line--lit" d={geo.d} clipPath="url(#toc-lit)" />
          {geo.d ? <circle className="toc__dot" cx={X[0]} cy={10} r="4.5" /> : null}
        </svg>
        <ol className="toc__acts" ref={listRef}>
          {items.map((it) => (
            <li key={it.id} className={it.level ? "toc__part" : undefined}>
              <a
                href={`#${it.id}`}
                data-level={it.level}
                data-read={read(it.id) ? "true" : undefined}
                data-open={!it.level && openAct === it.id ? "true" : undefined}
                aria-current={(it.level ? active === it.id : openAct === it.id && active === it.id) ? "true" : undefined}
              >
                {it.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
