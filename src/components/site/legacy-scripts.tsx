"use client"

import { useEffect } from "react"

export type LegacyScript = { src: string; integrity?: string }

/* Runs the page's behaviour scripts (scroll effects, the step bar, sandboxes,
   the cursor ring) once the page is on screen, one after another in the same
   order as the old static pages loaded them. Each script runs once. */
export function LegacyScripts({ scripts }: { scripts: LegacyScript[] }) {
  useEffect(() => {
    const w = window as unknown as { __legacyLoaded?: Set<string> }
    const done = (w.__legacyLoaded ??= new Set())
    /* scripts added with async = false still run in the order they were added */
    for (const s of scripts) {
      if (done.has(s.src)) continue
      done.add(s.src)
      const el = document.createElement("script")
      el.src = s.src
      el.async = false
      if (s.integrity) {
        el.integrity = s.integrity
        el.crossOrigin = "anonymous"
        el.referrerPolicy = "no-referrer"
      }
      document.body.appendChild(el)
    }
  }, [scripts])
  return null
}
