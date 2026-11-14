import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "./theme-provider"

const FONTS =
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300..700&family=Newsreader:ital,opsz,wght@1,6..72,400..600&family=Inter:wght@300;400;500;600;700&family=Geist:wght@700&family=Geist+Mono:wght@400;700&display=swap"
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
    <html lang="en" suppressHydrationWarning>
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
