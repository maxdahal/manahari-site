import "@/styles/entry-site.css"
import { SiteDocument } from "@/components/site/document"

/* Home and About */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument bodyClass="pv cm">{children}</SiteDocument>
}
