import Link from "next/link";

type IndexCase = {
  slug: string;
  title: string;
  years: string;
  pic: { src: string; w: number; h: number };
  /* a drawn cover with its own frame: shown whole, with room around it */
  contain?: boolean;
};

/* Case studies: a grid of covers. The first study (Luna) is the lead and
   takes the wide cell of the top row; the next sits beside it, and the last
   three share the second row. Each card is one link: a darkened cover with
   the title and years set on it. Under 860px it is one column, lead first. */
export function WorkIndex({ items }: { items: IndexCase[] }) {
  return (
    <section className="wrap ws" id="work" aria-labelledby="work-h">
      <header className="wg__head">
        <h2 className="h2" id="work-h">Case studies</h2>
      </header>
      <ul className="wg">
        {items.map((c, i) => (
          <li key={c.slug} className={`wg__card${i === 0 ? " is-lead" : ""}`}>
            <Link prefetch={false} href={`/work/${c.slug}`} className="wg__link">
              <span className={`wg__pic${c.contain ? " is-contain" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.pic.src} alt="" width={c.pic.w} height={c.pic.h} loading={i < 2 ? "eager" : "lazy"} />
              </span>
              <span className="wg__row">
                <span className="wg__title">{c.title}</span>
                <span className="wg__years">{c.years}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
