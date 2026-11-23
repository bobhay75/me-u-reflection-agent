"use client";

import { useMemo, useState } from "react";
import { localReflection, validReflection } from "../lib/reflection.mjs";

type Lens = "ME" | "U" | "US" | "WITNESS" | "WHAT NEXT";

const lenses: Array<{ key: Lens; label: string; prompt: string }> = [
  { key: "ME", label: "ME", prompt: "What are you feeling, and what part is yours to own?" },
  { key: "U", label: "U", prompt: "What might the other person be experiencing? Keep it possible—not certain." },
  { key: "US", label: "US", prompt: "What pattern is forming between you?" },
  { key: "WITNESS", label: "WITNESS", prompt: "What does the record actually support?" },
  { key: "WHAT NEXT", label: "WHAT NEXT?", prompt: "What response protects the relationship and your boundaries?" },
];



export default function Home() {
  const [story, setStory] = useState("");
  const [active, setActive] = useState<Lens>("ME");
  const [results, setResults] = useState<Record<Lens, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("guided prompts");
  const [cloud, setCloud] = useState(false);
  const [notice, setNotice] = useState("");

  const current = useMemo(() => lenses.find((lens) => lens.key === active)!, [active]);

  async function reflect() {
    if (loading || story.trim().length < 20) return;
    const fallback = localReflection(story);
    setLoading(true);
    try {
      let data = fallback;
      if (cloud && fallback.mode !== 'safety') {
        const response = await fetch('/api/reflect', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story, cloud: true }), signal: AbortSignal.timeout(25000),
        });
        const received = await response.json();
        if (!response.ok) throw new Error(received.error || 'Cloud reflection could not complete.');
        if (!validReflection(received.reflection)) throw new Error('Cloud returned an incomplete reflection.');
        data = received;
      }
      setResults(data.reflection);
      setMode(data.mode === 'gemini' ? 'Gemini' : data.mode === 'safety' ? 'human support' : 'guided prompts');
      setNotice(data.notice);
      setActive('ME');
    } catch (error) {
      setResults(fallback.reflection); setMode('guided prompts');
      setNotice((error instanceof Error ? error.message : 'Cloud reflection is unavailable.') + ' General guided prompts are shown instead.');
    } finally { setLoading(false); }
  }

  function loadExample() {
    setStory("I sent an important message yesterday and still have not received a reply. I feel ignored and I am ready to send an angry follow-up.");
    setResults(null);
  }

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Me plus U home"><span>ME</span><b>+</b><span>U</span></a>
        <div className="navlinks"><a href="#how">How it works</a><a href="#principles">Principles</a><a className="navCta" href="#try">Try the reflection</a></div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="pulse" /> A collaborative reflection agent</div>
        <h1>Before you react,<br /><em>see the whole picture.</em></h1>
        <p className="heroCopy">Me+U helps you separate what happened from what you felt, assumed, and still don’t know—so your next response builds clarity instead of conflict.</p>
        <div className="equation" aria-label="Me plus U equals three">
          <div><strong>ME</strong><small>my inner world</small></div><b>+</b><div><strong>U</strong><small>your possible view</small></div><b>=</b><div className="third"><strong>3</strong><small>the relationship</small></div>
        </div>
        <a className="primary" href="#try">Run it through Me+U <span>↘</span></a>
      </section>

      <section className="marquee" aria-hidden="true"><div>FACTS <span>•</span> FEELINGS <span>•</span> ASSUMPTIONS <span>•</span> UNKNOWNS <span>•</span> WHAT NEXT <span>•</span> FACTS <span>•</span> FEELINGS</div></section>

      <section className="how" id="how">
        <div className="sectionIntro"><span>01 / THE METHOD</span><h2>Five lenses.<br />One clearer choice.</h2></div>
        <div className="lensGrid">
          {lenses.map((lens, index) => <article key={lens.key}><span>0{index + 1}</span><h3>{lens.label}</h3><p>{lens.prompt}</p></article>)}
        </div>
      </section>

      <section className="workspace" id="try">
        <div className="workspaceHead"><span>02 / TRY IT</span><h2>What happened?</h2><p>Describe the situation in your own words. Avoid names or sensitive identifying details.</p></div>
        <div className="agentPanel">
          <div className="inputSide">
            <label htmlFor="story">THE MOMENT</label>
            <textarea id="story" maxLength={8000} disabled={loading} value={story} onChange={(event) => { setStory(event.target.value); setResults(null); setNotice(""); }} placeholder="I said… they said… and now I’m feeling…" />
            <div className="inputActions"><button className="textButton" disabled={loading} onClick={loadExample}>Load an example</button><span>{story.length} characters</span></div>
            <label className="consent"><input type="checkbox" disabled={loading} checked={cloud} onChange={(event) => setCloud(event.target.checked)} /> Use optional cloud AI</label>
            <p className="privacyNote">{cloud ? 'Submitting sends this story to the server and Google Gemini for analysis. Avoid names and identifying details. The app does not save your story.' : 'Guided prompts run in this browser. Your story is not sent to the server or saved by this app.'}</p>
            <button className="reflect" onClick={reflect} disabled={loading || story.trim().length < 20}>{loading ? "Looking through five lenses…" : "Reflect before I respond"}</button>
          </div>
          <div className="outputSide">
            {!results ? <div className="emptyState"><div className="orb">+</div><p>Your reflection will appear here—not a verdict, but a clearer view.</p></div> : <>
              <p className="resultNotice" role="status">{notice}</p>
              <div className="resultMeta"><span>REFLECTION</span><span className="mode">{mode}</span></div>
              <div className="tabs" role="tablist">{lenses.map((lens) => <button key={lens.key} role="tab" aria-selected={active === lens.key} onClick={() => setActive(lens.key)}>{lens.label}</button>)}</div>
              <div className="result"><span>{current.prompt}</span><p>{results[active]}</p></div>
              <div className="anchor"><b>ANCHOR</b><span>Facts are observations. Motives remain unknown until confirmed.</span></div>
            </>}
          </div>
        </div>
      </section>

      <section className="principles" id="principles">
        <div className="statement"><span>03 / BUILT FOR HUMAN JUDGMENT</span><blockquote>“The agent doesn’t decide who is right. It helps you see what is yours, what is theirs, and what the record supports.”</blockquote></div>
        <div className="guardrails"><article><b>NO MIND READING</b><p>Possibilities are labeled as possibilities—not facts.</p></article><article><b>NO DIAGNOSIS</b><p>Me+U supports reflection. It is not therapy or crisis care.</p></article><article><b>YOUR CHOICE</b><p>The agent offers perspective; you decide what happens next.</p></article></div>
      </section>

      <footer><a className="brand" href="#top"><span>ME</span><b>+</b><span>U</span></a><p>Understand me. Understand U. Protect the third.</p><small>Reflection prototype • <a href="https://bobsome1.com">Bobsome1</a></small></footer>
    </main>
  );
}
