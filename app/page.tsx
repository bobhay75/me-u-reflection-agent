
"use client";

import { useMemo, useState } from "react";

type Lens = "ME" | "U" | "US" | "WITNESS" | "WHAT NEXT";

const lenses: Array<{ key: Lens; label: string; prompt: string }> = [
  { key: "ME", label: "ME", prompt: "What are you feeling, and what part is yours to own?" },
  { key: "U", label: "U", prompt: "What might the other person be experiencing? Keep it possibleâ€”not certain." },
  { key: "US", label: "US", prompt: "What pattern is forming between you?" },
  { key: "WITNESS", label: "WITNESS", prompt: "What does the record actually support?" },
  { key: "WHAT NEXT", label: "WHAT NEXT?", prompt: "What response protects the relationship and your boundaries?" },
];

const demo = {
  ME: "You feel dismissed and anxious. Your responsibility is to slow down before deciding what the silence means.",
  U: "They may be overwhelmed, distracted, or unsure how to respond. Their motive is unknown.",
  US: "A silence â†’ assumption â†’ escalation loop may be forming between you.",
  WITNESS: "Fact: no reply since yesterday. Inference: they do not care. Unknown: why they have not replied.",
  "WHAT NEXT": "Send one calm check-in, name your need without accusation, and leave room for an explanation.",
};

export default function Home() {
  const [story, setStory] = useState("");
  const [active, setActive] = useState<Lens>("ME");
  const [results, setResults] = useState<Record<Lens, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"guided demo" | "Gemini">("guided demo");

  const current = useMemo(() => lenses.find((lens) => lens.key === active)!, [active]);

  async function reflect() {
    setLoading(true);
    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await response.json();
      setResults(data.reflection ?? demo);
      setMode(data.mode === "gemini" ? "Gemini" : "guided demo");
      setActive("ME");
    } catch {
      setResults(demo);
      setMode("guided demo");
    } finally {
      setLoading(false);
    }
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
        <p className="heroCopy">Me+U helps you separate what happened from what you felt, assumed, and still donâ€™t knowâ€”so your next response builds clarity instead of conflict.</p>
        <div className="equation" aria-label="Me plus U equals three">
          <div><strong>ME</strong><small>my inner world</small></div><b>+</b><div><strong>U</strong><small>your possible view</small></div><b>=</b><div className="third"><strong>3</strong><small>the relationship</small></div>
        </div>
        <a className="primary" href="#try">Run it through Me+U <span>â†˜</span></a>
      </section>

      <section className="marquee" aria-hidden="true"><div>FACTS <span>â€¢</span> FEELINGS <span>â€¢</span> ASSUMPTIONS <span>â€¢</span> UNKNOWNS <span>â€¢</span> WHAT NEXT <span>â€¢</span> FACTS <span>â€¢</span> FEELINGS</div></section>

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
            <textarea id="story" value={story} onChange={(event) => setStory(event.target.value)} placeholder="I saidâ€¦ they saidâ€¦ and now Iâ€™m feelingâ€¦" />
            <div className="inputActions"><button className="textButton" onClick={loadExample}>Load an example</button><span>{story.length} characters</span></div>
            <button className="reflect" onClick={reflect} disabled={loading || story.trim().length < 20}>{loading ? "Looking through five lensesâ€¦" : "Reflect before I respond"}</button>
          </div>
          <div className="outputSide">
            {!results ? <div className="emptyState"><div className="orb">+</div><p>Your reflection will appear hereâ€”not a verdict, but a clearer view.</p></div> : <>
              <div className="resultMeta"><span>REFLECTION</span><span className="mode">{mode}</span></div>
              <div className="tabs" role="tablist">{lenses.map((lens) => <button key={lens.key} role="tab" aria-selected={active === lens.key} onClick={() => setActive(lens.key)}>{lens.label}</button>)}</div>
              <div className="result"><span>{current.prompt}</span><p>{results[active]}</p></div>
              <div className="anchor"><b>ANCHOR</b><span>Facts are observations. Motives remain unknown until confirmed.</span></div>
            </>}
          </div>
        </div>
      </section>

      <section className="principles" id="principles">
        <div className="statement"><span>03 / BUILT FOR HUMAN JUDGMENT</span><blockquote>â€œThe agent doesnâ€™t decide who is right. It helps you see what is yours, what is theirs, and what the record supports.â€</blockquote></div>
        <div className="guardrails"><article><b>NO MIND READING</b><p>Possibilities are labeled as possibilitiesâ€”not facts.</p></article><article><b>NO DIAGNOSIS</b><p>Me+U supports reflection. It is not therapy or crisis care.</p></article><article><b>YOUR CHOICE</b><p>The agent offers perspective; you decide what happens next.</p></article></div>
      </section>

      <footer><a className="brand" href="#top"><span>ME</span><b>+</b><span>U</span></a><p>Understand me. Understand U. Protect the third.</p><small>Hackathon prototype â€¢ 2026</small></footer>
    </main>
  );
}

