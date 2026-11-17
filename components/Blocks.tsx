/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import type { Block } from "@/content/types";
import { ArmPanel } from "./ArmPanel";
import { KuSandbox } from "./KuSandbox";
import { Frame } from "./Frame";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i} className="prose">{b.text}</p>;
          case "h3":
            return <h4 key={i} className="block-h3">{b.text}</h4>;
          case "split":
            return (
              <div key={i} className={`split${b.flip ? " split--flip" : ""}${b.text.length < 160 && b.img.h > b.img.w * 0.9 ? " split--stack" : ""}`}>
                <div className="split__text">
                  {b.title ? <h4 className="split__h">{b.title}</h4> : null}
                  <p>{b.text}</p>
                </div>
                <figure className="split__fig">
                  <img src={b.img.src} alt={b.img.alt} width={b.img.w} height={b.img.h} loading="lazy" />
                  {b.caption ? <figcaption>{b.caption}</figcaption> : null}
                </figure>
              </div>
            );
          case "video":
            return (
              <figure key={i} className="figure">
                <Frame tag={b.label}>
                  <video controls muted playsInline preload="none" poster={b.poster} width={b.w} height={b.h} className="figure__video">
                    <source src={b.webm} type="video/webm" />
                    <source src={b.mp4} type="video/mp4" />
                  </video>
                </Frame>
                {b.caption ? <figcaption style={{ marginTop: 44 }}>{b.caption}</figcaption> : null}
              </figure>
            );
          case "lead":
            return <p key={i} className="lead">{b.text}</p>;
          case "list":
            return <ul key={i} className="bullets">{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
          case "pairs":
            return (
              <dl key={i} className="pairs">
                {b.items.map((p) => (
                  <div key={p.term}><dt>{p.term}</dt><dd>{p.text}</dd></div>
                ))}
              </dl>
            );
          case "decisions":
            return (
              <ol key={i} className="decisions">
                {b.items.map((d, n) => (
                  <li key={d.title} className="decision">
                    <span className="pin" aria-hidden="true">{n + 1}</span>
                    <h3>{d.title}</h3>
                    <p>{d.text}</p>
                    {d.instead ? (
                      <p className="decision__instead"><span>Replaced</span><s>{d.instead}</s></p>
                    ) : null}
                  </li>
                ))}
              </ol>
            );
          case "versions":
            return (
              <ol key={i} className="versions">
                {b.items.map((v) => (
                  <li key={v.tag + v.title} className={`version${v.kept ? " version--kept" : ""}`}>
                    <span className="version__tag">{v.tag}{v.kept ? " · Kept" : ""}</span>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </li>
                ))}
              </ol>
            );
          case "figure":
            return (
              <figure key={i} className={`figure${b.size ? ` figure--${b.size}` : ""}`}>
                {b.frame ? (
                  <Frame tag={b.frame} size={`${b.img.w} × ${b.img.h}`}>
                    <img src={b.img.src} alt={b.img.alt} width={b.img.w} height={b.img.h} loading="lazy" />
                  </Frame>
                ) : (
                  <img src={b.img.src} alt={b.img.alt} width={b.img.w} height={b.img.h} loading="lazy" />
                )}
                {b.caption ? <figcaption style={b.frame ? { marginTop: 44 } : undefined}>{b.caption}</figcaption> : null}
              </figure>
            );
          case "gallery": {
            const grid = (
              <div className={`gallery gallery--c${b.cols ?? 2}${b.items.every((g) => g.h > g.w * 1.3) ? " gallery--tall" : ""}`} style={{ "--cols": b.cols ?? 2 } as React.CSSProperties}>
                {b.items.map((g) => (
                  <figure key={g.src}>
                    <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" />
                    {g.caption ? <figcaption>{g.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            );
            return b.more ? (
              <details key={i} className="more">
                <summary>{b.more}</summary>
                {grid}
              </details>
            ) : (
              <Fragment key={i}>{grid}</Fragment>
            );
          }
          case "stages":
            return (
              <div key={i} className="stages">
                {b.rows.map((r) => (
                  <div key={r.name} className="stage">
                    <div>
                      <h3 className="h3">{r.name}</h3>
                      <p className="muted" style={{ marginTop: 8, fontSize: "0.9375rem" }}>{r.note}</p>
                    </div>
                    <div className="stage__imgs">
                      {r.items.map((g) => (
                        <figure key={g.src}>
                          <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" />
                          {g.caption ? <figcaption>{g.caption}</figcaption> : null}
                        </figure>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="quote">
                <p>{b.text}</p>
                {b.by ? <footer>{b.by}</footer> : null}
              </blockquote>
            );
          case "checks":
            return (
              <div key={i}>
                <h3 className="h3" style={{ marginBottom: 16 }}>Heuristic evaluation</h3>
                <ul className="checks">
                  {b.items.map((c) => (
                    <li key={c.tag} className={`check ${c.fixed ? "check--fixed" : "check--open"}`}>
                      <span className="check__tag">{c.tag}</span>
                      <b>{c.title}<small>{c.fixed ? "Fixed" : "Still open"}</small></b>
                      <p>{c.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "stats":
            return (
              <div key={i} className="readouts readouts--inline">
                {b.items.map((m) => (
                  <p key={m.term} className="readout"><b>{m.term}</b><span>{m.text}</span></p>
                ))}
              </div>
            );
          case "link":
            return <p key={i} className="prose"><a href={b.href} target="_blank" rel="noopener">{b.text}<span className="sr-only"> (opens in a new tab)</span></a></p>;
          case "kusandbox":
            return <KuSandbox key={i} />;
          case "armpanel":
            return (
              <div key={i} style={{ maxWidth: 620, paddingTop: 36 }}>
                <ArmPanel tagline="Arm panel sandbox" />
              </div>
            );
        }
      })}
    </>
  );
}
