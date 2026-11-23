import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms | Me+U", description: "Responsible-use terms for the Me+U worksheet." };

export default function TermsPage() {
  return <InfoPage eyebrow="TERMS" title="A reflection aid, not an authority." intro="Use Me+U to organize your own thinking. Do not use it as proof, diagnosis, professional advice, or a command to confront someone.">
    <section><h2>Product scope</h2><p>Me+U is a free public-beta worksheet. It assembles only the text you enter. It does not verify events, determine motives, decide fault, diagnose anyone, or provide therapy, medical, legal, financial, or crisis services.</p></section>
    <section><h2>Your decisions</h2><p>You remain responsible for what you enter, copy, share, and act on. Treat every interpretation as unverified until reliable evidence or direct confirmation supports it.</p></section>
    <section><h2>Safety comes first</h2><p>No relationship-preserving exercise should override safety. If there are threats, coercion, stalking, abuse, self-harm, or immediate danger, stop the worksheet and seek qualified help through the <a href="/safety">safety page</a>.</p></section>
    <section><h2>Availability</h2><p>The public beta is provided as available and may change. There is no paid Me+U plan, membership, recurring charge, promised outcome, or guaranteed availability on this site.</p></section>
    <section><h2>Operator</h2><p>Me+U is presented by Project Unveiled / Bobsome1. Email <a href="mailto:thebobsomest1@gmail.com?subject=Me%2BU%20terms%20question">thebobsomest1@gmail.com</a> with a product or terms question.</p></section>
  </InfoPage>;
}
