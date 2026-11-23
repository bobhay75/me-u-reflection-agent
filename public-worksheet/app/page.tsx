import ReflectionWorkspace from "@/components/ReflectionWorkspace";
import Link from "next/link";

const siteOrigin = "https://me-u-reflection-agent.thebobsomest1.chatgpt.site";

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Me+U Private Reflection Worksheet",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web browser",
  url: siteOrigin,
  description:
    "A free, local-only five-lens worksheet for separating observations, feelings, inferences, unknowns, boundaries, and next steps.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  creator: {
    "@type": "Organization",
    name: "Project Unveiled / Bobsome1",
  },
};

const lenses = [
  ["01", "ME", "Name feelings without turning them into evidence. Identify what remains within your control."],
  ["02", "U", "Consider possibilities without claiming to know another person’s motive."],
  ["03", "US", "Notice a possible interaction loop without assuming equal power or responsibility."],
  ["04", "WITNESS", "Separate what was observed from what was inferred and what remains unknown."],
  ["05", "WHAT NEXT?", "Choose a small step that protects safety, dignity, boundaries, and options."],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to the worksheet</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Me plus U home"><span>ME</span><b aria-hidden="true">+</b><span>U</span></Link>
        <nav aria-label="Primary navigation">
          <a href="#try">Worksheet</a>
          <a href="#method">Method</a>
          <a href="/safety">Safety</a>
          <a className="nav-cta" href="#try">Try it free</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" aria-hidden="true" /> FREE · PRIVATE · LOCAL-ONLY</span>
            <h1 id="hero-title">Before you react,<br /><em>separate what you know.</em></h1>
            <p>Me+U is a five-lens reflection worksheet for tense moments. It helps you distinguish observations, feelings, inferences, unknowns, boundaries, and a safer next step.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#try">Open the worksheet</a>
              <div className="proof-pill" role="note" aria-label="Product data boundary">
                <strong>0</strong><span>story uploads</span>
              </div>
            </div>
          </div>
          <div className="equation-card" aria-label="Me plus U includes the relationship between us">
            <span>ME</span><b>+</b><span>U</span><b>=</b><span className="third">US</span>
            <p>Three viewpoints worth protecting—unless safety requires distance.</p>
          </div>
        </section>

        <ReflectionWorkspace />

        <section className="method" id="method" aria-labelledby="method-title">
          <div className="section-heading">
            <span className="kicker">THE METHOD</span>
            <h2 id="method-title">Five distinctions.<br />One clearer choice.</h2>
            <p>No model decides who is right. You write every answer, and Me+U assembles only what you entered.</p>
          </div>
          <div className="lens-grid">
            {lenses.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="truth-section" aria-labelledby="truth-title">
          <div>
            <span className="kicker">PRODUCT TRUTH</span>
            <h2 id="truth-title">Useful without pretending to know.</h2>
          </div>
          <div className="truth-grid">
            <article><strong>What it does</strong><p>Structures your own reflection and makes uncertainty visible.</p></article>
            <article><strong>What it does not do</strong><p>Verify events, infer motives, diagnose people, provide therapy, or replace legal or crisis support.</p></article>
            <article><strong>Where data goes</strong><p>Worksheet text stays in the current tab. Copying moves it to your device clipboard.</p></article>
            <article><strong>Current status</strong><p>Public beta. The private worksheet is free; no checkout or subscription is presented.</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><Link className="brand" href="/"><span>ME</span><b aria-hidden="true">+</b><span>U</span></Link><p>A Project Unveiled / Bobsome1 public beta.</p></div>
        <nav aria-label="Policies and information"><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/safety">Safety</a><a href="https://bobsome1.com">Bobsome1</a><a href="mailto:thebobsomest1@gmail.com?subject=Me%2BU%20product%20question">Contact</a></nav>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
