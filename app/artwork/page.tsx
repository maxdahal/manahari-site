import type { Metadata } from "next";
import { Header, Footer } from "@/components/Shell";
import { ArtGallery } from "@/components/ArtGallery";
import { artwork } from "@/content/profile";

export const metadata: Metadata = { title: "Artwork", description: "Art I make for fun" };

export default function Artwork() {
  return (
    <>
      <Header current="Artwork" />
      <main id="main" className="wrap">
        <div className="section__head" style={{ paddingTop: "clamp(48px, 7vw, 96px)" }}>
          <h1 className="h2">Artwork</h1>
          <p>Art I make for fun</p>
        </div>
        <ArtGallery items={artwork} />
      </main>
      <Footer />
    </>
  );
}
