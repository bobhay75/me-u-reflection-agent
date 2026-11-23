import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname);

async function filesUnder(directory) {
  const output = [];
  for (const entry of await readdir(directory)) {
    const full = path.join(directory, entry);
    const info = await stat(full);
    if (info.isDirectory()) output.push(...await filesUnder(full));
    else output.push(full);
  }
  return output;
}

test("publishable source contains no remote-story path, canned-result fallback, or separated brand", async () => {
  const files = [...await filesUnder(path.join(root, "app")), ...await filesUnder(path.join(root, "components")), ...await filesUnder(path.join(root, "lib"))];
  const source = (await Promise.all(files.filter((file) => /\.(?:tsx?|mjs|mts)$/.test(file)).map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /fetch\s*\(\s*["']\/api\/reflect/i);
  assert.doesNotMatch(source, /GEMINI_API_KEY|generativelanguage\.googleapis\.com/i);
  assert.doesNotMatch(source, /KCMC|Kimberling City/i);
  assert.doesNotMatch(source, /codex-preview|site-creator-vinext-starter/i);
  assert.match(source, /Nothing you type is submitted/);
  assert.match(source, /Safety overrides symmetry/);
});

test("interface provides accessible focus, motion, touch, and mobile rules", async () => {
  const css = await readFile(path.join(root, "app/globals.css"), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
  assert.doesNotMatch(css, /outline:\s*(?:0|none)/i);
});

test("there is no story API route, database, or unused starter auth", async () => {
  await assert.rejects(stat(path.join(root, "app/api/reflect/route.ts")));
  await assert.rejects(stat(path.join(root, "app/chatgpt-auth.ts")));
  await assert.rejects(stat(path.join(root, "db/index.ts")));
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  assert.equal(packageJson.name, "me-u-private-reflection");
  assert.equal(packageJson.dependencies["drizzle-orm"], undefined);
  assert.equal(packageJson.devDependencies["drizzle-kit"], undefined);
});
