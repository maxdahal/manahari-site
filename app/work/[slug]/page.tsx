/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Shell";
import { Blocks } from "@/components/Blocks";
import { Toc } from "@/components/Toc";
import { cases, getCase } from "@/content/cases";
import { profile } from "@/content/profile";
import type { Block } from "@/content/types";

/* a part with no image and little text gets less air above it */
const isShort = (blocks: Block[]) =>
  blocks.every((b) => !["figure", "gallery", "split", "stages", "armpanel", "kusandbox", "versions"].includes(b.type)) &&
  JSON.stringify(blocks).length < 900;

export const dynamicParams = false;
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCase((await params).slug);
  if (!c) return {};
  return { title: c.title, description: `${c.short} ${c.metrics[0].value} ${c.metrics[0].label}.`, openGraph: { images: [c.cover.src] } };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  const others = cases.filter((o) => o.slug !== c.slug);
  /* v1's acts, in order: each groups the parts that follow it */
  const acts: { id: string; title: string; parts: typeof c.sections }[] = [];
  for (const s of c.sections) {
    const last = acts[acts.length - 1];
    if (last && last.title === s.stage) last.parts.push(s);
    else acts.push({ id: `act-${acts.length + 1}`, title: s.stage, parts: [s] });
  }
  const toc = [...acts.map((a) => ({ id: a.id, title: a.title, parts: a.parts.map((p) => ({ id: p.id, title: p.title, play: p.blocks.some((b) => b.type === "armpanel" || b.type === "kusandbox") })) })), { id: "takeaways", title: "Takeaways", parts: [] }];

  return (
    <>
      <Header current="Work" />
      <main id="main">
        <article>
          <header className="wrap case-top">
            <p className="crumb"><Link prefetch={false} href="/#work">Projects</Link> / {c.title}</p>
            <h1 className="case-title">{c.heading ?? c.title}</h1>
            <div className="case-answer">
              <div>
                {c.problem ? <p className="case-answer__problem">{c.problem}</p> : null}
                {c.part ? <p className="case-answer__part">{c.part}</p> : null}
                {c.actions?.length ? (
                  <div className="actions case-actions">
                    {c.actions.map((a, i) => {
                      const out = a.href.startsWith("http");
                      return (
                        <a key={a.href} className={`btn ${i === 0 ? "btn--primary" : "btn--line"}`} href={a.href} {...(out ? { target: "_blank", rel: "noopener" } : {})}>
                          {a.play ? <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg> : null}
                          {a.label}
                          {out ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg><span className="sr-only"> (opens in a new tab)</span></> : null}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <dl className="spec">
                {c.spec.map((s) => (
                  <Fragment key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></Fragment>
                ))}
              </dl>
            </div>
            <figure className="case-cover">
              <img src={c.cover.src} alt={c.cover.alt} width={c.cover.w} height={c.cover.h} />
            </figure>
            <section className="case-outcome" aria-labelledby="outcome-h">
              <h2 className="sr-only" id="outcome-h">Outcome</h2>
              <ul className="case-outcome__nums">
                {c.metrics.map((m) => (
                  <li key={m.label}><b>{m.value}</b><span>{m.label}</span></li>
                ))}
              </ul>
              <p className="caveat"><span className="pin" aria-hidden="true">i</span><span>{c.caveat}</span></p>
            </section>
          </header>

          <div className="wrap case-body">
            <Toc acts={toc} />
            <div>
              {acts.map((a, n) => (
                <section key={a.id} id={a.id} className="case-act" aria-labelledby={`${a.id}-h`}>
                  <h2 className="case-act__h" id={`${a.id}-h`}><span className="case-act__ghost" aria-hidden="true">{a.title}</span><span className="pin" aria-hidden="true">{n + 1}</span>{a.title}</h2>
                  {a.parts.map((s) => (
                    <section key={s.id} id={s.id} className={`case-section${isShort(s.blocks) ? " case-section--short" : ""}`} aria-labelledby={`${s.id}-h`}>
                      {s.title !== a.title ? <h3 className="case-part__h" id={`${s.id}-h`}>{s.title}</h3> : <span id={`${s.id}-h`} hidden>{s.title}</span>}
                      <Blocks blocks={s.blocks} />
                    </section>
                  ))}
                </section>
              ))}
              <section id="takeaways" className="case-act" aria-labelledby="takeaways-h">
                <h2 className="case-act__h" id="takeaways-h"><span className="case-act__ghost" aria-hidden="true">Takeaways</span><span className="pin" aria-hidden="true">{acts.length + 1}</span>Takeaways</h2>
                <ul className="takeaways">
                  {c.takeaways.map((t) => (
                    <li key={t.title}><b>{t.title}</b><span>{t.text}</span></li>
                  ))}
                </ul>
                {c.note ? <p className="caveat"><span className="pin" aria-hidden="true">i</span><span>{c.note}</span></p> : null}
                <div className="case-end">
                  <div className="actions">
                    <a className="btn btn--primary" href={profile.resume}>Resume</a>
                    <a className="btn" href={`mailto:${profile.email}`}>Get in touch</a>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="wrap section" aria-labelledby="more-h">
            <div className="section__head"><h2 className="h2" id="more-h">More projects</h2></div>
            <ul className="next-case">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link prefetch={false} href={`/work/${o.slug}`}>
                    <img src={o.cover.src} alt="" width={o.cover.w} height={o.cover.h} loading="lazy" />
                    <b>{o.title}</b>
                    <span>{o.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
