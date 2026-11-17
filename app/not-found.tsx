import Link from "next/link";
import { Header, Footer } from "@/components/Shell";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="wrap nf">
        <h1 className="h2">This page could not be found.</h1>
                <div className="actions" style={{ marginTop: 28 }}>
          <Link prefetch={false} className="btn btn--primary" href="/#work">See case studies</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
