import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { startRelease } from './runtime.mjs';

let release;
test.beforeAll(async () => { release = await startRelease(); });
test.afterAll(async () => { await release?.runtime.close(); });

test('real worksheet preserves, edits and clears user text without uploads', async ({ page, context, browserName }) => {
  const writes = [], sentMarker = [], failures = [];
  page.on('request', request => {
    if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url());
    if ((request.url() + (request.postData() || '')).includes('PRIVATE-TEST-MARKER')) sentMarker.push(request.url());
  });
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(release.url);
  const story = page.getByLabel('What happened, in your own words?', { exact: true });
  await expect(page.getByRole('button', { name: 'Open five lenses', exact: true })).toBeDisabled();
  const original = 'PRIVATE-TEST-MARKER: A colleague moved our meeting without telling me. I want to ask what happened.';
  await story.fill(original);
  await page.getByRole('button', { name: 'Show fictional example', exact: true }).click();
  await expect(story).toHaveValue(original);
  await expect(page.getByRole('button', { name: 'Confirm example replacement', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Keep my worksheet', exact: true }).click();
  await page.getByRole('button', { name: 'Open five lenses', exact: true }).click();
  await page.getByLabel('What do I notice in myself?', { exact: true }).fill('I feel frustrated.');
  await page.getByLabel('What is within my control?', { exact: true }).fill('I can ask one calm question.');
  await page.getByRole('tab', { name: 'ME', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'U', exact: true })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'U', exact: true })).toHaveAttribute('aria-selected', 'true');
  const literal = 'They may be busy. <b>Fictional text only</b> & another possibility is a calendar mistake.';
  await page.getByLabel('What are two or more possible explanations?', { exact: true }).fill(literal);
  await page.getByRole('button', { name: 'Assemble my summary', exact: true }).click();
  await expect(page.locator('pre')).toContainText(original);
  await expect(page.locator('pre')).toContainText(literal);
  expect(await page.locator('pre b').count()).toBe(0);
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy to clipboard', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Reflection copied');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(literal);
  }
  await page.getByRole('button', { name: 'Clear this tab', exact: true }).click();
  await expect(story).toHaveValue(original);
  await page.getByRole('button', { name: 'Keep my worksheet', exact: true }).click();
  await expect(story).toHaveValue(original);
  await page.reload();
  await expect(story).toHaveValue('');
  await expect(page.locator('pre')).toHaveCount(0);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(writes).toEqual([]); expect(sentMarker).toEqual([]); expect(failures).toEqual([]);
});

test('fictional example can be repeated and clear requires its explicit confirmation', async ({ page }) => {
  await page.goto(release.url);
  for (let repeat = 0; repeat < 2; repeat++) {
    await page.getByRole('button', { name: 'Show fictional example', exact: true }).click();
    await expect(page.locator('pre')).toContainText('I sent an important message yesterday');
    await expect(page.getByRole('status')).toContainText('fictional example loaded locally');
    await page.getByRole('button', { name: 'Clear this tab', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm clear', exact: true }).click();
    await expect(page.getByLabel('What happened, in your own words?', { exact: true })).toHaveValue('');
  }
});

test('rendered mobile layout, keyboard tabs and accessibility pass', async ({ page }) => {
  await page.goto(release.url);
  await page.getByRole('button', { name: 'Show fictional example', exact: true }).click();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await page.getByRole('tab', { name: 'ME', exact: true }).press('End');
  await expect(page.getByRole('tab', { name: 'WHAT NEXT?', exact: true })).toBeFocused();
  await page.getByRole('tab', { name: 'WHAT NEXT?', exact: true }).press('Home');
  await expect(page.getByRole('tab', { name: 'ME', exact: true })).toBeFocused();
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('worksheet.png'), fullPage: true });
});

test('public information pages and absent story endpoint are real', async ({ page, request }) => {
  for (const [path, heading] of [['privacy', 'Your story is not our inventory.'], ['safety', 'Safety overrides symmetry.'], ['about', 'Five lenses. Human judgment.'], ['terms', 'A tool for reflection. Your judgment stays yours.']]) {
    const response = await page.goto(new URL(path, release.url).href);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (path === 'privacy' || path === 'safety') await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  const denied = await request.post(new URL('api/reflect', release.url).href, { data: { story: 'Synthetic test content' } });
  expect(denied.status()).toBe(404);
  expect(denied.headers()['cache-control']).toBe('no-store');
});
