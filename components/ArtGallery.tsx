"use client";

import { useRef, useState } from "react";

type Art = { src: string; alt: string; w: number; h: number; thumb?: string };

/* Masonry (or a strip) of artwork; any piece opens larger in a dialog. */
export function ArtGallery({ items, layout = "grid" }: { items: Art[]; layout?: "grid" | "strip" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const show = (i: number) => setIndex((i + items.length) % items.length);
  const current = items[index];

  return (
    <>
      <ul className={layout === "grid" ? "art-grid" : "art-strip"}>
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
