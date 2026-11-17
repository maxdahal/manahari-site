import "@/styles/entry-case.css"
import { SiteDocument } from "@/components/site/document"

/* The case studies that use the reading hierarchy from the Asian's long screenshot (Surgical Console) */
export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument bodyClass="cp-page a-page pv cs cm cs-ref" caseFonts>
      {children}
    </SiteDocument>
  )
}
