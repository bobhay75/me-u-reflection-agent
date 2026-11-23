import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Safety | Me+U", description: "When to stop reflection and seek immediate or qualified support." };

export default function SafetyPage() {
  return <InfoPage eyebrow="SAFETY" title="Safety overrides symmetry." intro="Me+U is not for deciding how to confront someone when there is danger, abuse, coercion, stalking, or a self-harm crisis.">
    <section><h2>Immediate danger</h2><p>If you or someone else is in immediate danger, call your local emergency number. In the United States, call 911. Use a safer device if you think your internet activity is being monitored.</p></section>
    <section><h2>Suicide or emotional crisis — United States</h2><p>Call or text <a href="tel:988">988</a>, or use <a href="https://988lifeline.org/" rel="noreferrer">988lifeline.org</a>. The official 988 Suicide &amp; Crisis Lifeline reports that support is available 24/7/365. Outside the United States and its territories, use your country&apos;s official crisis service.</p></section>
    <section><h2>Domestic violence — United States</h2><p>Call the National Domestic Violence Hotline at <a href="tel:+18007997233">800-799-SAFE (7233)</a> or visit <a href="https://www.thehotline.org/get-help/" rel="noreferrer">thehotline.org/get-help</a>. The Hotline warns that internet use can be monitored and may not be completely erasable.</p></section>
    <section><h2>How the worksheet changes</h2><p>Do not force “both sides,” shared blame, direct contact, or reconciliation. Consider documentation, distance, an advocate, a qualified professional, and a safety plan. A worksheet cannot assess your immediate circumstances.</p></section>
  </InfoPage>;
}
