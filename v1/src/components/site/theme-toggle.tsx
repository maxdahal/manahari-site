"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const noop = () => () => {}

/* Switching eases from one theme to the other instead of flashing: a
   cross-fade of the whole page where the browser has view transitions,
   otherwise the colours fade (.theme-fade in site.css). Instant for
   reduced motion or while motion is paused. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  /* false while the page is built, true in the browser: the theme is only
     known there */
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const next = mounted && resolvedTheme === "dark" ? "light" : "dark"

  function switchTheme() {
    const root = document.documentElement
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || root.classList.contains("motion-paused")) return setTheme(next)
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(next))
      return
    }
    root.classList.add("theme-fade")
    setTheme(next)
    setTimeout(() => root.classList.remove("theme-fade"), 500)
  }

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      aria-label={mounted ? `Switch to ${next} mode` : "Switch theme"}
      onClick={switchTheme}
    >
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
    </button>
  )
}
