import "@/styles/entry-case.css"
import { SiteDocument } from "@/components/site/document"

/* The case studies */
export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument bodyClass="cp-page a-page pv cs cm" caseFonts>
      {children}
    </SiteDocument>
  )
}
