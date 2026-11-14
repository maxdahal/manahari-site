import { ThemeToggle } from "./theme-toggle"

type Current = "about" | "work" | "home"

const links: { href: string; label: string; key: Current }[] = [
  { href: "/about", label: "About", key: "about" },
  { href: "/#work", label: "Work", key: "work" },
  { href: "/#artwork", label: "Artwork", key: "home" },
]

/* The top bar on every page: the brand with its rolling role, the main
   links, the resume link (opens the resume dialog), theme and menu. */
export function Header({ current }: { current?: Current }) {
  return (
    <header className="cp-bar pv-nav cm-header">
      {" "}
      <div className="cm-wrap cm-header__row">
        {" "}
        <a className="cm-brand" href="/" aria-label="Manahari Dahal, home">
          <b>M—D</b>
          <span className="cm-brand__role" data-words="UX Engineer|Product Designer|UX Designer">
            <span className="cm-role">
              <span>UX Engineer</span>
              <span aria-hidden="true"></span>
            </span>
          </span>
        </a>{" "}
        <div className="cm-header__right">
          {" "}
          <nav className="pv-nav__links" aria-label="Main">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={
                  current === "about" && l.key === "about"
                    ? "page"
                    : current === "work" && l.key === "work"
                      ? "location"
                      : undefined
                }
              >
                <span className="roll">
                  <span data-text={l.label}>{l.label}</span>
                </span>
              </a>
            ))}
          </nav>{" "}
          <a className="cm-resume" href="/resume.pdf" target="_blank" rel="noopener" data-cursor="Open resume">
            Resume <span aria-hidden="true">↗</span>
          </a>{" "}
          <div className="cm-header__end cp-bar__end">
            {" "}
            <ThemeToggle />{" "}
            <button className="icon-button menu-button" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
              <span className="menu-button__lines" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  )
}
