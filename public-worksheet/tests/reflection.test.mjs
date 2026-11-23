import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSummary,
  cleanText,
  completedLensCount,
  DEMO_WORKSHEET,
  emptyWorksheet,
  FIELD_MAX,
  STORY_MAX,
} from "../lib/reflection.mjs";

test("a new worksheet contains no retained story", () => {
  const first = emptyWorksheet();
  const second = emptyWorksheet();
  assert.notEqual(first, second);
  assert.deepEqual(Object.values(first), Array(Object.keys(first).length).fill(""));
});

test("cleanText bounds text and removes control and bidi controls", () => {
  assert.equal(cleanText("  hello\u0000\u202Eworld  "), "helloworld");
  assert.equal(cleanText("x".repeat(FIELD_MAX + 20)).length, FIELD_MAX);
  assert.equal(cleanText("x".repeat(STORY_MAX + 20), STORY_MAX).length, STORY_MAX);
});

test("completion requires the actual fields for each lens", () => {
  assert.equal(completedLensCount(emptyWorksheet()), 0);
  assert.equal(completedLensCount({ ...emptyWorksheet(), feelings: "hurt" }), 0);
  assert.equal(completedLensCount({ ...DEMO_WORKSHEET }), 5);
});

test("summary contains only user-supplied distinctions and explicit uncertainty", () => {
  const summary = buildSummary(DEMO_WORKSHEET);
  assert.match(summary, /Based only on what I entered/);
  assert.match(summary, /Events and motives were not independently verified/);
  assert.match(summary, /Observed:/);
  assert.match(summary, /Inferred:/);
  assert.match(summary, /Still unknown:/);
  assert.match(summary, /Safety note:/);
  assert.doesNotMatch(summary, /Gemini|OpenAI|diagnos/i);
});

test("an incomplete worksheet is assembled without invented filler", () => {
  const worksheet = { ...emptyWorksheet(), story: "A fictional event long enough to reflect on.", feelings: "uncertain" };
  const summary = buildSummary(worksheet);
  assert.match(summary, /A fictional event/);
  assert.match(summary, /What I notice: uncertain/);
  assert.doesNotMatch(summary, /Within my control:/);
  assert.doesNotMatch(summary, /undefined|null/);
});
