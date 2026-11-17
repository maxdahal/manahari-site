"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

/* Follows the system until the visitor picks; the pick is remembered.
   Switching pours the new theme out of the button: a View Transition whose
   new snapshot is clipped to a wobbling blob that spreads and settles into a
   full cover. Without View Transitions the colours cross-fade; with reduced
   motion the switch is instant. */

const POINTS = 140; // blob outline resolution (smooth even at full-screen size)
const FRAMES = 36; // baked keyframes (easing is baked in, so the animation runs linear)
const DURATION = 1400;

/* ease-in-out-cubic: a slow swell, a steady spread, a soft settle */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function blobFrames(cx: number, cy: number, w: number, h: number) {
  const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.25;
  const frames: Keyframe[] = [];
  for (let k = 0; k <= FRAMES; k++) {
    const t = k / FRAMES;
    const r = reach * ease(t);
    // wobble is strongest while small and fades to a clean edge as it covers
    const amp = r * 0.24 * Math.pow(1 - t, 1.2);
    const pts: string[] = [];
    for (let i = 0; i < POINTS; i++) {
      const a = (i / POINTS) * Math.PI * 2;
      const wob =
        Math.sin(3 * a + t * 9) * 0.5 +
        Math.sin(5 * a - t * 12 + 1.3) * 0.3 +
        Math.sin(9 * a + t * 17 + 2.1) * 0.2;
      const rr = Math.max(0, r + amp * wob);
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)}px ${(cy + Math.sin(a) * rr).toFixed(1)}px`);
    }
    frames.push({ clipPath: `polygon(${pts.join(",")})`, offset: t });
  }
  return frames;
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark") || (!root.classList.contains("light") && matchMedia("(prefers-color-scheme: dark)").matches));
  }, []);

  function apply(next: boolean) {
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    root.classList.toggle("light", !next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setDark(next);
  }

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = !dark;
    const root = document.documentElement;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return apply(next);

    if (!doc.startViewTransition) {
      root.classList.add("theme-fade");
      apply(next);
      window.setTimeout(() => root.classList.remove("theme-fade"), 700);
      return;
    }

    const b = e.currentTarget.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const vt = doc.startViewTransition(() => flushSync(() => apply(next)));
    vt.ready
      .then(() => {
        root.animate(blobFrames(cx, cy, innerWidth, innerHeight), {
          duration: DURATION,
          easing: "linear",
          pseudoElement: "::view-transition-new(root)",
        });
      })
      .catch(() => {});
  }

  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}
