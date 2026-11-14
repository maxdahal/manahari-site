"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/* Light and dark follow the system until the visitor picks one with the
   button in the top bar; the pick is kept under the same key the old site
   used, so a returning visitor keeps their theme. The site's CSS reads
   html[data-theme]. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      storageKey="mt-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
