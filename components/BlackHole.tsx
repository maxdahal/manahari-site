"use client";

import { useEffect, useRef, useState } from "react";

/* Footer backdrop: a black hole drawn in dust. An empty event horizon with a
   thin photon ring, a tilted accretion disk of specks that orbit faster as they
   fall in and vanish at the horizon, the far side of the disk bent up over the
   top by lensing, and the approaching side brighter. A loose field of dust
   drifts around it. Canvas 2D on the footer's dark stage. It only runs while
   the footer is on screen and the tab is visible, holds one still frame under
   reduced motion, and has a pause button (WCAG 2.2.2). */

type Mote = { r: number; a: number; s: number; b: number; t: number; field: boolean };

const ROT = -0.1; // the disk's lean, radians
const SPIN = 0.55; // radians per second at the horizon
const FALL = 0.05; // inward drift, horizon radii per second at the horizon

function rand(seed: number) {
  // deterministic PRNG so the first frame is the same on every load
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export function BlackHole() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const pausedRef = useRef(false);
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    const cv = canvas.current;
    const foot = cv?.closest("footer");
    const ctx = cv?.getContext("2d");
    if (!cv || !foot || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    setStill(reduce.matches);
    const css = getComputedStyle(foot);
    const ink = css.getPropertyValue("--stage-ink").trim() || "#F6F7F8";
    const ground = css.getPropertyValue("--stage").trim() || "#15171E";
    const hex = /^#?([0-9a-f]{6})$/i.exec(ground)?.[1] ?? "15171E";
    const groundRgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
    let w = 0, h = 0, Rh = 0, cx = 0, cy = 0, outer = 0;
    let motes: Mote[] = [];
    let raf = 0, last = 0, visible = false;
    const rnd = rand(11);

    const spawn = (m: Mote, fresh: boolean) => {
      m.field = rnd() < 0.22;
      // disk dust crowds toward the hole; field dust spreads wide and stands more upright
      m.r = m.field
        ? Rh * (2 + rnd() * 12)
        : Rh * (fresh ? 1.3 + Math.pow(rnd(), 2.2) * (outer / Rh - 1.3) : outer / Rh * (0.9 + rnd() * 0.1));
      m.a = rnd() * Math.PI * 2;
      m.t = m.field ? 0.35 + rnd() * 0.5 : 0.16 + rnd() * 0.08;
      m.s = rnd() < 0.07 ? 1.8 + rnd() * 0.8 : 0.7 + rnd() * 0.8;
      m.b = 0.4 + rnd() * 0.6;
      return m;
    };

    const size = () => {
      const box = foot.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = box.width; h = box.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = w < 700;
      Rh = narrow ? Math.max(20, w * 0.055) : Math.min(76, Math.max(44, w * 0.045));
      cx = w * (narrow ? 0.66 : 0.75);
      cy = narrow ? 76 : h * 0.4;
      outer = Rh * (narrow ? 6 : 7.5);
      const n = Math.round(Math.min(7000, Math.max(1600, (w * h) / 110)));
      motes = Array.from({ length: n }, () => spawn({} as Mote, true));
    };

    const cos = Math.cos(ROT), sin = Math.sin(ROT);
    const place = (ex: number, ey: number): [number, number] => [cx + ex * cos - ey * sin, cy + ex * sin + ey * cos];

    const dot = (x: number, y: number, s: number, alpha: number) => {
      if (alpha < 0.02 || x < -4 || y < -4 || x > w + 4 || y > h + 4) return;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      const front: Mote[] = [];
      const lensed: number[] = [];

      // the field and the disk behind the hole; its lensed image is drawn later
      for (const m of motes) {
        if (dt) {
          const k = Rh / m.r;
          m.a += SPIN * k * Math.sqrt(k) * dt; // inner dust orbits faster
          if (!m.field) {
            m.r -= Rh * FALL * Math.sqrt(k) * dt * 6;
            if (m.r < Rh * 1.08) spawn(m, false); // swallowed: a new speck enters at the rim
          }
        }
        const ca = Math.cos(m.a), sa = Math.sin(m.a);
        const q = m.r / Rh;
        // brighter near the hole, brighter on the approaching (left) side, fading out
        // just before the horizon and at the disk's outer edge
        const heat = m.field ? 0.2 : Math.min(1, 1.6 / Math.pow(q, 0.7));
        const beam = m.field ? 1 : 0.55 + 0.45 * Math.max(0, -ca) + 0.15;
        const edge = m.field ? 1 : Math.min(1, Math.max(0, (q - 1.05) / 0.75) ** 1.5) * Math.min(1, (outer / Rh - q) / 1.2);
        const alpha = m.b * heat * beam * Math.max(0, edge);

        if (sa > 0 && !m.field) { front.push(m); continue; }
        const [x, y] = place(ca * m.r, sa * m.r * m.t);
        dot(x, y, m.s, alpha);

        // lensing: light from the far side bends over the top of the hole
        if (!m.field && q < 5) {
          // scattered radius, so the image never stacks into a crisp circle
          const rl = Rh * (1.08 + (q - 1) * 0.38 + (m.b - 0.7) * 0.3);
          const lx = ca * rl;
          const arc = Math.sqrt(Math.max(0, rl * rl - lx * lx)) * 0.94;
          // thin toward the horizon and toward the disk's outer reach
          const fade = Math.min(1, Math.max(0, (rl / Rh - 1.05) / 0.6)) * (1 - (q - 1) / 4);
          let [px, py] = place(lx, -arc);
          lensed.push(px, py, m.s * 0.9, alpha * fade);
          // and a thinner secondary image under the hole
          if (q < 2.6) { [px, py] = place(lx * 0.95, arc * 0.9); lensed.push(px, py, m.s * 0.8, alpha * 0.4 * fade); }
        }
      }

      // the event horizon: no edge of its own, just darkness that deepens toward
      // the centre and swallows the dust behind it
      ctx.globalAlpha = 1;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rh * 2);
      const stops: [number, number][] = [[0, 1], [0.4, 1], [0.5, 0.92], [0.6, 0.7], [0.72, 0.42], [0.85, 0.16], [1, 0]];
      for (const [at, k] of stops) glow.addColorStop(at, `rgb(${groundRgb} / ${k})`);
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, Rh * 2, 0, Math.PI * 2); ctx.fill();

      // the lensed arc sits over the horizon's soft edge
      ctx.fillStyle = ink;
      for (let i = 0; i < lensed.length; i += 4) dot(lensed[i], lensed[i + 1], lensed[i + 2], lensed[i + 3]);

      // the near half of the disk crosses in front of the hole
      for (const m of front) {
        const ca = Math.cos(m.a), sa = Math.sin(m.a);
        const q = m.r / Rh;
        const heat = Math.min(1, 1.6 / Math.pow(q, 0.7));
        const beam = 0.7 + 0.45 * Math.max(0, -ca);
        const edge = Math.min(1, Math.max(0, (q - 1.05) / 0.75) ** 1.5) * Math.min(1, (outer / Rh - q) / 1.2);
        const [x, y] = place(ca * m.r, sa * m.r * m.t);
        dot(x, y, m.s, m.b * heat * beam * Math.max(0, edge));
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !document.hidden && !reduce.matches && !pausedRef.current) raf = requestAnimationFrame(frame);
      else draw(0);
    };
    runRef.current = run;

    size();
    draw(0);
    const ro = new ResizeObserver(() => { size(); draw(0); });
    ro.observe(foot);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); });
    io.observe(foot);
    const onMotion = () => { setStill(reduce.matches); run(); };
    reduce.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", run);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      reduce.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", run);
    };
  }, []);

  // restart or stop the loop when the button flips
  useEffect(() => {
    pausedRef.current = paused;
    runRef.current();
  }, [paused]);

  return (
    <>
      <canvas ref={canvas} className="dust" aria-hidden="true" />
      {!still && (
        <button type="button" className="dust__btn" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <span className="sr-only">Pause the black hole animation</span>
          {paused ? (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
          )}
        </button>
      )}
    </>
  );
}
