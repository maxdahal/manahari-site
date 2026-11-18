import Link from "next/link";

type IndexCase = {
  slug: string;
  title: string;
  years: string;
  pic: { src: string; w: number; h: number };
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

/* Case studies: an intentional scatter. Each study keeps a row of its own,
   in order, but the cards differ in width, shape and side: they alternate
   left and right and each tucks up beside the one above, so the eye zigzags
   down from 1 to 5 without a strict staircase. Luna, first, is the widest.
   Each card is one link: a darkened cover with its step number, title and
   years set on it. Under 860px the cards stack in one column. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="wg__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>
      <div className="wg-route">
        <ol className="wg">
          {items.map((c, i) => (
            <li key={c.slug} className={`wg__card${i === 0 ? " is-lead" : ""}`}>
              <Link prefetch={false} href={`/work/${c.slug}`} className="wg__link">
                <span className={`wg__pic${c.contain ? " is-contain" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} />
                </span>
                <span className="wg__step" aria-hidden="true">{i + 1}</span>
                <span className="wg__row">
                  <span className="wg__title">{c.title}</span>
                  <span className="wg__years">{c.years}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
