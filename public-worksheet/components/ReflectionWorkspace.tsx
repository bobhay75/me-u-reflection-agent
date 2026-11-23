"use client";

import { useMemo, useRef, useState } from "react";
import {
  buildSummary,
  cleanText,
  completedLensCount,
  DEMO_WORKSHEET,
  emptyWorksheet,
  FIELD_MAX,
  LENSES,
  STORY_MAX,
  STORY_MIN,
} from "@/lib/reflection.mjs";

type LensKey = "me" | "u" | "us" | "witness" | "next";
type Stage = "start" | "worksheet" | "summary";

type Worksheet = {
  story: string;
  feelings: string;
  withinControl: string;
  possibleView: string;
  sharedPattern: string;
  observation: string;
  inference: string;
  unknown: string;
  boundary: string;
  nextStep: string;
};

const lensKeys = LENSES.map((lens) => lens.key) as LensKey[];

export default function ReflectionWorkspace() {
  const [worksheet, setWorksheet] = useState<Worksheet>(() => emptyWorksheet() as Worksheet);
  const [stage, setStage] = useState<Stage>("start");
  const [activeLens, setActiveLens] = useState<LensKey>("me");
  const [clearArmed, setClearArmed] = useState(false);
  const [exampleArmed, setExampleArmed] = useState(false);
  const [status, setStatus] = useState("Private worksheet ready. Nothing has been sent anywhere.");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const storyLength = worksheet.story.trim().length;
  const completed = completedLensCount(worksheet);
  const summary = useMemo(() => buildSummary(worksheet), [worksheet]);

  function update<K extends keyof Worksheet>(key: K, value: Worksheet[K]) {
    const max = key === "story" ? STORY_MAX : FIELD_MAX;
    setWorksheet((current) => ({ ...current, [key]: value.slice(0, max) }));
    setClearArmed(false);
    setExampleArmed(false);
    if (stage === "summary") setStage("worksheet");
    setStatus("Saved only in this open browser tab.");
  }

  function begin() {
    if (storyLength < STORY_MIN) {
      setStatus(`Add at least ${STORY_MIN} characters before opening the worksheet.`);
      return;
    }
    setWorksheet((current) => ({
      ...current,
      story: cleanText(current.story, STORY_MAX),
    }));
    setStage("worksheet");
    setActiveLens("me");
    setClearArmed(false);
    setExampleArmed(false);
    setStatus("Worksheet opened. Your text remains in this tab and is not uploaded.");
  }

  function loadExample() {
    if (Object.values(worksheet).some((value) => value.length > 0) && !exampleArmed) {
      setExampleArmed(true);
      setClearArmed(false);
      setStatus("Your worksheet has content. Activate “Confirm example replacement” to replace it with the fictional example, or keep your worksheet.");
      return;
    }
    setWorksheet({ ...DEMO_WORKSHEET } as Worksheet);
    setStage("summary");
    setActiveLens("me");
    setClearArmed(false);
    setExampleArmed(false);
    setStatus("Built-in fictional example loaded locally. No data was sent.");
  }

  function clearAll() {
    setExampleArmed(false);
    if (!clearArmed) {
      setClearArmed(true);
      setStatus("Clear is armed. Activate “Confirm clear” to erase every worksheet field from this tab.");
      return;
    }
    setWorksheet(emptyWorksheet() as Worksheet);
    setStage("start");
    setActiveLens("me");
    setClearArmed(false);
    setStatus("Worksheet cleared from this tab.");
  }

  async function copySummary() {
    setClearArmed(false);
    setExampleArmed(false);
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Reflection copied to your device clipboard. Clear it there when finished.");
    } catch {
      setStatus("Clipboard access was blocked. Select the summary and copy it manually.");
    }
  }

  function showSummary() {
    setClearArmed(false);
    setExampleArmed(false);
    setStage("summary");
    setStatus(
      completed === 5
        ? "Five-lens summary assembled locally."
        : `Summary assembled locally with ${completed} of 5 lenses complete.`,
    );
  }

  function moveTab(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % lensKeys.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + lensKeys.length) % lensKeys.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = lensKeys.length - 1;
    else return;
    event.preventDefault();
    setClearArmed(false);
    setExampleArmed(false);
    setActiveLens(lensKeys[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="workspace" id="try" aria-labelledby="workspace-title">
      <div className="workspace-head">
        <div>
          <span className="kicker">PRIVATE BROWSER WORKSHEET</span>
          <h2 id="workspace-title">Slow the moment down.</h2>
        </div>
        <div className="privacy-promise" role="note">
          <strong>Nothing you type is submitted.</strong>
          <span>No account, AI provider, analytics script, or story database is connected.</span>
          <span>Refreshing or leaving this page clears the worksheet. Copy your summary to keep it.</span>
        </div>
      </div>

      <div className="tool-shell">
        <div className="tool-status">
          <span className="status-dot" aria-hidden="true" />
          <span>LOCAL-ONLY PUBLIC BETA</span>
          <span className="progress-label">{completed}/5 lenses complete</span>
        </div>

        <div className="tool-body">
          <div className="story-panel">
            <label htmlFor="story">What happened, in your own words?</label>
            <p id="story-help">Use observable details. Leave out names, addresses, account numbers, and other identifying information.</p>
            <textarea
              id="story"
              value={worksheet.story}
              onChange={(event) => update("story", event.target.value)}
              aria-describedby="story-help story-count privacy-confirmation"
              aria-invalid={storyLength > 0 && storyLength < STORY_MIN}
              maxLength={STORY_MAX}
              placeholder="I observed… I felt… I started to assume…"
            />
            <div className="input-meta">
              <span id="privacy-confirmation">Stays in this tab</span>
              <span id="story-count">{worksheet.story.length}/{STORY_MAX}</span>
            </div>
            <div className="button-row">
              <button type="button" className="secondary-button" onClick={loadExample}>{exampleArmed ? "Confirm example replacement" : "Show fictional example"}</button>
              {stage === "start" ? (
                <button type="button" className="primary-button" onClick={begin} disabled={storyLength < STORY_MIN}>Open five lenses</button>
              ) : (
                <button type="button" className="danger-button" onClick={clearAll}>{clearArmed ? "Confirm clear" : "Clear this tab"}</button>
              )}
              {clearArmed || exampleArmed ? <button type="button" className="secondary-button" onClick={() => { setClearArmed(false); setExampleArmed(false); setStatus("Your worksheet remains unchanged."); }}>Keep my worksheet</button> : null}
            </div>
          </div>

          {stage !== "start" ? (
            <div className="lens-panel">
              {stage === "worksheet" ? <div className="tabs" role="tablist" aria-label="Reflection lenses">
                {LENSES.map((lens, index) => (
                  <button
                    key={lens.key}
                    ref={(element) => { tabRefs.current[index] = element; }}
                    id={`tab-${lens.key}`}
                    type="button"
                    role="tab"
                    aria-selected={activeLens === lens.key}
                    aria-controls={`panel-${lens.key}`}
                    tabIndex={activeLens === lens.key ? 0 : -1}
                    onClick={() => { setActiveLens(lens.key as LensKey); setStage("worksheet"); setClearArmed(false); setExampleArmed(false); }}
                    onKeyDown={(event) => moveTab(event, index)}
                  >
                    {lens.short}
                  </button>
                ))}
              </div> : null}

              {stage === "summary" ? (
                <section className="summary-card" aria-labelledby="summary-title">
                  <span className="kicker">DERIVED ONLY FROM YOUR WORDS</span>
                  <h3 id="summary-title">Your five-lens reflection</h3>
                  <p className="verification-note">Me+U did not independently verify events or infer anyone&apos;s motives.</p>
                  <pre>{summary}</pre>
                  <div className="button-row">
                    <button type="button" className="secondary-button" onClick={() => { setStage("worksheet"); setClearArmed(false); setExampleArmed(false); }}>Keep editing</button>
                    <button type="button" className="primary-button" onClick={copySummary}>Copy to clipboard</button>
                  </div>
                </section>
              ) : (
                <div
                  className="lens-fields"
                  id={`panel-${activeLens}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeLens}`}
                  tabIndex={0}
                >
                  <LensFields active={activeLens} worksheet={worksheet} update={update} />
                  <div className="lens-footer">
                    <span>Finish every field you can; uncertainty is a valid answer.</span>
                    <button type="button" className="primary-button" onClick={showSummary}>Assemble my summary</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-panel">
              <div className="orb" aria-hidden="true">+</div>
              <h3>A worksheet, not a verdict.</h3>
              <p>Open the five lenses to write your own distinctions. Me+U does not generate facts, diagnose people, or decide who is right.</p>
            </div>
          )}
        </div>
      </div>

      <p className="live-status" role="status" aria-live="polite">{status}</p>
      <aside className="safety-strip">
        <strong>Safety overrides symmetry.</strong>
        <span>If there are threats, coercion, stalking, abuse, self-harm, or immediate danger, do not force a shared-blame exercise. Use the <a href="/safety">safety resources</a>.</span>
      </aside>
    </section>
  );
}

type FieldProps = {
  active: LensKey;
  worksheet: Worksheet;
  update: <K extends keyof Worksheet>(key: K, value: Worksheet[K]) => void;
};

function LensFields({ active, worksheet, update }: FieldProps) {
  if (active === "me") {
    return <>
      <LensHeading number="01" title="ME" copy="Notice your feelings without treating them as proof. Focus on the response that remains within your control." />
      <TextField id="feelings" label="What do I notice in myself?" value={worksheet.feelings} onChange={(value) => update("feelings", value)} placeholder="I feel… My body is telling me…" />
      <TextField id="within-control" label="What is within my control?" value={worksheet.withinControl} onChange={(value) => update("withinControl", value)} placeholder="I can pause, ask, leave, document, set a boundary…" />
    </>;
  }
  if (active === "u") {
    return <>
      <LensHeading number="02" title="U" copy="List plausible explanations as possibilities. You cannot know another person’s motive without reliable evidence or confirmation." />
      <TextField id="possible-view" label="What are two or more possible explanations?" value={worksheet.possibleView} onChange={(value) => update("possibleView", value)} placeholder="They may… Another possibility is… I do not know…" />
    </>;
  }
  if (active === "us") {
    return <>
      <LensHeading number="03" title="US" copy="Name a possible loop between actions and reactions. A pattern does not mean both people hold equal power or responsibility." />
      <TextField id="shared-pattern" label="What interaction loop might be forming?" value={worksheet.sharedPattern} onChange={(value) => update("sharedPattern", value)} placeholder="When X happens, I tend to Y, which may lead to Z…" />
    </>;
  }
  if (active === "witness") {
    return <>
      <LensHeading number="04" title="WITNESS" copy="Keep the observed record separate from your interpretation and from what is still unknown." />
      <TextField id="observation" label="Directly observed" value={worksheet.observation} onChange={(value) => update("observation", value)} placeholder="What a camera, message log, or neutral witness could establish…" compact />
      <TextField id="inference" label="My inference" value={worksheet.inference} onChange={(value) => update("inference", value)} placeholder="The meaning or motive I started adding…" compact />
      <TextField id="unknown" label="Still unknown" value={worksheet.unknown} onChange={(value) => update("unknown", value)} placeholder="What I would need to ask, check, or leave unresolved…" compact />
    </>;
  }
  return <>
    <LensHeading number="05" title="WHAT NEXT?" copy="Choose the smallest step that protects safety, dignity, boundaries, and options. No relationship must be preserved at the cost of safety." />
    <TextField id="boundary" label="What boundary or request is clear and within my control?" value={worksheet.boundary} onChange={(value) => update("boundary", value)} placeholder="I need… I will… If this continues, I will…" />
    <TextField id="next-step" label="What is the smallest safe next step?" value={worksheet.nextStep} onChange={(value) => update("nextStep", value)} placeholder="Pause, document, ask one question, seek support, leave…" />
  </>;
}

function LensHeading({ number, title, copy }: { number: string; title: string; copy: string }) {
  return <header className="lens-heading"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></header>;
}

function TextField({ id, label, value, onChange, placeholder, compact = false }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  return <div className="field-group">
    <label htmlFor={id}>{label}</label>
    <textarea
      id={id}
      className={compact ? "compact" : undefined}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      maxLength={FIELD_MAX}
    />
    <span className="field-count">{value.length}/{FIELD_MAX}</span>
  </div>;
}
