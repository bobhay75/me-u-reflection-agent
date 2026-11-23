# Me+U — The Reflection Agent

Me + U = 3: me, you, and the relationship we create between us.

This is a runnable web reflection prototype with five lenses: ME, U, US, WITNESS, and WHAT NEXT. The default guided prompts run entirely in the browser. They are general questions, not a personalized analysis or verification of the user's account. Nothing in the default flow is saved or sent to a model.

## Run a clean checkout

Node 22.13 or later is required. The lockfile is committed.

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run smoke
npm start -- --hostname 127.0.0.1 --port 3000
```

The production command runs a standalone Node server. A static-only cPanel account cannot execute the API route; use a configured Node application/reverse proxy or keep the browser-only guided experience. This checkout no longer imports missing private Sites build plugins or nonexistent hosting bindings. The old `worker/` adapter remains historical reference, excluded from the standalone TypeScript project. It is not a tested Cloudflare deployment path.

## Optional cloud reflection

Copy `.env.example` to `.env` or configure server environment variables through your hosting service. Supply both `GEMINI_API_KEY` and `GEMINI_MODEL` on the server. Choose a currently supported `generateContent` model for the actual Google project; this repair does not assume a retired model alias is still available.

- Manage the provider key: https://aistudio.google.com/apikey
- Current model catalog: https://aistudio.google.com/docs/models
- Key handling: https://aistudio.google.com/docs/api-key

The optional checkbox explains that the submitted story is sent to this server and Google. The key is sent upstream in `x-goog-api-key`, never placed in the request URL or exposed to the client. This code does not intentionally log or persist story content. Provider retention and the hosting platform's own logging are separate configuration choices that must be reviewed before a public service collects sensitive material.

Cloud inputs are bounded to 8,000 characters, request bodies to 48 KiB, responses to 64 KiB, model output to 1,600 tokens, and upstream calls to 15 seconds. Each server process permits at most two simultaneous cloud requests and 12 attempts per minute. Forwarded IP headers cannot reset this budget. Public commercial use still needs identity, durable shared abuse/cost controls, provider configuration, privacy/retention terms, and real-browser acceptance. These process limits are for a constrained prototype, not a distributed public-service quota system.

Unavailable credentials, model errors, and malformed model output are explicitly labeled as general guided prompts. The old hard-coded example claiming "no reply since yesterday" for every user's story has been removed. A limited direct-harm phrase check switches to immediate-human-support language before calling a model; it is not clinical triage and does not identify every urgent situation.

## Validation — 2026-11-23

- `npm run typecheck`: passed.
- `npm test`: seven cases passed, including consent/no-key behavior, malformed input, urgent-risk bypass, provider schema checks, private response headers, failed-provider labeling, and forwarding-header-resistant request budget.
- `npm run build`: all five Vinext build stages passed.
- `npm run smoke`: a real production server passed rendered-home, consent text, encoding, favicon, invalid JSON, unconfigured-cloud fallback, and no-store header checks.
- Local Chromium could not launch because the execution environment denies its required process socket. Keyboard/mobile layout, screen readers, and cloud requests with a live key are not claimed verified.

The runtime intentionally offers no payments, account system, journal persistence, clinical service, or verified relationship judgments. Public project information belongs at https://bobsome1.com.

### Dependency repair

The recovered checkout's audit reported six advisory entries, including critical React Server Components issues. The verified build now uses Vinext 1.4.6, Vite 8.3.8, matching React/React DOM/RSC 19.3.1, and the compatible RSC plugin. Unused database/Cloudflare/template tooling was removed from this standalone deployment. A narrow `fflate: 0.7.5` override fixes the inherited malformed-ZIP64 loop without downgrading the framework. After the upgrades, the complete `npm audit` returned zero reported vulnerabilities on 2026-11-23; build, typecheck, seven regressions, and production HTTP smoke were rerun successfully. This records the current advisory scan, not a guarantee against unknown vulnerabilities.
