import { Analytics } from "@vercel/analytics/next"
import { Newsreader } from "next/font/google"
import { ThemeProvider } from "./theme-provider"

/* the site's typeface, self-hosted and preloaded by next/font, with a
   fallback sized to match it, so text does not re-wrap when it arrives
   (it moved the Home and About statements on load). The stylesheets reach
   it through --font-newsreader. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
})

/* the faces only the case-study sandboxes and code samples use */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;700&display=swap"
const CASE_FONTS =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Kalam:wght@400&display=swap"

/* pausing motion with the button in the top bar holds for the rest of the
   visit only; set before the page paints */
const motionScript = `try{if(sessionStorage.getItem("motion")==="paused")document.documentElement.classList.add("motion-paused")}catch(e){}`

/* The html, head and body shared by every page. Home and About, and the case
   studies, each have their own root layout (their stylesheets differ), and
   both render this. */
export function SiteDocument({
  bodyClass,
  caseFonts = false,
  children,
}: {
  bodyClass: string
  caseFonts?: boolean
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={newsreader.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/assets/icons/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        {caseFonts && <link rel="stylesheet" href={CASE_FONTS} />}
      </head>
      <body className={bodyClass} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
