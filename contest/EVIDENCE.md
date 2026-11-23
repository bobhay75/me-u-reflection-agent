# Reproducible worksheet evidence

The public beta corresponds to Sites version 4, source commit `b44ac346cea96898d34fa78318dc1224aa208db1`. `public-worksheet/SOURCE-PROVENANCE.json` preserves the original version 3 capture and records the version 4 application-file digests. The one application change after that capture brightens the small lens-number labels, correcting the 4.14:1 contrast failure found by the real browser accessibility check. Source distribution, documentation, browser tests and demo tooling are additional repository changes. Root-level commands exercise a different prototype.

## Build and production routes

```sh
cd public-worksheet
npm ci
npm run release:check
```

On November 23 this passed lint, TypeScript, all five build stages, **11 automated tests**, and a complete dependency audit with **zero reported vulnerabilities**. Route tests use Wrangler's real local Workers runtime against production output. This is engineering evidence, not proof against unknown vulnerabilities.

## Browser acceptance

```sh
npx playwright install --with-deps chromium webkit
npm run browser:check
```

The workflow uses Ubuntu 24.04 and Node 22. It checks desktop Chromium, Android-size Chromium and iPhone-size WebKit for editing, keyboard tabs, replacement/clear confirmation, literal-text output, clipboard where supported, reload clearing, absent story uploads/storage, mobile width, information pages and the absent story endpoint. axe checks the rendered worksheet against its WCAG A/AA rules. These automated checks do not replace manual screen-reader or physical-device validation.

The live site was separately exercised through a browser on November 23: fictional example, editing, keyboard movement, literal-text summary, clipboard copy and refresh clearing worked. No application JavaScript exception was observed.

The exact hosted run is the authority for browser pass/fail. Configured checks alone do not imply success. The workflow retains JSON results, failure traces/screenshots and layout screenshots.

## Actual demonstration

FFmpeg and ffprobe are required.

```sh
npm run demo:record
python3 scripts/package-demo.py
```

The demo operates the real Worker build with fictional entries in real time. The captioned MP4 adds black space below the unaltered application view. Separate SRT, duration metadata and SHA-256 files are produced in `demo-output/`. Original WebM and caption timeline remain in `test-results/`. There is no audio or synthetic narrator presented as a real speaker.

The CI artifact `meu-public-worksheet-evidence` is retained for 30 days. Preserve the verified MP4 and SRT before expiration. Contest playback still requires an eligible video-host upload and signed-out playback check.
