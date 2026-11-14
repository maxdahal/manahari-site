"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogPopup, DialogTitle } from "@/components/ui/dialog"
import { closeMenu } from "./close-menu"

/* The resume opens in a dialog. Every link to /resume.pdf on the page opens
   it; a middle-click, ctrl-click or the links inside the dialog still go to
   the file. The PDF loads the first time the dialog opens. */
export function ResumeDialog() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null
      const link = target?.closest?.('a[href="/resume.pdf"]') as HTMLAnchorElement | null
      if (!link || link.closest(".cm-rdialog")) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return
      event.preventDefault()
      opener.current = link
      closeMenu()
      setLoaded(true)
      setOpen(true)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="cm-rdialog" finalFocus={opener}>
        <div className="cm-rdialog__inner">
          <header className="cm-rdialog__head">
            <DialogTitle id="resume-h" className="text-[1.5rem] leading-[inherit] font-medium">Resume</DialogTitle>{" "}
            <Button variant="pill-line" size="pill-sm" nativeButton={false} render={<a href="/resume.pdf" download="" />}>Download</Button>{" "}
            <Button variant="pill-line" size="pill-sm" nativeButton={false} render={<a href="/resume.pdf" target="_blank" rel="noopener" data-resume-tab="" />}>Open in a new tab</Button>{" "}
            <DialogClose className="icon-button cm-rdialog__close" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </DialogClose>
          </header>
          <iframe className="cm-rdialog__frame" title="Resume, PDF" src={loaded ? "/resume.pdf#view=FitH" : undefined} />
        </div>
      </DialogPopup>
    </Dialog>
  )
}
