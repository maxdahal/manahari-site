import type { Metadata, Viewport } from "next";
import { Urbanist, Work_Sans } from "next/font/google";
import "./globals.css";
import { HashScroll } from "@/components/HashScroll";
import { ScrollFx } from "@/components/ScrollFx";

/* Urbanist for headings and display numbers; Work Sans for everything else. Both variable. */
const display = Urbanist({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Work_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

/* set NEXT_PUBLIC_SITE_URL to the real domain before launch */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Manahari Dahal", template: "%s · Manahari Dahal" },
  description: "Manahari Dahal, a UX and product designer in the US. I design products and build them in code. Case studies: Luna Surgical Console, Luminary, KU Brand, Asian's and Esri Calcite.",
  openGraph: { type: "website", siteName: "Manahari Dahal", images: ["/images/card-console.webp"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7F8" },
    { media: "(prefers-color-scheme: dark)", color: "#15171E" },
  ],
};

/* applies a remembered theme before paint, so there is no flash */
const themeScript = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.classList.add(t)}catch(e){}`;

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manahari Dahal",
  jobTitle: "UX Designer, Product Designer and UX Engineer",
  url: SITE,
  sameAs: ["https://www.linkedin.com/in/manaharidahal/", "https://dribbble.com/manaharidahal"],
  alumniOf: ["University of North Carolina at Chapel Hill", "Brigham Young University-Idaho"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body suppressHydrationWarning>
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <HashScroll />
        <ScrollFx />
      </body>
    </html>
  );
}
