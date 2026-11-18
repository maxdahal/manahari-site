import { Header, Footer } from "@/components/Shell";
import { HeroStage } from "@/components/HeroStage";
import { WorkIndex } from "@/components/WorkIndex";
import { Timeline } from "@/components/Timeline";
import { ArtGallery } from "@/components/ArtGallery";
import { AboutSection } from "@/components/AboutSection";
import { AvailabilityRail } from "@/components/AvailabilityRail";
import { cases } from "@/content/cases";
import { artwork, profile } from "@/content/profile";

/* Card lines and outcomes from the published site, word for word. A
   non-breaking space before each "·" keeps it from dangling at a line end. */
const CARD: Record<string, { desc: string; meta: string; value: string; label: string }> = {
  "surgical-console": { desc: "Designed screens a surgical team can read in one second during live surgery.", meta: "UX design\u00a0·\u00a02026", value: ">50%", label: "Less task-completion time in exploratory usability testing" },
  luminary: { desc: "Designed an accessible campus navigation iOS app for UNC Chapel Hill students, with step-free routing.", meta: "UX design\u00a0·\u00a02025\u00a0to\u00a02026", value: "50+", label: "Student usability testing sessions" },
  "ku-brand": { desc: "Co-led the design of the University of Kansas brand site, part of a rebrand across websites serving 50,000+ users.", meta: "Branding, UX design and research\u00a0·\u00a02022\u00a0to\u00a02025", value: "+30%", label: "Traffic across ku.edu after launch (a team result)" },
  asians: { desc: "Designed a mobile ordering app so restaurant guests could order without language barriers.", meta: "UX research and design\u00a0·\u00a02021\u00a0to\u00a02022", value: "~50", label: "People surveyed" },
  esri: { desc: "Built an internal documentation site for Calcite components, so 20+ designers and developers found answers faster.", meta: "UI/UX design and front-end internship\u00a0·\u00a02021", value: "50%+", label: "Improvement in content discoverability" },
};

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
          items={cases.map((c) => {
            const pic = c.cover;
            const card = CARD[c.slug];
            return { slug: c.slug, title: c.title, meta: card.meta, desc: card.desc, outcome: { value: card.value, label: card.label }, pic: { src: pic.src, w: pic.w, h: pic.h } };
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
