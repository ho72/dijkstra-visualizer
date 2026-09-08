import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CalculationView, PriorityQueueView } from "../components/StateViews";
import { allGridSteps, graphSteps, graphPresentationSteps, gridSteps, finalGrid } from "../dijkstra/snapshots";

test("pending PQ records never receive a stale label or strike-through class", () => {
  for (const snapshot of [...graphSteps, ...allGridSteps]) {
    const markup = renderToStaticMarkup(createElement(PriorityQueueView, { queue: snapshot.queue }));
    assert.doesNotMatch(markup, /오래된 후보|pq-stale|line-through/);
    assert.equal((markup.match(/data-queue-entry=/g) ?? []).length, snapshot.queue.length);
    for (const entry of snapshot.queue) {
      assert.deepEqual(Object.keys(entry).sort(), ["cost", "id", "node"]);
    }
  }
});

test("the popped candidate is only classified after the cost comparison", () => {
  for (const snapshot of graphPresentationSteps.filter(s => ["poll", "stale"].includes(s.phase))) {
    const markup = renderToStaticMarkup(createElement(CalculationView, { snapshot }));
    if (snapshot.phase === "poll") {
      assert.match(markup, /poll\(\)로 꺼낸 비용/);
      assert.match(markup, /다음: 두 비용 비교/);
      assert.doesNotMatch(markup, /오래된 후보|건너뛰기|확정/);
    } else {
      assert.match(markup, /오래된 후보/);
      assert.match(markup, /건너뛰기/);
    }
  }
});

test("grid views name minCost and do not claim that early termination emptied the PQ", () => {
  const initial = renderToStaticMarkup(createElement(CalculationView, { snapshot: gridSteps[0], grid: true }));
  assert.match(initial, /minCost\[0\]\[0\] = 0/);
  const completed = renderToStaticMarkup(createElement(CalculationView, { snapshot: finalGrid, grid: true }));
  assert.match(completed, /목적지 최소 비용 확정/);
  assert.match(completed, /PQ에 후보가 남아도 종료/);
  assert.doesNotMatch(completed, /PQ = ∅|모든 유효 후보 탐색 완료/);
});
