import Link from "next/link";

type IndexCase = {
  slug: string;
  title: string;
  years: string;
  short: string;
  pic: { src: string; w: number; h: number };
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

/* Case studies: alternating text and image, the same reading flow as the
   studies themselves. One row per study, in order, Luna first; the cover
   and the text swap sides on every other row. The title is the link and
   stretches over the whole row, so the row clicks through and screen
   readers hear just the title. Each row is a rounded panel in one shared gray
   (--wa-bg in globals.css), the cover floating inside it. Under 860px each row stacks, cover first. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="wa__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>
      <ol className="wa">
        {items.map((c, i) => (
          <li key={c.slug} className={`wa__row${i % 2 ? " wa__row--flip" : ""}`}>
            <span className={`wa__pic${c.contain ? " is-contain" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} />
            </span>
            <div className="wa__text">
              <p className="wa__years">{c.years}</p>
              <h3 className="wa__title">
                <Link prefetch={false} href={`/work/${c.slug}`} className="wa__link">{c.title}</Link>
              </h3>
              <p className="wa__short">{c.short}</p>
              <span className="wa__go" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
