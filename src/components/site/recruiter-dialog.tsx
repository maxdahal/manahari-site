"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogPopup } from "@/components/ui/dialog"
import { closeMenu } from "./close-menu"

/* The quick summary for recruiters. Buttons marked data-recruiter open it,
   and so does ?summary in the address (Home's Quick summary lands here).
   Close, Escape or a click on the dimmed page shut it; focus goes back to
   the button that opened it. "See more" shows every skill. */
export function RecruiterDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const button = (event.target as Element | null)?.closest?.("[data-recruiter]") as HTMLElement | null
      if (!button) return
      opener.current = button
      closeMenu()
      setOpen(true)
    }
    document.addEventListener("click", onClick)
    if (/[?&]summary\b/.test(location.search)) {
      history.replaceState(null, "", location.pathname + location.hash)
      queueMicrotask(() => setOpen(true))
    }
    return () => document.removeEventListener("click", onClick)
  }, [])

  function onInnerClick(event: React.MouseEvent) {
    const target = event.target as Element
    const close = target.closest("[data-close]")
    if (close) {
      if (close.tagName === "A") opener.current = null
      setOpen(false)
      return
    }
    const more = target.closest(".recruiter__more") as HTMLElement | null
    const list = more?.closest(".recruiter")?.querySelector(".recruiter__skills")
    if (more && list) {
      if (!more.dataset.label) more.dataset.label = more.textContent ?? ""
      const isOpen = !list.classList.contains("is-open")
      list.classList.toggle("is-open", isOpen)
      more.setAttribute("aria-expanded", String(isOpen))
      more.textContent = isOpen ? "See fewer" : more.dataset.label
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="recruiter" aria-labelledby="recruiter-h" finalFocus={opener} onClick={onInnerClick}>
        {children}
      </DialogPopup>
    </Dialog>
  )
}
