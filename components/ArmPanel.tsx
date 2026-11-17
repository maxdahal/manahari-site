"use client";

/* A working piece of the Surgical Console: the arm-identity panel, with the
   five designs I tested and a one-second glance test. Ported from the v1
   arm sandbox (manahari-site/public/js/arm-sandbox.js). */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Frame } from "./Frame";

type State = "Running" | "Warning" | "Error" | "Inactive";
type DesignId = "before" | "a" | "b" | "c" | "final";
type PinAt = "list" | "flag" | "fill" | "bar" | "state";

const STATES: State[] = ["Running", "Warning", "Error", "Inactive"];
const SIDE: Record<number, "l" | "r"> = { 1: "l", 2: "l", 3: "r", 4: "r" };
const ARM_COLORS = ["#b9a4ff", "#e3c48f", "#1f5f4a", "#f49ac9"];

const DESIGNS: Record<DesignId, { tab: string; name: string; verdict: "before" | "kept" | "dropped" | "shipped"; pins: { at: PinAt; title: string; text: string }[] }> = {
  before: {
    tab: "Before",
    name: "Number only",
    verdict: "before",
    pins: [{ at: "list", title: "Number only", text: "A warning showed in one list, and the arm was only a number. A nurse had to match that number to a real arm in the room." }],
  },
  a: {
    tab: "A",
    name: "Warning on the picture",
    verdict: "kept",
    pins: [{ at: "flag", title: "Warning on the picture", text: "A label with L or R sat next to the instrument." }],
  },
  b: {
    tab: "B",
    name: "Arm color as a fill",
    verdict: "dropped",
    pins: [{ at: "fill", title: "Arm color as a fill", text: "The whole panel took the arm color. Dropped, because it hid the state." }],
  },
  c: {
    tab: "C",
    name: "Bar, dot and word",
    verdict: "kept",
    pins: [
      { at: "bar", title: "Arms keep their own color", text: "Shown only as a thin bar on top of the panel." },
      { at: "state", title: "Saying it three ways", text: "Color, word and icon together, for color-blind staff." },
    ],
  },
  final: {
    tab: "A + C",
    name: "Final design",
    verdict: "shipped",
    pins: [
      { at: "bar", title: "Arms keep their own color", text: "Color showed identity." },
      { at: "state", title: "One alert scale", text: "Green running, amber warning, red error, grey inactive." },
      { at: "flag", title: "Warning on the picture", text: "A label with L or R sat next to the instrument." },
    ],
  },
};
const ORDER: DesignId[] = ["before", "a", "b", "c", "final"];
const VERDICT_LABEL = { before: "Before", kept: "Kept", dropped: "Dropped", shipped: "Final" };

const START: State[] = ["Running", "Warning", "Error", "Inactive"];

/* the glance test's clock; kept outside the component so render stays pure (it only runs on a
   click or key press) */
const now = () => performance.now();

