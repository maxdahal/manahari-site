"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

/* KU color sandbox, ported from v1 (public/js/ku.js). Pick a text color and a
   background from the Brand Center palette; the preview repaints, the WCAG 2
   contrast ratio is checked against 4.5, 3 and 7, and the matching CSS is
   ready to copy. Laid out like Storybook: presets left, canvas, then tabs. */

type Swatch = { id: string; name: string; hex: string; token?: string };

const PALETTE: Swatch[] = [
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "text", name: "Text gray", hex: "#333333", token: "--ku-text" },
  { id: "blue", name: "Kansas Blue", hex: "#0051ba", token: "--ku-blue" },
  { id: "crimson", name: "Crimson", hex: "#e8000d", token: "--ku-crimson" },
  { id: "night", name: "Night", hex: "#003459", token: "--ku-night" },
  { id: "lake", name: "Lake", hex: "#2767ff", token: "--ku-lake" },
  { id: "sky", name: "Sky", hex: "#73cbf2", token: "--ku-sky" },
  { id: "fog", name: "Fog", hex: "#8e9fbc", token: "--ku-fog" },
  { id: "steam", name: "Steam", hex: "#dde5ed", token: "--ku-steam" },
  { id: "fire", name: "Fire", hex: "#ff3042", token: "--ku-fire" },
  { id: "brick", name: "Brick", hex: "#971b2f", token: "--ku-brick" },
  { id: "wheat", name: "Wheat", hex: "#f2a900", token: "--ku-wheat" },
  { id: "terra", name: "Terra Cotta", hex: "#c66e4e", token: "--ku-terra" },
  { id: "tallgrass", name: "Tallgrass", hex: "#be9a79", token: "--ku-tallgrass" },
  { id: "limestone", name: "Limestone", hex: "#d7d2cb", token: "--ku-limestone" },
  { id: "yellow", name: "Jayhawk Yellow", hex: "#ffc82d", token: "--ku-yellow" },
  { id: "gray", name: "Signature Gray", hex: "#85898a", token: "--ku-gray" },
];
const byId = Object.fromEntries(PALETTE.map((s) => [s.id, s])) as Record<string, Swatch>;

const PRESETS: { group: "Use" | "Avoid"; fg: string; bg: string }[] = [
  { group: "Use", fg: "white", bg: "blue" },
  { group: "Use", fg: "night", bg: "sky" },
  { group: "Use", fg: "text", bg: "steam" },
  { group: "Use", fg: "white", bg: "brick" },
  { group: "Avoid", fg: "white", bg: "sky" },
  { group: "Avoid", fg: "night", bg: "lake" },
  { group: "Avoid", fg: "white", bg: "gray" },
  { group: "Avoid", fg: "text", bg: "crimson" },
];

const CHECKS = [
  { min: 4.5, label: "Body text" },
  { min: 3, label: "Large text and icons" },
  { min: 7, label: "Enhanced (AAA)" },
];

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
const label = (s: Swatch) => (s.id === "text" ? "Gray text" : s.name);

const TABS = ["Controls", "Accessibility", "Code"] as const;

