import Link from "next/link";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";
import { MenuButton } from "./MenuButton";
import { NavSpy } from "./NavSpy";
import { RecruiterDialog } from "./RecruiterDialog";
import { BlackHole } from "./BlackHole";

/* in-page sections; Artwork sits at the end of the homepage, reachable from the footer */
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
];
const FOOT_NAV = [...NAV, { href: "/#artwork", label: "Artwork" }];

/* Full-width bar: wordmark left; links, the recruiter pill and the theme
   toggle right. Clear at the top of the page, frosted with a hairline once
   the page scrolls. On phones the links fold behind a menu button. */
export function Header({ current }: { current?: string }) {
  return (
    <header className="site-head">
      <div className="wrap site-head__bar">
        <Link prefetch={false} className="logo" href="/" aria-label={`${profile.name}, home`}>
          md<span className="logo__dot">.</span>
        </Link>
        <span className="site-head__end">
        <nav className="nav" id="site-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link prefetch={false} key={n.href} href={n.href} aria-current={current === n.label ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
          <a href={`mailto:${profile.email}`}>Contact</a>
          <NavSpy />
          {/* phones: the full-screen menu ends with status and the ways to reach me */}
          <span className="nav__more">
            <span className="status"><i aria-hidden="true" />{profile.status}</span>
            <span className="nav__btns">
              <a className="btn btn--primary" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
              <a className="btn btn--line" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
            </span>
            <a className="nav__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          </span>
        </nav>
        <RecruiterDialog />
        <ThemeToggle />
        <MenuButton />
        </span>
      </div>
    </header>
  );
}

/* the two source colours, Himalayan blue and rhododendron crimson: shown in the footer
   colophon and at the Nepal stop in the About section. Decorative; the footer line names them. */
function NepalDots() {
  return <span className="nepal-dots" aria-hidden="true"><i style={{ background: "#003893" }} /><i style={{ background: "#DC143C" }} /></span>;
}

/* The footer is a dark stage, like the hero, so the page opens and closes on the
   same panel; the dark tokens apply inside it in both themes. It carries the
   black hole unless the page already has one in its hero (hole={false}). */
export function Footer({ hole = true }: { hole?: boolean }) {
  return (
    <footer className="site-foot dark" data-hole={hole ? "" : undefined}>
      <div className="wrap">
        <p className="site-foot__ask">{profile.status}</p>
        <a className="site-foot__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="site-foot__row">
          <nav aria-label="Elsewhere">
            <a className="btn btn--primary" href={profile.resume} target="_blank" rel="noopener">Resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
            <a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={profile.dribbble} target="_blank" rel="noopener">Dribbble</a>
          </nav>
          <nav className="site-foot__site" aria-label="Site">
            {FOOT_NAV.map((n) => (
              <Link prefetch={false} key={n.href} href={n.href}>{n.label}</Link>
            ))}
          </nav>
          <p>© 2026 Manahari Dahal <a href="#main">Back to top</a></p>
        </div>
        <p className="site-foot__colors">
          <NepalDots />
          Colors from home: Himalayan blue and rhododendron, Nepal’s national flower.
          {hole ? <BlackHole place="foot" /> : null}
        </p>
      </div>
    </footer>
  );
}
