import { Header, Footer } from "@/components/Shell";
import { HeroStage } from "@/components/HeroStage";
import { WorkIndex } from "@/components/WorkIndex";
import { Timeline } from "@/components/Timeline";
import { ArtGallery } from "@/components/ArtGallery";
import { AboutSection } from "@/components/AboutSection";
import { AvailabilityRail } from "@/components/AvailabilityRail";
import { cases } from "@/content/cases";
import { artwork, profile } from "@/content/profile";

/* order of the case studies on the homepage */
const HOME_ORDER = ["surgical-console", "ku-brand", "luminary", "asians", "esri"];

/* the hero's drifting cards: artwork, with a few work pictures mixed in */
const T = (f: string) => `/images/thumbs/${f}.jpg`;
const HERO_PICS = [
  { src: T("index-03-f2827196b8"), w: 640, h: 545 },
  { src: T("hero-ku-brand-02-b29a48186b"), w: 520, h: 371 },
  { src: T("index-05-7eab617767"), w: 512, h: 640 },
  { src: T("index-09-17d8af1698"), w: 640, h: 480 },
  { src: T("hero-asians-07-c40b497de9"), w: 520, h: 219 },
  { src: T("index-06-bdfabfe408"), w: 490, h: 640 },
  { src: T("index-02-bf139d0c00"), w: 640, h: 640 },
  { src: T("index-07-8517c6c4d5"), w: 490, h: 640 },
  { src: T("hero-card-console"), w: 520, h: 292 },
  { src: T("index-04-e40c5c0484"), w: 640, h: 452 },
  { src: T("index-08-ca15fe9d96"), w: 512, h: 640 },
  { src: T("index-11-424bf2862f"), w: 588, h: 640 },
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroStage
          status={profile.status}
          resume={profile.resume}
          pics={HERO_PICS}
        />

        <WorkIndex
          items={HOME_ORDER.map((slug) => cases.find((c) => c.slug === slug)!).map((c) => {
            const pic = c.card ?? c.cover;
            return { slug: c.slug, title: c.title, years: c.years, short: c.short, accent: c.accent, pic: { src: pic.src, w: pic.w, h: pic.h }, contain: pic.src.endsWith(".svg") || c.slug === "esri" };
          })}
        />

        <AboutSection />

        <section className="wrap section" id="experience" aria-labelledby="career-h">
          <div className="section__head">
            <h2 className="h2" id="career-h">Experience</h2>
          </div>
          <Timeline />
        </section>

        <section className="section section--art" id="artwork" aria-labelledby="art-h">
          {/* every piece, flown through on scroll; full-size files, since each one comes up large */}
          <ArtGallery layout="dolly" title="Artwork" sub="Art I make for fun" items={artwork} />
        </section>
      </main>
      <AvailabilityRail status={profile.status} />
      <Footer />
    </>
  );
}
