import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "About | Me+U", description: "Method, operator, and status of the Me+U worksheet." };

export default function AboutPage() {
  return <InfoPage eyebrow="ABOUT" title="Clarity without counterfeit certainty." intro="Me+U turns one charged story into five distinctions the user writes and can inspect.">
    <section><h2>The method</h2><p>ME notices feelings and controllable responses. U holds alternative explanations as possibilities. US names a possible interaction loop without assuming equal responsibility. WITNESS separates observation, inference, and unknown. WHAT NEXT names a boundary and the smallest safe step.</p></section>
    <section><h2>Why local-only</h2><p>Relationship stories are sensitive. The current public beta avoids transmitting worksheet content entirely. That design also prevents Me+U from pretending a remote model verified what happened.</p></section>
    <section><h2>Operator</h2><p>Me+U is a Project Unveiled / Bobsome1 experiment in inspectable reasoning tools.</p></section>
    <section><h2>Status</h2><p>The worksheet is free and ready to test. No checkout, membership, professional service, or external AI integration is active here.</p></section>
  </InfoPage>;
}
