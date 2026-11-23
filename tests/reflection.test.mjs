import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, createBudget, localReflection, LENSES } from '../lib/reflection.mjs';
const story = 'I am uncertain about a recent conversation and want to think clearly.';
function request(body, headers = {}) { return new Request('http://localhost/api/reflect', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }); }
test('guided prompts make no invented claim about a non-response', () => {
  const result = localReflection(story);
  assert.equal(result.mode, 'guided'); assert.match(result.notice, /do not analyze/); assert.doesNotMatch(JSON.stringify(result), /no reply since yesterday/);
});
test('missing credentials and explicit opt-out never contact provider', async () => {
  let calls = 0;
  const noCloud = createHandler({ key: '', fetchImpl: () => { calls++; } });
  assert.equal((await (await noCloud(request({ story, cloud: true }))).json()).mode, 'guided');
  const configured = createHandler({ key: 'test', model: 'test-model', fetchImpl: () => { calls++; } });
  assert.equal((await (await configured(request({ story }))).json()).mode, 'guided'); assert.equal(calls, 0);
});
test('malformed, missing, non-string, excessive input and content type are rejected', async () => {
  const post = createHandler({ key: '' });
  for (const body of ['{bad', {}, { story: [] }, { story: 'small' }, { story: 'x'.repeat(8001) }]) assert.equal((await post(request(body))).status, 400);
  assert.equal((await post(request({ story }, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await post(request({ story: 'x'.repeat(50000) }))).status, 413);
});
test('urgent risk bypasses cloud model', async () => {
  const post = createHandler({ key: 'test', model: 'test-model', fetchImpl: () => assert.fail('called provider') });
  const result = await (await post(request({ story: 'I am thinking I may hurt myself tonight', cloud: true }))).json();
  assert.equal(result.mode, 'safety'); assert.match(result.reflection['WHAT NEXT'], /emergency/);
});
test('provider key is a header, outputs validated and private responses not cached', async () => {
  const expected = Object.fromEntries(LENSES.map(key => [key, 'A tentative reflection.']));
  const post = createHandler({ key: 'secret-test-only', model: 'test-model', fetchImpl: async (url, init) => {
    assert.ok(!url.includes('secret-test-only')); assert.equal(init.headers['x-goog-api-key'], 'secret-test-only');
    assert.ok(init.signal); return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(expected) }] } }] });
  } });
  const response = await post(request({ story, cloud: true })); const data = await response.json();
  assert.equal(data.mode, 'gemini'); assert.deepEqual(data.reflection, expected); assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('provider failure and malformed output stay honestly labeled as guided prompts', async () => {
  for (const fetchImpl of [async () => new Response('unavailable', { status: 503 }), async () => Response.json({ candidates: [{ content: { parts: [{ text: '{"ME": {}}' }] } }] })]) {
    const response = await createHandler({ key: 'test', model: 'test-model', fetchImpl })(request({ story, cloud: true }));
    const data = await response.json(); assert.equal(data.mode, 'guided'); assert.match(data.notice, /no personalized AI result/);
  }
});
test('process budget cannot be bypassed by forged forwarding headers', async () => {
  const post = createHandler({ key: 'test', model: 'test-model', budget: createBudget(1), fetchImpl: async () => new Response('bad', { status: 503 }) });
  await post(request({ story, cloud: true }, { 'X-Forwarded-For': 'one' }));
  const response = await post(request({ story, cloud: true }, { 'X-Forwarded-For': 'two' }));
  assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60');
});
