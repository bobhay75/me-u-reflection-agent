# Me+U — private five-lens reflection

Me+U is a free, local-only public-beta worksheet from Project Unveiled / Bobsome1. It helps a person slow down a charged moment and write through five distinctions:

1. **ME** — feelings and responses within the user’s control.
2. **U** — possible explanations, explicitly not asserted motives.
3. **US** — a possible interaction pattern, without assuming equal power or responsibility.
4. **WITNESS** — observed facts, inferences, and unknowns.
5. **WHAT NEXT?** — a boundary or request and the smallest safe next step.

## Honest product boundary

- Worksheet text never leaves the current browser tab.
- There is no story API, AI-provider connection, account, analytics script, or story database.
- Results are assembled only from the user’s own entries. Me+U does not verify events, infer motives, diagnose people, or decide who is right.
- The built-in example is a fixed fictional object loaded locally. It never triggers a request.
- “Copy to clipboard” is the only export. Device and clipboard software may retain copied text.
- Safety overrides symmetry: threats, coercion, stalking, abuse, self-harm, and immediate danger are outside the worksheet’s decision scope.
- The public beta is free. There is no checkout, membership, subscription, or promised paid fulfillment in this Site.

## Data flow

User text remains in local React state, is organized through five user-written lenses, and becomes a local summary. Copying to the device clipboard is optional.

The hosting/CDN layer still processes ordinary web request metadata. See `/privacy` for the complete boundary.

## Run and verify

Requires Node 22.13+ and npm.

```bash
npm ci
npm run release:check
npm run dev
```

The release gate runs lint, strict TypeScript checking, the production build, deterministic state/content/route/security tests, an audit of the complete dependency lock (including packages bundled into the Worker), and `git diff --check`. Tests do not contact any AI provider, payment service, or external system.

## Public routes

- `/` — worksheet and method
- `/about` — operator and product status
- `/privacy` — data handling
- `/terms` — responsible-use terms
- `/safety` — current U.S. crisis and domestic-violence resources with official links
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` — crawl and install metadata

Do not add a remote reflection endpoint or paid checkout without an explicit privacy, safety, authentication, abuse-control, provider, merchant, and fulfillment review plus deterministic fail-closed tests.

## Source lineage and release repair

This directory reproduces the public **local-only worksheet** at Sites version 3. `SOURCE-PROVENANCE.json` identifies the original source commit and file digests. The repository root preserves a separate optional-cloud prototype. Its Gemini endpoint and privacy text are not the contract of this worksheet.

The November 2026 repair preserves the Site identity, public audience, worker entry and no-upload behavior. It updates the framework/Worker toolchain, prevents the fictional example from silently overwriting entered text, offers an explicit way to cancel replacement, and makes the lack of refresh/navigation persistence visible before use. There is no new provider, storage, tracking, payment or message endpoint.

The rendered-route tests now use Wrangler's real local Workers test harness against the production output. Direct Node imports are insufficient for the framework's native `cloudflare:workers` module. The harness disables optional live geolocation-metadata fetching and retains the existing public-route, security-header, crawl-metadata and removed-endpoint assertions.

## Browser acceptance and actual demo

```sh
npx playwright install --with-deps chromium webkit
npm run browser:check
npm run demo:record
python3 scripts/package-demo.py
```

Packaging requires FFmpeg/ffprobe. The separate workflow uses Ubuntu 24.04, tests the actual production Worker and records fictional entries. See [`../contest/EVIDENCE.md`](../contest/EVIDENCE.md) for limits and how to distinguish configured checks from actual results. No provider credential is needed.
