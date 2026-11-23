import type { ReactNode } from "react";
import Link from "next/link";

export default function InfoPage({ eyebrow, title, intro, children }: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return <>
    <a className="skip-link" href="#info-content">Skip to content</a>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Me plus U home"><span>ME</span><b aria-hidden="true">+</b><span>U</span></Link>
      <nav aria-label="Information navigation"><Link href="/">Worksheet</Link><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/safety">Safety</a></nav>
    </header>
    <main className="info-page" id="info-content">
      <header><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>
      <div className="info-sections">{children}</div>
    </main>
    <footer className="site-footer compact-footer"><p>Me+U · A Project Unveiled / Bobsome1 public beta</p><a href="mailto:thebobsomest1@gmail.com?subject=Me%2BU%20product%20question">Contact</a></footer>
  </>;
}
