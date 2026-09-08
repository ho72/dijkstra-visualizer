import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CalculationView, PriorityQueueView } from "../components/StateViews";
import { allGridSteps, graphSteps, graphPresentationSteps } from "../dijkstra/snapshots";

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
