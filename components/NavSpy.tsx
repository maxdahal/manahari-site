"use client";

import { useEffect } from "react";
import { headerOffset } from "./HashScroll";

/* Homepage only: the header links point at sections of this page (Work, About),
   so the one being read gets the same underline a current page does. A tapped
   link lights at once and holds while the page glides there. Pages without
   those sections (case studies mark Work as the current page) are left alone. */
export function NavSpy() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav a[href^='/#']")]
      .map((a) => ({ a, el: document.getElementById(decodeURIComponent(new URL(a.href).hash.slice(1))) }))
      .filter((l): l is { a: HTMLAnchorElement; el: HTMLElement } => !!l.el);
    if (!links.length || links.some((l) => l.a.getAttribute("aria-current") === "page")) return;

    let frame = 0;
    let target: string | null = null;
    let settle = 0;
    const mark = (id: string | null) => {
      for (const l of links) {
        if (l.el.id === id) l.a.setAttribute("aria-current", "location");
        else l.a.removeAttribute("aria-current");
      }
    };
    const update = () => {
      frame = 0;
      if (target) return;
      const line = headerOffset() + 8;
      // the section whose span covers the line under the header; none over the hero or past About
      const hit = links.find((l) => { const r = l.el.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
      mark(hit ? hit.el.id : null);
    };
    const release = () => { target = null; clearTimeout(settle); update(); };
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id || !links.some((l) => l.el.id === id)) return;
      target = id;
      mark(id);
      clearTimeout(settle);
      settle = window.setTimeout(release, 1500);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onSettle = () => { if (target) release(); };
    const onTakeOver = () => { if (target) release(); };

    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    addEventListener("site:jump", onJump);
    addEventListener("scrollend", onSettle);
    addEventListener("wheel", onTakeOver, { passive: true });
    addEventListener("touchstart", onTakeOver, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("site:jump", onJump);
      removeEventListener("scrollend", onSettle);
      removeEventListener("wheel", onTakeOver);
      removeEventListener("touchstart", onTakeOver);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      mark(null);
    };
  }, []);
  return null;
}
