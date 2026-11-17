"use client";

import { useEffect, useRef } from "react";

/* Homepage only: the availability line set vertically in the right-hand
   gutter, in the case-study nav's language (a hairline that fills as you
   read, with a dot). It appears once the hero, which already says it, has
   scrolled away, and steps aside at the footer, which says it again. It opens
   the For recruiters dialog through #recruiter. Wide screens only: narrower
   gutters have no room for it. */
export function AvailabilityRail({ status }: { status: string }) {
  const el = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const rail = el.current;
    const hero = document.querySelector(".hstage");
    const foot = document.querySelector(".site-foot");
    if (!rail) return;
    let heroOut = !hero, footIn = false;
    const sync = () => rail.toggleAttribute("data-on", heroOut && !footIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === foot) footIn = e.isIntersecting;
      }
      sync();
    }, { threshold: 0, rootMargin: "-20% 0px 0px 0px" });
    if (hero) io.observe(hero);
    if (foot) io.observe(foot);

    let raf = 0;
    const progress = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        rail.style.setProperty("--p", String(max > 0 ? Math.min(1, scrollY / max) : 0));
      });
    };
    progress();
    addEventListener("scroll", progress, { passive: true });
    addEventListener("resize", progress);
    return () => { io.disconnect(); removeEventListener("scroll", progress); removeEventListener("resize", progress); cancelAnimationFrame(raf); };
  }, []);

  return (
    <a ref={el} className="avail" href="#recruiter" aria-haspopup="dialog">
      <span className="avail__line" aria-hidden="true" />
      <i className="avail__dot" aria-hidden="true" />
      <span className="avail__text">{status}</span>
    </a>
  );
}
