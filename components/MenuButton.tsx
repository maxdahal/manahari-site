"use client";

import { useEffect, useRef, useState } from "react";

/* Phones only: opens the site links under the header bar. Closes on a
   link, on Escape, or when the screen grows past the phone layout. */
export function MenuButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // the bar turns frosted once the page leaves the top
  useEffect(() => {
    const head = btn.current?.closest(".site-head");
    if (!head) return;
    const on = () => head.toggleAttribute("data-scrolled", scrollY > 8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const head = btn.current?.closest(".site-head");
    if (!head) return;
    head.toggleAttribute("data-open", open);
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { close(); btn.current?.focus(); } };
    const links = head.querySelectorAll(".nav a");
    links.forEach((a) => a.addEventListener("click", close));
    const mq = matchMedia("(min-width: 641px)");
    mq.addEventListener("change", close);
    document.addEventListener("keydown", onKey);
    return () => {
      links.forEach((a) => a.removeEventListener("click", close));
      mq.removeEventListener("change", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <button ref={btn} type="button" className="menu-btn" aria-expanded={open} aria-controls="site-nav" aria-label={open ? "Close" : "Open menu"} onClick={() => setOpen(!open)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
      </svg>
    </button>
  );
}