export function ArmPanel({ tagline = "Arm panel" }: { tagline?: string }) {
  const [design, setDesign] = useState<DesignId>("final");
  const [arms, setArms] = useState<State[]>(START);
  const [glance, setGlance] = useState<null | { phase: "look" | "ask" | "done"; target: number; picked?: number; ms?: number }>(null);
  const askedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstPick = useRef<HTMLButtonElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (glance?.phase === "ask") firstPick.current?.focus({ preventScroll: true }); }, [glance?.phase]);

  const d = DESIGNS[design];
  const pinNo = (at: PinAt) => d.pins.findIndex((p) => p.at === at) + 1;

  const side = { l: null as State | null, r: null as State | null };
  arms.forEach((s, i) => {
    if (s === "Warning" || s === "Error") {
      const k = SIDE[i + 1];
      if (!side[k] || s === "Error") side[k] = s;
    }
  });
  const alerts = arms.map((s, i) => (s === "Warning" || s === "Error" ? `Arm ${i + 1} ${s}` : null)).filter(Boolean);
  // where the pins attach: the first arm with a problem, else arm 3
  const focusArm = Math.max(0, arms.findIndex((s) => s === "Error" || s === "Warning"));
  const flagSide: "l" | "r" = side.r ? "r" : "l";

  function cycle(i: number) {
    setArms((a) => a.map((s, j) => (j === i ? STATES[(STATES.indexOf(s) + 1) % STATES.length] : s)));
  }
  function randomFault() {
    const target = Math.floor(Math.random() * 4);
    setArms([0, 1, 2, 3].map((n) => (n === target ? (Math.random() < 0.6 ? "Error" : "Warning") : Math.random() < 0.8 ? "Running" : "Inactive")) as State[]);
    return target + 1;
  }
  function startGlance() {
    if (timer.current) clearTimeout(timer.current);
    const target = randomFault();
    setGlance({ phase: "look", target });
    timer.current = setTimeout(() => {
      askedAt.current = now();
      setGlance({ phase: "ask", target });
    }, 1000);
  }
  function pick(n: number) {
    if (!glance || glance.phase !== "ask") return;
    setGlance({ ...glance, phase: "done", picked: n, ms: now() - askedAt.current });
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    const n = Number(e.key);
    if (n >= 1 && n <= 5 && !glance) { setDesign(ORDER[n - 1]); e.preventDefault(); }
  }

  const pin = (at: PinAt, style: React.CSSProperties) => {
    const n = pinNo(at);
    if (!n || glance) return null;
    return <span key={`${design}-${at}`} className="pin armkit__pin" style={style} aria-hidden="true">{n}</span>;
  };

  const fault = glance ? arms[glance.target - 1] : null;

  return (
    <div className="armkit" onKeyDown={onKey}>
      <div className="armkit__tabs" role="group" aria-label="Options I tested">
        {ORDER.map((id, i) => (
          <button key={id} type="button" className="armkit__tab" aria-pressed={design === id} data-verdict={DESIGNS[id].verdict} onClick={() => { setDesign(id); setGlance(null); }}>
            {DESIGNS[id].tab}
            <kbd aria-hidden="true">{i + 1}</kbd>
            <span className="sr-only">: {DESIGNS[id].name}, {VERDICT_LABEL[DESIGNS[id].verdict]}</span>
          </button>
        ))}
      </div>

      <Frame tag={tagline} size={`${d.tab} · ${VERDICT_LABEL[d.verdict]}`}>
        <div className="console" data-design={design} role="group" aria-label={`Console, ${d.name} design`}>
          <div className="console__video" aria-hidden="true">
            <i className="console__tool console__tool--l" />
            <i className="console__tool console__tool--r" />
            {(["l", "r"] as const).map((k) => (
              <span key={k} className={`console__flag console__flag--${k}${side[k] ? " is-on" : ""}${side[k] === "Warning" ? " is-warning" : ""}`}>
                {side[k] ? `${k.toUpperCase()} · ${side[k]}` : ""}
                {k === flagSide && side[k] && (design === "a" || design === "final") ? pin("flag", { right: -14, top: -14 }) : null}
              </span>
            ))}
          </div>
          <ul className="console__arms">
            {arms.map((s, i) => (
              <li key={i} className="carm" data-arm={i + 1} data-state={s} style={{ "--arm": ARM_COLORS[i] } as React.CSSProperties}>
                <button type="button" onClick={() => cycle(i)} disabled={!!glance} aria-label={`Arm ${i + 1}, ${s}. Change state`} style={{ all: "unset", position: "absolute", inset: 0, cursor: glance ? "default" : "pointer", borderRadius: 6 }} />
                <span className="carm__name">Arm {i + 1}</span>
                <span className="carm__state"><i className="carm__dot" /><span>{s}</span></span>
                <span className="carm__lines" />
                {i === focusArm ? (
                  <>
                    {pin("bar", { right: 6, top: -16 })}
                    {pin("state", { left: 6, bottom: -13 })}
                    {pin("fill", { right: 6, top: 6 })}
                  </>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="console__list" style={{ position: "relative" }}>
            <b>Warnings</b> · {alerts.length ? alerts.join(", ") : "0"}
            {pin("list", { right: 8, top: -12 })}
          </p>

          {glance && glance.phase !== "look" ? (
            <div className="glance" role="dialog" aria-label="Glance test">
              <p className="glance__q">Which arm needs help?</p>
              <div className="glance__picks">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    ref={n === 1 ? firstPick : undefined}
                    type="button"
                    disabled={glance.phase === "done"}
                    className={glance.phase === "done" ? (n === glance.target ? "is-right" : n === glance.picked ? "is-wrong" : "") : ""}
                    onClick={() => pick(n)}
                  >
                    Arm {n}
                  </button>
                ))}
              </div>
              <p className="glance__result" aria-live="polite">
                {glance.phase === "done"
                  ? `${glance.picked === glance.target ? "Right." : "Not quite."} Arm ${glance.target} had ${fault === "Error" ? "an error" : "a warning"}. You answered in ${((glance.ms ?? 0) / 1000).toFixed(1)}s.`
                  : ""}
              </p>
              {glance.phase === "done" ? (
                <p>
                  <button type="button" className="glance__again" onClick={startGlance}>Try again</button>
                  {" · "}
                  <button type="button" className="glance__again" onClick={() => setGlance(null)}>Close</button>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Frame>

      <ol className="armkit__notes" aria-live="polite">
        {d.pins.map((p, i) => (
          <li key={`${design}-${i}`} className="armkit__note">
            <span className="pin" aria-hidden="true">{i + 1}</span>
            <p>
              <b>
                {p.title}
                {i === 0 && d.verdict !== "before" ? <span className={`armkit__verdict armkit__verdict--${d.verdict === "dropped" ? "dropped" : "kept"}`}>{VERDICT_LABEL[d.verdict]}</span> : null}
              </b>
              {p.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="armkit__controls">
        <button type="button" className="btn btn--line" onClick={startGlance} disabled={glance?.phase === "look"}>
          Glance test · 1s
        </button>
        <span className="muted">Switch between the designs I tested, from the old number-only panels to the final design, and set each arm’s state.</span>
      </div>
    </div>
  );
}
