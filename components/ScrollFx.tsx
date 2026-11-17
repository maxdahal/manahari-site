"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Scroll reveals for the whole site, in one place. Content is visible by
   default; only when motion is allowed do blocks rise in as they enter, once.
   The timeline's bars grow from their start date, and the process map's
   steps follow in order. Re-runs on every route. */
const REVEAL = [
  ".section__head",
  ".art-strip",
  ".case-answer",
  ".readouts",
  ".pmap",
  ".case-section > .stage-mark",
  ".case-section > .h2",
  ".case-section > .lead",
  ".case-section > .figure",
  ".case-section > .split",
  ".case-section > .gallery",
  ".case-section > .more",
  ".case-section > .stages",
  ".case-section > .decisions",
  ".case-section > .pairs",
  ".case-section > .versions",
  ".case-section > .checks",
  ".case-section > .kusb",
  ".takeaways",
  ".next-case",
].join(",");

export function ScrollFx() {
  const path = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const els = gsap.utils.toArray<HTMLElement>(REVEAL).filter((e) => !e.closest(".rail, .hstage, .ws"));
      if (els.length) {
        gsap.set(els, { opacity: 0, y: 36 });
        ScrollTrigger.batch(els, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
      }

      const gt = document.querySelector<HTMLElement>(".gt");
      if (gt) {
        gsap.fromTo(gt.querySelectorAll(".gt__bar"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: gt, start: "top 75%", once: true } });
        gsap.fromTo(gt.querySelector(".gt__nowline"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 1.2, ease: "expo.out", delay: 0.3, scrollTrigger: { trigger: gt, start: "top 75%", once: true } });
      }

      // anything revealed later changes layout below it; keep triggers honest
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => mm.revert();
  }, [path]);

  return null;
}
