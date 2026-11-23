import { createTestHarness } from 'wrangler';

export async function startRelease() {
  process.env.CLOUDFLARE_CF_FETCH_ENABLED = 'false';
  process.env.WRANGLER_WRITE_LOGS = 'false';
  const runtime = createTestHarness({ workers: [{ configPath: new URL('../../dist/server/wrangler.json', import.meta.url) }] });
  const { url } = await runtime.listen();
  return { runtime, url: url.toString() };
}