export function KuSandbox() {
  const uid = useId();
  const [fg, setFg] = useState("night");
  const [bg, setBg] = useState("sky");
  const [frame, setFrame] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Controls");
  const [copied, setCopied] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const f = byId[fg];
  const b = byId[bg];
  const r = ratio(f.hex, b.hex);
  const pass = r >= 4.5;
  const verdict =
    fg === bg
      ? "Same color twice: there is nothing to read."
      : r >= 4.5
        ? `Use it. ${f.name} on ${b.name} works for body text.`
        : r >= 3
          ? `Headlines only. ${f.name} on ${b.name} is too faint for body text.`
          : `Avoid. ${f.name} on ${b.name} is too faint to read.`;
  const tone = r >= 4.5 ? "pass" : r >= 3 ? "mid" : "fail";
  const css = (s: Swatch) => (s.token ? `var(${s.token})` : s.hex);
  const code = `.ku-pair {\n  color: ${css(f)}; /* ${f.name} */\n  background: ${css(b)}; /* ${b.name} */\n}\n/* contrast ${r.toFixed(2)} : 1 */`;

  function choose(nextFg: string, nextBg: string) {
    setFg(nextFg);
    setBg(nextBg);
    setCopied(false);
  }
  function passingPair() {
    const pairs: [string, string][] = [];
    for (const a of PALETTE) for (const c of PALETTE) if (a.id !== c.id && ratio(a.hex, c.hex) >= 4.5) pairs.push([a.id, c.id]);
    let next: [string, string];
    do next = pairs[Math.floor(Math.random() * pairs.length)];
    while (pairs.length > 1 && next[0] === fg && next[1] === bg);
    choose(next[0], next[1]);
  }
  function onTabKey(e: KeyboardEvent, i: number) {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + TABS.length) % TABS.length;
    setTab(TABS[n]);
    tabRefs.current[n]?.focus();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* clipboard blocked: the code stays selectable */
    }
  }

  return (
    <section className="kusb" aria-labelledby={`${uid}-h`}>
      <div className="kusb__bar">
        <p className="kusb__crumb">
          KU Brand <span aria-hidden="true">/</span> <b id={`${uid}-h`}>Color sandbox</b>
        </p>
        <div className="kusb__tools">
          <button type="button" className="kusb__btn" onClick={() => choose(bg, fg)}>Swap</button>
          <button type="button" className="kusb__btn" onClick={passingPair}>Passing pair</button>
          <label className="kusb__switch">
            <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)} />
            Holding box
          </label>
        </div>
      </div>

      <div className="kusb__body">
        <nav className="kusb__side" aria-label="Pairs from the system">
          {(["Use", "Avoid"] as const).map((g) => (
            <div key={g}>
              <p className="kusb__group">{g}</p>
              <ul>
                {PRESETS.filter((p) => p.group === g).map((p) => (
                  <li key={p.fg + p.bg}>
                    <button type="button" className="kusb__preset" aria-pressed={p.fg === fg && p.bg === bg} onClick={() => choose(p.fg, p.bg)}>
                      <svg className="kusb__aa" viewBox="0 0 30 26" aria-hidden="true" focusable="false">
                        <rect width="30" height="26" rx="4" fill={byId[p.bg].hex} />
                        <text x="15" y="17.5" textAnchor="middle" fontSize="13" fontWeight="700" fill={byId[p.fg].hex}>Aa</text>
                      </svg>
                      {label(byId[p.fg])} on {byId[p.bg].name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="kusb__main">
          <div className="kusb__canvas">
            <div className={`kusb__preview${frame ? " is-framed" : ""}`} style={{ color: f.hex, background: b.hex }}>
              <p className="kusb__kicker">Brand Center</p>
              <p className="kusb__headline">Towering Toward the Blue</p>
              <p className="kusb__copy">Logos, colors, type and graphics for everyone who tells KU’s story.</p>
              <p className="kusb__links">
                <span className="kusb__fakebtn" style={{ background: f.hex, color: b.hex }}>Explore the brand</span>
                <span className="kusb__fakelink">Download logos</span>
              </p>
              {frame && <span className="kusb__frame" aria-hidden="true"><i /><i /></span>}
            </div>
          </div>

          <div className="kusb__panel">
            <div className="kusb__tabs" role="tablist" aria-label="Sandbox panels">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`${uid}-t${i}`}
                  aria-controls={`${uid}-p${i}`}
                  aria-selected={tab === t}
                  tabIndex={tab === t ? 0 : -1}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {t}
                  {t === "Accessibility" && <span className={`kusb__badge is-${pass ? "pass" : "fail"}`}>{r.toFixed(1)} {pass ? "Pass" : "Fail"}</span>}
                </button>
              ))}
            </div>

            <div className="kusb__pane" role="tabpanel" id={`${uid}-p0`} aria-labelledby={`${uid}-t0`} hidden={tab !== "Controls"}>
              {([["Text", fg, setFg, f], ["Background", bg, setBg, b]] as const).map(([name, value, set, sw]) => (
                <fieldset key={name} className="kusb__row">
                  <legend>{name} <span>{sw.name} {sw.hex.toUpperCase()}</span></legend>
                  <div className="kusb__swatches">
                    {PALETTE.map((s) => (
                      <label key={s.id} className="kusb__sw" title={`${s.name} ${s.hex.toUpperCase()}`}>
                        <input type="radio" name={`${uid}-${name}`} value={s.id} checked={value === s.id} onChange={() => { set(s.id); setCopied(false); }} />
                        <span style={{ background: s.hex }} />
                        <b className="sr-only">{s.name}</b>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="kusb__pane" role="tabpanel" id={`${uid}-p1`} aria-labelledby={`${uid}-t1`} hidden={tab !== "Accessibility"}>
              <p className="kusb__ratio">contrast <b>{r.toFixed(2)}</b> : 1</p>
              <ul className="kusb__checks">
                {CHECKS.map((c) => {
                  const ok = r >= c.min;
                  return (
                    <li key={c.min} className={ok ? "is-pass" : "is-fail"}>
                      <span>{c.label}</span>
                      <span className="kusb__need">{c.min} : 1</span>
                      <b>{ok ? "Pass" : "Fail"}</b>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="kusb__pane" role="tabpanel" id={`${uid}-p2`} aria-labelledby={`${uid}-t2`} hidden={tab !== "Code"}>
              <pre className="kusb__code"><code>{code}</code></pre>
              <button type="button" className="kusb__btn" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            </div>

            <p className={`kusb__verdict is-${tone}`} aria-live="polite">{verdict}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
