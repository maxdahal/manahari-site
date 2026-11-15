import "@/styles/entry-site.css"
import type { Metadata } from "next"
import { SiteDocument } from "@/components/site/document"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ResumeDialog } from "@/components/site/resume-dialog"
import { RecruiterDialog } from "@/components/site/recruiter-dialog"
import { RecruiterSummary } from "@/components/site/recruiter-summary"
import { LegacyScripts, type LegacyScript } from "@/components/site/legacy-scripts"

/* The 404 for any address the site does not have. The site has more than one
   root layout (Home and About, the case studies), so this is a whole page of
   its own (experimental.globalNotFound in next.config.ts): the same header,
   menu, footer, type and theme as every other page, so a visitor can carry on
   from here. */
export const metadata: Metadata = {
  title: "404 - Manahari",
}

const scripts: LegacyScript[] = [{ src: "/js/site.js" }, { src: "/js/carme.js" }]

export default function GlobalNotFound() {
  return (
    <SiteDocument bodyClass="pv cm">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <div className="menu" id="menu">
        <nav className="menu__links" aria-label="Menu">
          <a href="/#work">Work<small>01</small></a>
          <a href="/about">About<small>02</small></a>
          <a href="/#artwork">Artwork<small>03</small></a>
        </nav>
        <div className="menu__foot">
          <button className="recruiter-button recruiter-button--menu" type="button" data-recruiter="" aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>
            For recruiters
          </button>
          <a href="mailto:manahari.dahal1@gmail.com">manahari.dahal1@gmail.com</a>
          <span>
            <a href="/resume.pdf" target="_blank" rel="noopener">Resume</a>
            <a href="https://www.linkedin.com/in/manaharidahal/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://dribbble.com/manaharidahal" target="_blank" rel="noopener">Dribbble</a>
          </span>
        </div>
      </div>
      <main className="pv-main" id="main">
        <section className="cm-wrap cm-missing" aria-labelledby="missing-h">
          <h1 className="cm-label" id="missing-h">404</h1>
          <p>This page could not be found.</p>
        </section>
      </main>
      <Footer />
      <RecruiterDialog><RecruiterSummary /></RecruiterDialog>
      <ResumeDialog />
      <LegacyScripts scripts={scripts} />
    </SiteDocument>
  )
}
