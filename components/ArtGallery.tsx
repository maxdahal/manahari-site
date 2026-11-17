"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { DollyStage } from "./DollyStage";

type Art = { src: string; alt: string; w: number; h: number; thumb?: string };

/* Masonry (or a strip) of artwork; any piece opens larger in a dialog.
   "dolly" flies the camera through the pieces as the page scrolls (see
   DollyStage), with its own heading; it falls back to the masonry grid with
   reduced motion and on the server render. */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => { const m = matchMedia(REDUCE); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

export function ArtGallery({ items, layout = "grid", title, sub }: { items: Art[]; layout?: "grid" | "strip" | "dolly"; title?: string; sub?: string }) {
  const motionOk = useSyncExternalStore(subscribeMotion, () => !matchMedia(REDUCE).matches, () => false);
  const dolly = layout === "dolly" && motionOk;
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const show = (i: number) => setIndex((i + items.length) % items.length);
  const current = items[index];

  return (
    <>
      {dolly ? (
        <DollyStage items={items} title={title ?? ""} sub={sub ?? ""} onOpen={(i) => { show(i); dialog.current?.showModal(); }} />
      ) : (
      <div className={layout === "dolly" ? "wrap" : undefined}>
      {layout === "dolly" ? (
        <div className="section__head"><h2 className="h2" id="art-h">{title}</h2><p>{sub}</p></div>
      ) : null}
      <ul className={layout === "strip" ? "art-strip" : "art-grid"}>
        {items.map((a, i) => (
          <li key={a.src}>
            <button type="button" className="art-item" onClick={() => { show(i); dialog.current?.showModal(); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.thumb ?? a.src} alt={a.alt} width={a.w} height={a.h} loading="lazy" />
              <span className="sr-only">View larger</span>
            </button>
          </li>
        ))}
      </ul>
      </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Artwork viewer"
        onClick={(e) => { const t = e.target as HTMLElement; if (t === dialog.current || t.classList.contains("lightbox__stage")) dialog.current?.close(); }}
        onKeyDown={(e) => { if (e.key === "ArrowRight") show(index + 1); if (e.key === "ArrowLeft") show(index - 1); }}
      >
        <button type="button" className="lightbox__close" onClick={() => dialog.current?.close()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          <span className="sr-only">Close</span>
        </button>
        <div className="lightbox__stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={current.src} src={current.src} alt={current.alt} width={current.w} height={current.h} />
        </div>
        <div className="lightbox__bar">
          <button type="button" onClick={() => show(index - 1)}>Previous</button>
          <span aria-live="polite" className="num">{index + 1} / {items.length}</span>
          <button type="button" onClick={() => show(index + 1)}>Next</button>
        </div>
      </dialog>
    </>
  );
}
