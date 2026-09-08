import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { AUTO_REVEAL_INTERVAL_MS, scheduleAutomaticReveal } from "./automaticReveal";
import { AlgorithmCandidates } from "../components/AlgorithmSelection";

test("entrance phases appear in order, once, then stop", context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const seen: number[] = [];
  const cleanup = scheduleAutomaticReveal(4, stage => seen.push(stage));
  context.mock.timers.tick(AUTO_REVEAL_INTERVAL_MS - 1);
  assert.deepEqual(seen, []);
  context.mock.timers.tick(1);
  assert.deepEqual(seen, [1]);
  context.mock.timers.tick(AUTO_REVEAL_INTERVAL_MS);
  assert.deepEqual(seen, [1, 2]);
  context.mock.timers.tick(AUTO_REVEAL_INTERVAL_MS);
  assert.deepEqual(seen, [1, 2, 3]);
  context.mock.timers.tick(60_000);
  assert.deepEqual(seen, [1, 2, 3]);
  cleanup();
});

test("slide exit cancels pending reveals and re-entry starts a fresh sequence", context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const first: number[] = [];
  const stop = scheduleAutomaticReveal(4, stage => first.push(stage));
  context.mock.timers.tick(AUTO_REVEAL_INTERVAL_MS);
  stop();
  const second: number[] = [];
  const stopAgain = scheduleAutomaticReveal(3, stage => second.push(stage));
  context.mock.timers.tick(AUTO_REVEAL_INTERVAL_MS - 1);
  assert.deepEqual(second, []);
  context.mock.timers.tick(1);
  assert.deepEqual(second, [1]);
  context.mock.timers.tick(60_000);
  assert.deepEqual(first, [1]);
  assert.deepEqual(second, [1, 2]);
  stopAgain();
});

test("StrictMode setup and cleanup do not duplicate entrance phases", context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const seen: number[] = [];
  scheduleAutomaticReveal(3, stage => seen.push(stage))();
  const cleanup = scheduleAutomaticReveal(3, stage => seen.push(stage));
  context.mock.timers.tick(60_000);
  assert.deepEqual(seen, [1, 2]);
  cleanup();
});

test("candidate rows reveal individually before the concluding BFS emphasis", () => {
  for (let stage = 0; stage <= 5; stage++) {
    const html = renderToStaticMarkup(createElement(AlgorithmCandidates, { step: stage }));
    const tbody = html.split("<tbody>")[1].split("</tbody>")[0];
    const rows = tbody.match(/<tr\b[^>]*>/g) ?? [];
    assert.equal(rows.length, 5);
    rows.forEach((row, index) => {
      assert.ok(row.includes(`aria-hidden="${index > stage}"`));
      assert.ok(row.includes(`opacity:${index > stage ? 0 : 1}`));
    });
    assert.equal(html.includes('class="candidate-bfs"'), stage === 5);
    assert.ok(html.includes(`class="selection-takeaway" aria-hidden="${stage < 5}"`));
  }
});
