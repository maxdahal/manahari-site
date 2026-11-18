"use client";

import { useEffect } from "react";

/* One owner for in-page jumps. CSS smooth scrolling fought the router's own
   hash handling and stopped mid-way, so links scroll here instead: offset by
   the real header height, instant under reduced motion, focus moved to the
   target for keyboard and screen-reader users. */
export function headerOffset() {
  const head = document.querySelector(".site-head");
  let h = head?.getBoundingClientRect().height ?? 64;
  // under 960px the process bar sticks below the header, so jumps clear it too
  const toc = document.querySelector(".toc");
  if (toc && getComputedStyle(toc).position === "sticky" && getComputedStyle(toc).display !== "none" && window.innerWidth <= 960) {
    h += toc.getBoundingClientRect().height;
  }
  return h + 24;
}

function jumpTo(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, y), behavior: smooth && !reduce ? "smooth" : "auto" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}

export function HashScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (!url.hash || url.pathname !== location.pathname || url.search !== location.search) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;
      e.preventDefault();
      e.stopPropagation();
      history.pushState(null, "", url.hash);
      // the phone menu closes first, so the jump measures the closed header
      dispatchEvent(new Event("site:jump"));
      jumpTo(id, true);
    }
    document.addEventListener("click", onClick, true);

    // the sticky process bar sits right under the header, whatever its height
    const setHead = () => {
      const head = document.querySelector(".site-head");
      if (head) document.documentElement.style.setProperty("--head-h", `${Math.round(head.getBoundingClientRect().height)}px`);
    };
    setHead();
    window.addEventListener("resize", setHead);

    // arriving with a hash (e.g. /#work from another page): land below the header
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => jumpTo(id, false));
    }
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("resize", setHead); };
  }, []);
  return null;
}
