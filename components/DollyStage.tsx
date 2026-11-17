"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

type Art = { src: string; alt: string; w: number; h: number; thumb?: string };

/* The artwork as a dolly shot: the pieces hang one behind another down a
   corridor, alternating left and right, and scrolling moves the camera
   forward through them. Each piece rises out of the dark in the distance,
   comes up to full size, then slides past the lens. The section is tall and
   its stage is pinned, so the page scroll is the camera.
   Tabbing to a piece scrolls the camera to it; any piece opens in the
   lightbox. Our own build of the idea (CSS 3D and the scroll position, no
   WebGL); the parent shows a plain grid with reduced motion. */

const DEPTH = 900; // px between pieces along the corridor
const STEP_VH = 70; // scroll distance per piece, in viewport heights

export function DollyStage({ items, title, sub, onOpen }: { items: Art[]; title: string; sub: string; onOpen: (i: number) => void }) {
  const section = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(false);
  const n = items.length;

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const frame = () => {
      const r = el.getBoundingClientRect();
      const travel = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(travel, 1)));
      const cam = p * (n - 1) * DEPTH; // how far the camera has moved down the corridor
      const wide = innerWidth > 760;
      const spread = innerWidth * (wide ? 0.2 : 0.14);
      cards.current.forEach((li, i) => {
        if (!li) return;
        const z = cam - i * DEPTH; // 0: at the focal plane; negative: still ahead
        const side = i % 2 ? 1 : -1;
        const x = side * spread * (wide ? 1 : 0.6);
        const y = (i % 3 - 1) * innerHeight * 0.05;
        // fade in from far away, hold, then fade as it passes the lens
        const inFade = Math.min(1, Math.max(0, (z + DEPTH * 3) / (DEPTH * 2)));
        const outFade = Math.min(1, Math.max(0, 1 - z / (DEPTH * 0.3)));
        const o = inFade * outFade;
        li.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;
        li.style.opacity = o.toFixed(3);
        li.style.visibility = o < 0.01 ? "hidden" : "visible";
        li.style.pointerEvents = o > 0.6 ? "auto" : "none"; // only the piece(s) in focus take clicks
        li.style.zIndex = String(1000 + Math.round(z));
      });
      setAt(Math.min(n - 1, Math.round(p * (n - 1))));
      setDone(p > 0.97);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
    frame();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [n]);

  // keyboard: focusing a piece moves the camera to it
  function focusPiece(i: number) {
    const el = section.current;
    if (!el) return;
    const travel = el.offsetHeight - innerHeight;
    const top = el.getBoundingClientRect().top + scrollY + (travel * i) / (n - 1);
    if (Math.abs(scrollY - top) > 4) scrollTo({ top, behavior: "instant" as ScrollBehavior });
  }

  return (
    <div ref={section} className="dolly" style={{ height: `calc(${(n - 1) * STEP_VH}vh + 100svh)` }}>
      <div className="dolly__stage">
        <div className="dolly__head wrap">
          <h2 className="h2" id="art-h">{title}</h2>
          <p>{sub}</p>
        </div>
        <ul className="dolly__space">
          {items.map((a, i) => (
            <li key={a.src} ref={(el) => { cards.current[i] = el; }} className="dolly__card" style={{ aspectRatio: `${a.w} / ${a.h}`, width: `min(var(--card-w), calc(var(--card-h) * ${(a.w / a.h).toFixed(3)}))` }}>
              <button type="button" className="art-item" onClick={() => onOpen(i)} onFocus={() => focusPiece(i)}>
                <img src={a.thumb ?? a.src} alt={a.alt} width={a.w} height={a.h} loading="lazy" decoding="async" />
                <span className="sr-only">View larger</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="dolly__foot wrap" aria-hidden="true">
          <p className={`dolly__hint${done ? " is-done" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            Keep scrolling to see all the artwork
          </p>
          <p className="dolly__count num"><b>{String(at + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}</p>
          <span className="dolly__bar"><i style={{ transform: `scaleX(${n > 1 ? at / (n - 1) : 1})` }} /></span>
        </div>
      </div>
    </div>
  );
}
