import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import assert from 'node:assert/strict';
const reservation = createServer();
await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const child = spawn(process.execPath, ['node_modules/vinext/dist/cli.js', 'start', '--port', String(port), '--hostname', '127.0.0.1'], { env: { ...process.env, GEMINI_API_KEY: '', GEMINI_MODEL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Production start timed out: ' + logs.slice(-1000))), 15000);
    const collect = data => { logs += data; if (logs.includes('Production server running')) { clearTimeout(timer); resolve(); } };
    child.stdout.on('data', collect); child.stderr.on('data', collect);
    child.once('exit', code => { clearTimeout(timer); reject(new Error('Production server exited: ' + code + ' ' + logs.slice(-1000))); });
  });
  const base = 'http://127.0.0.1:' + port;
  const home = await fetch(base); const html = await home.text();
  assert.equal(home.status, 200); assert.ok(html.includes('Before you react')); assert.ok(html.includes('Use optional cloud AI')); assert.ok(!html.includes('â€™'));
  assert.equal((await fetch(base + '/favicon.svg')).status, 200);
  const malformed = await fetch(base + '/api/reflect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
  assert.equal(malformed.status, 400);
  const response = await fetch(base + '/api/reflect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ story: 'A conversation left me wondering what I should say next.', cloud: true }) });
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store'); assert.equal((await response.json()).mode, 'guided');
  console.log('Production HTTP smoke passed: rendered page, consent, encoding, favicon, request errors, no-key fallback, private response headers.');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => { if (child.exitCode !== null) return resolve(); child.once('exit', resolve); const timer = setTimeout(() => { child.kill('SIGKILL'); resolve(); }, 2000); timer.unref(); });
}
