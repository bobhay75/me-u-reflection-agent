import assert from "node:assert/strict";
import test, { before, after } from "node:test";
import { createTestHarness } from "wrangler";

const origin = "https://me-u-reflection-agent.thebobsomest1.chatgpt.site";
// Test the real Workers build without downloading live visitor-geolocation data.
process.env.CLOUDFLARE_CF_FETCH_ENABLED = "false";
const runtime = createTestHarness({ workers: [{ configPath: new URL("../dist/server/wrangler.json", import.meta.url) }] });
before(async () => { await runtime.listen(); }, { timeout: 45000 });
after(async () => { await runtime.close(); });

async function loadWorker() {
  return runtime.getWorker();
}

async function render(worker, pathname, init = {}) {
  return worker.fetch(`${origin}${pathname}`, { ...init, headers: { accept: "text/html", ...(init.headers ?? {}) } });
}

test("all public information routes render with product identity and hardening", async () => {
  const worker = await loadWorker();
  for (const pathname of ["/", "/privacy", "/terms", "/safety", "/about"]) {
    const response = await render(worker, pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, pathname);
    assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/, pathname);
    assert.equal(response.headers.get("x-frame-options"), "DENY", pathname);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff", pathname);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer", pathname);
    assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=31536000/, pathname);
    const html = await response.text();
    assert.match(html, /Project Unveiled \/ Bobsome1/i, pathname);
    assert.doesNotMatch(html, /codex-preview|localhost|KCMC|Kimberling City/i, pathname);
  }
});

test("home proves the local-only product contract and honest status", async () => {
  const worker = await loadWorker();
  const response = await render(worker, "/");
  const html = await response.text();
  assert.match(html, /Nothing you type is submitted/);
  assert.match(html, /0<\/strong><span>story uploads/);
  assert.match(html, /No model decides who is right/);
  assert.match(html, /no checkout or subscription/i);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /href="\/terms"/);
  assert.match(html, /href="\/safety"/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?"`));
  assert.match(html, /property="og:image" content="https:\/\/me-u-reflection-agent\.thebobsomest1\.chatgpt\.site\/og\.png"/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|userCount/);
});

test("crawl routes are real and the removed story endpoint fails closed", async () => {
  const worker = await loadWorker();
  const robots = await render(worker, "/robots.txt", { headers: { accept: "text/plain" } });
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/me-u-reflection-agent\.thebobsomest1\.chatgpt\.site\/sitemap\.xml/);
  const sitemap = await render(worker, "/sitemap.xml", { headers: { accept: "application/xml" } });
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<loc>https:\/\/me-u-reflection-agent\.thebobsomest1\.chatgpt\.site\/privacy<\/loc>/);
  const manifest = await render(worker, "/manifest.webmanifest", { headers: { accept: "application/manifest+json" } });
  assert.equal(manifest.status, 200);
  assert.match(await manifest.text(), /Me\+U Private Reflection Worksheet/);
  const api = await render(worker, "/api/reflect", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ story: "fictional sensitive story" }) });
  assert.equal(api.status, 404);
  assert.equal(api.headers.get("cache-control"), "no-store");
  assert.equal(api.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.doesNotMatch(await api.text(), /guided demo|Gemini|You feel dismissed|no reply since yesterday/i);
});
