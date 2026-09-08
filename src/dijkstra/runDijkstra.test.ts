import test from "node:test";
import assert from "node:assert/strict";
import { runDijkstra, recoverPath } from "./runDijkstra";
import { GRAPH_NODES, GRAPH_EDGES, gridGraph, GRID } from "./graph";
import {
  graphSteps,
  afterOne,
  firstRelax,
  failedRelax,
  secondRelax,
  staleStep,
  finalGraph,
  finalGrid,
  gridPath,
} from "./snapshots";

test("the directed reference graph has all eight exact edges and the expected result", () => {
  assert.deepEqual(
    GRAPH_EDGES.map((e) => [e.from, e.to, e.cost]),
    [
      [1, 2, 3],
      [1, 3, 2],
      [1, 4, 5],
      [2, 3, 2],
      [2, 5, 8],
      [3, 4, 2],
      [4, 5, 6],
      [5, 6, 1],
    ],
  );
  assert.deepEqual(finalGraph.dist, { 1: 0, 2: 3, 3: 2, 4: 4, 5: 10, 6: 11 });
  assert.deepEqual(recoverPath(finalGraph, 6), [1, 3, 4, 5, 6]);
});
test("PQ chooses node 3 (cost 2) before node 2 (cost 3)", () => {
  assert.deepEqual(
    afterOne.queue.map((e) => [e.node, e.cost]),
    [
      [3, 2],
      [2, 3],
      [4, 5],
    ],
  );
  const next = graphSteps[graphSteps.indexOf(afterOne) + 1];
  assert.equal(next.phase, "select");
  assert.equal(next.currentNode, 3);
  assert.equal(next.currentCost, 2);
});
test("first relaxation, failed update, second relaxation, and stale candidates match the narrative", () => {
  assert.deepEqual(
    [firstRelax.calculation!.oldCost, firstRelax.calculation!.newCost],
    [5, 4],
  );
  assert.deepEqual(
    firstRelax.queue.filter((e) => e.node === 4).map((e) => [e.cost, e.stale]),
    [
      [4, false],
      [5, true],
    ],
  );
  assert.deepEqual(
    [
      failedRelax.calculation!.oldCost,
      failedRelax.calculation!.newCost,
      failedRelax.dist[3],
    ],
    [2, 5, 2],
  );
  assert.deepEqual(
    [secondRelax.calculation!.oldCost, secondRelax.calculation!.newCost],
    [11, 10],
  );
  assert.equal(staleStep.currentCost, 5);
  assert.equal(staleStep.dist[4], 4);
  assert.deepEqual(
    staleStep.dist,
    graphSteps[graphSteps.indexOf(staleStep) - 1].dist,
  );
});
test("snapshots are deterministic and independently owned", () => {
  const first = runDijkstra(GRAPH_NODES, GRAPH_EDGES, 1),
    second = runDijkstra(GRAPH_NODES, GRAPH_EDGES, 1);
  assert.deepEqual(first, second);
  const previousCopy = JSON.stringify(first[0]);
  first[1].dist[2] = 999;
  first[1].settled.push(99);
  first[1].previous[3] = 99;
  assert.equal(JSON.stringify(first[0]), previousCopy);
  assert.equal(second[1].dist[2], null);
  assert.equal(first[0].dist[6], null);
});
test("every queue is ordered and distances only improve", () => {
  for (let i = 0; i < graphSteps.length; i++) {
    const s = graphSteps[i];
    assert.equal(new Set(s.settled).size, s.settled.length);
    for (let j = 1; j < s.queue.length; j++)
      assert.ok(s.queue[j - 1].cost <= s.queue[j].cost);
    if (i > 0)
      for (const n of GRAPH_NODES) {
        const a = graphSteps[i - 1].dist[n],
          b = s.dist[n];
        if (a !== null) assert.ok(b !== null && b <= a);
      }
  }
});
test("grid weights come from the destination and the example cost is 3", () => {
  const g = gridGraph(GRID);
  assert.equal(g.edges.length, 24);
  assert.equal(g.edges.find((e) => e.from === 0 && e.to === 1)?.cost, 1);
  assert.equal(g.edges.find((e) => e.from === 1 && e.to === 0)?.cost, 0);
  assert.deepEqual(finalGrid.dist, {
    0: 0,
    1: 1,
    2: 6,
    3: 2,
    4: 2,
    5: 4,
    6: 6,
    7: 3,
    8: 3,
  });
  assert.deepEqual(gridPath, [0, 1, 4, 7, 8]);
  assert.equal(
    gridPath
      .slice(1)
      .reduce((sum, n) => sum + GRID[Math.floor(n / 3)][n % 3], 0),
    3,
  );
});
test("zero costs, cycles, isolated vertices, and singleton grids terminate correctly", () => {
  const s = runDijkstra(
    [0, 1, 2, 3],
    [
      { from: 0, to: 1, cost: 0 },
      { from: 1, to: 2, cost: 0 },
      { from: 2, to: 0, cost: 0 },
    ],
    0,
  ).at(-1)!;
  assert.deepEqual(s.dist, { 0: 0, 1: 0, 2: 0, 3: null });
  assert.deepEqual(recoverPath(s, 3), []);
  const g = gridGraph([[0]]);
  assert.equal(runDijkstra(g.nodes, g.edges, 0).at(-1)!.dist[0], 0);
});
test("invalid input is rejected", () => {
  assert.throws(() => runDijkstra([1, 2], [{ from: 1, to: 2, cost: -1 }], 1));
  assert.throws(() => runDijkstra([1], [], 2));
  assert.throws(() => gridGraph([]));
  assert.throws(() => gridGraph([[0, 1], [2]]));
});
test("80 seeded random weighted grids agree with an independent Bellman-Ford oracle", () => {
  let seed = 1249;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };
  for (let sample = 0; sample < 80; sample++) {
    const n = 2 + (random() % 4);
    const map = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => random() % 10),
    );
    map[0][0] = 0;
    const g = gridGraph(map),
      expected = Array(n * n).fill(Infinity);
    expected[0] = 0;
    for (let k = 0; k < n * n - 1; k++)
      for (const e of g.edges)
        expected[e.to] = Math.min(expected[e.to], expected[e.from] + e.cost);
    const actual = runDijkstra(g.nodes, g.edges, 0).at(-1)!;
    assert.deepEqual(Object.values(actual.dist), expected);
    const path = recoverPath(actual, n * n - 1);
    assert.equal(
      path
        .slice(1)
        .reduce((sum, node) => sum + map[Math.floor(node / n)][node % n], 0),
      expected.at(-1),
    );
  }
});
