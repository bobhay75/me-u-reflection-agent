import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy | Me+U", description: "How the Me+U local-only worksheet handles data." };

export default function PrivacyPage() {
  return <InfoPage eyebrow="PRIVACY" title="Your story is not our inventory." intro="Me+U is deliberately designed so worksheet text stays in the open browser tab instead of being submitted to us.">
    <section><h2>Worksheet text</h2><p>The public worksheet has no submit endpoint, account, connected AI provider, analytics script, or story database. Text remains in page memory while the tab is open. Selecting “Clear this tab,” refreshing, or closing the tab removes that in-page state.</p></section>
    <section><h2>Clipboard</h2><p>If you choose “Copy to clipboard,” the assembled reflection moves to your device clipboard. Your operating system, browser, clipboard manager, or another app may retain it. Me+U cannot clear those systems for you.</p></section>
    <section><h2>Ordinary site requests</h2><p>The hosting and delivery infrastructure necessarily processes ordinary request information such as IP address, time, requested path, browser details, and security signals. It may set strictly technical security cookies. We do not claim control over independent infrastructure logs.</p></section>
    <section><h2>Do not enter</h2><p>Do not type full names, addresses, account numbers, medical records, passwords, secrets, or details that could put someone at risk. Use fictional labels when context is necessary.</p></section>
    <section><h2>Questions</h2><p>Email <a href="mailto:thebobsomest1@gmail.com?subject=Me%2BU%20privacy%20question">thebobsomest1@gmail.com</a>. Because worksheet text is not submitted to us, we cannot retrieve or delete a worksheet we never received.</p></section>
  </InfoPage>;
}
