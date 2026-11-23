# Me+U: pause, separate the facts, choose a next step

**Draft for entrant review. No submission or human-review attestation has been made.**

## 1. Users and problem

Me+U is for an adult who wants to think through an everyday tense interaction before responding. The demo uses a fictional workplace example: a meeting time changes, and a person begins to interpret it as exclusion. The worksheet keeps observations, interpretations and unknowns separate and helps the person write a request within their control.

A blank notes app can hold the same words. Me+U adds a visible five-part structure, an editable summary and prompts to avoid asserting another person's motives. This is a product-design rationale, not evidence of improved mental health or relationship outcomes. No user study or clinical validation is claimed.

## 2. Existing work and event contributions

This improves an existing project. The five-lens local-only worksheet, its design, information pages and fictional example existed before the event. The prior Sites source commit was `5c38684` from September 8, 2026.

November 23 contributions include repairing the production framework/Worker dependencies; preventing the example from silently replacing entered work; adding an explicit cancel path; making the refresh-clearing boundary visible before use; testing production routes/security through the real Worker; and adding public source provenance, browser/privacy/accessibility regression coverage and an actual demonstration. The deployed repair is Sites version 3, source commit `511e418cbdc77e42eedcf45099b822226fd5f069`. Its snapshot and subsequent test/demo additions are in `public-worksheet/`.

The root retains an earlier, separate optional-cloud prototype. Its Gemini endpoint is not part of this candidate or the public beta.

## 3. AI and development disclosure

**In the application:** no model runs on a person's story. Entries and the summary stay in browser memory unless the person copies text to their clipboard. The summary assembles entries; it does not invent facts, verify events, diagnose people or assign motives.

**During development:** ChatGPT assisted with implementation, dependency repair, code inspection, test generation, browser operation, debugging and these materials under Robert Hayes's direction. Build, route, text-escaping, keyboard, privacy and browser checks provide engineering evidence. An AI assistant's or test runner's checks are not independent human or clinical review. The entrant must accurately describe their own review before submitting. No sponsor tool use is claimed.

Third-party software includes React, Vinext/Vite, Cloudflare Workers/Wrangler, Tailwind, Playwright, axe-core and FFmpeg. Exact application/test versions are in the lockfiles. These tools and APIs are not represented as original inventions.

## 4. Working task and experience

The demonstrated path is: write context, edit ME/U/US/WITNESS/WHAT NEXT, assemble the summary, copy it, cancel an accidental clear and refresh to verify the stated no-persistence behavior. Arrow keys, Home and End support tab movement. Example replacement and clearing require confirmation when they would discard content.

The summary preserves literal text rather than interpreting markup. The live application was exercised with fictional content. Hosted tests run desktop Chromium, Android-size Chromium and iPhone-size WebKit against the actual built Worker. Viewport/browser emulation does not establish physical-device or screen-reader performance. See `EVIDENCE.md` and the exact CI result for executed checks.

The demo uses real application footage and fictional input. Explanatory captions are added below the application view. There are no simulated model responses, patient results, fabricated testimonials or staged network claims.

## 5. Limits and failure behavior

This free public beta has no accounts, story database, saved journal, paid subscription, runtime AI, diagnosis, crisis triage or promise to establish what happened. Its usefulness has not been measured in a pilot. It is not a clinical intervention or a replacement for a qualified professional.

Refreshing or leaving loses in-page work; that boundary is stated before use. Copying moves text to a device clipboard whose retention the app cannot control. Ordinary hosting/CDN request metadata is separate from story storage. Clipboard failure is reported so the user can select text manually. Replacement and clearing can be canceled. Unsupported story API requests return an error instead of submitting content elsewhere.

Threats, coercion, stalking, abuse, self-harm and immediate danger are outside the worksheet's decision scope. Its safety page links official human-support resources without requiring confrontation, reconciliation or shared blame.

## Entry fields

- Human entrant: Robert Hayes, individual student; confirm the full roster and current eligibility before submission.
- Working project: https://me-u-reflection-agent.thebobsomest1.chatgpt.site/
- Code: https://github.com/bobhay75/me-u-reflection-agent/tree/main/public-worksheet
- Demo: upload the verified `MeU-Actual-Worksheet-Demo.mp4` to an eligible video host; no video URL is asserted here.
- Public project information: https://bobsome1.com
