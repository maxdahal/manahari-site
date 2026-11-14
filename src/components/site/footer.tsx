/* The footer on every page: the open-to-roles line, email, the outlined
   name and the links elsewhere. */
export function Footer() {
  return (
    <footer className="cm-footer" id="contact" aria-labelledby="contact-h">
      {" "}
      <div className="cm-wrap">
        {" "}
        <div className="cm-footer__top" data-reveal="">
          {" "}
          <div>
            {" "}
            <h2 className="cm-label" id="contact-h">Open to UX design and UX engineering roles.</h2>{" "}
          </div>{" "}
          <a className="cm-footer__email" href="mailto:manahari.dahal1@gmail.com">manahari.dahal1@gmail.com</a>{" "}
        </div>{" "}
      </div>{" "}
      <p className="cm-footer__name" aria-hidden="true">UX engineer</p>{" "}
      <div className="cm-wrap cm-footer__base">
        {" "}
        <p>© 2026 Manahari Dahal</p>{" "}
        <nav aria-label="Elsewhere">
          <a href="/resume.pdf" target="_blank" rel="noopener">Resume</a>
          <a href="https://www.linkedin.com/in/manaharidahal/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://dribbble.com/manaharidahal" target="_blank" rel="noopener">Dribbble</a>
        </nav>{" "}
        <a href="#main">Back to top</a>{" "}
      </div>{" "}
    </footer>
  )
}
