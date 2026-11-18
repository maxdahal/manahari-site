"use client";

import { Fragment, useEffect, useRef } from "react";
import type React from "react";
import { gsap } from "gsap";

/* The home hero, kept simple: the availability line, a two-tone headline,
   and two actions on the navy stage. Behind them on the right,
   cards of artwork and work pictures drift slowly toward the viewer out of a
   vanishing point, fade in from the distance and out as they pass. Pure CSS
   3D; it pauses when the hero is off screen and holds still under reduced
   motion. */

export type HeroPic = { src: string; w: number; h: number };

/* where each card sits around the vanishing point (px), and its width */
const SPOTS: [number, number, number][] = [
  [-230, -150, 150], [210, -190, 170], [300, 90, 140], [-150, 170, 160],
  [70, 240, 130], [-320, 20, 140], [250, -40, 150], [-30, -250, 140],
  [340, 230, 150], [-260, -60, 130], [120, 110, 150], [-200, 290, 140],
];
const LOOP = 30; // seconds for one card to travel the whole way

export function HeroStage({ status, resume, pics }: { status: string; resume: string; pics: HeroPic[] }) {
  const root = useRef<HTMLElement>(null);

  // one entrance: the headline rises word by word, then the rest blurs in
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: 0.1, defaults: { ease: "expo.out" } })
        .fromTo(el.querySelectorAll(".hero__title .w > span"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.045 }, 0)
        .fromTo(el.querySelectorAll(".hstage__status, .hstage .actions"), { autoAlpha: 0, y: 16, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.08 }, 0.35);
    });
    // pause the drift while the hero is out of view
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    return () => { mm.revert(); io.disconnect(); };
  }, []);

  return (
    <section className="hstage" aria-labelledby="hero-title" ref={root}>
      <div className="hstage__field" aria-hidden="true">
        {pics.slice(0, SPOTS.length).map((p, i) => {
          const [x, y, w] = SPOTS[i];
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src} src={p.src} alt="" width={p.w} height={p.h} loading={i < 6 ? "eager" : "lazy"} decoding="async"
              className="hstage__card"
              style={{ "--x": `${x}px`, "--y": `${y}px`, width: w, aspectRatio: p.w > p.h * 1.25 ? "4 / 3" : p.h > p.w * 1.1 ? "4 / 5" : "1", animationDelay: `${-(i * LOOP) / SPOTS.length}s`, animationDuration: `${LOOP}s` } as React.CSSProperties}
            />
          );
        })}
      </div>
      <div className="hstage__intro">
        <p className="hstage__status"><i aria-hidden="true" />{status}</p>
        <h1 className="hero__title" id="hero-title">
          {[["Hi, I’m Manahari.", "hero__hi"], ["I’m a UX Engineer and Product Designer.", "hero__role"]].map(([line, cls]) => (
            <span className={cls} key={cls}>
              {line.split(" ").map((w, i) => (
                <Fragment key={i}><span className="w"><span>{w}</span></span>{" "}</Fragment>
              ))}
            </span>
          ))}
        </h1>
        <p className="hero__sub">I design and code software interfaces for complex, high-stakes environments. With a background in computer science, human-computer interaction and frontend development, I build clear, working web apps and design systems.</p>
        <div className="actions">
          <a className="hbtn" href="#work">
            See case studies
            <span className="hbtn__chip" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </span>
          </a>
          <a className="hlink" href={resume} target="_blank" rel="noopener">
            Resume
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
