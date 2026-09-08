import { GRAPH_NODES, GRAPH_EDGES, GRID, gridGraph } from "./graph";
import { runDijkstra, recoverPath } from "./runDijkstra";
import type { DijkstraStep } from "./types";

export const graphSteps = runDijkstra(GRAPH_NODES, GRAPH_EDGES, 1);
const grid = gridGraph(GRID);
export const allGridSteps = runDijkstra(grid.nodes, grid.edges, 0);
// Stop the teaching trace at the target's valid minimum pop, matching the
// supplied Java break condition. Keep the full run for independent validation.
const gridTargetIndex = allGridSteps.findIndex(s =>
  s.phase === "select" && s.currentNode === GRID.length ** 2 - 1,
);
const targetSelected = allGridSteps[gridTargetIndex];
export const gridSteps: DijkstraStep[] = allGridSteps.slice(0, gridTargetIndex + 1).filter((s) =>
  ["init", "select", "relax-success", "complete"].includes(s.phase),
);
gridSteps.push({
  ...targetSelected,
  id: "grid-target-complete",
  phase: "complete",
  termination: "target",
  dist: { ...targetSelected.dist },
  queue: targetSelected.queue.map(entry => ({ ...entry })),
  settled: [...targetSelected.settled],
  previous: { ...targetSelected.previous },
  message: "목적지 (2,2)의 최소 복구 비용 3이 확정됐다. PQ에 후보가 남아 있어도 종료한다.",
});
export const initial = graphSteps[0];
export const afterOne = graphSteps.find(
  (s) =>
    s.phase === "relax-success" &&
    s.activeEdge?.[0] === 1 &&
    s.activeEdge[1] === 4,
)!;
// Group the first vertex's three initial updates into one event. Keep every
// subsequent selection, update, rejected route and stale entry in time order.
// The complete inspect/relax trace remains unchanged in graphSteps.
export const graphPresentationSteps = graphSteps.filter(
  (s, index) =>
    s.phase === "init" ||
    s.id === afterOne.id ||
    (index > graphSteps.indexOf(afterOne) && s.phase !== "inspect"),
).flatMap<DijkstraStep>((s) => s.phase === "stale" ? [
  // Split removal and rejection for teaching. Both moments have the same
  // distances/remaining queue; no algorithm state changes during the check.
  {
    ...s,
    id: `${s.id}-poll`,
    phase: "poll",
    dist: { ...s.dist },
    queue: s.queue.map(entry => ({ ...entry })),
    settled: [...s.settled],
    previous: { ...s.previous },
    message: "PQ에서 후보를 꺼냈다. 이제 꺼낸 비용을 현재 dist와 비교한다.",
  },
  s,
] : [s]);
export const firstRelax = graphSteps.find(
  (s) =>
    s.phase === "relax-success" &&
    s.activeEdge?.[0] === 3 &&
    s.activeEdge[1] === 4,
)!;
export const failedRelax = graphSteps.find(
  (s) =>
    s.phase === "relax-fail" &&
    s.activeEdge?.[0] === 2 &&
    s.activeEdge[1] === 3,
)!;
export const secondRelax = graphSteps.find(
  (s) =>
    s.phase === "relax-success" &&
    s.activeEdge?.[0] === 4 &&
    s.activeEdge[1] === 5,
)!;
export const staleStep = graphSteps.find(
  (s) => s.phase === "stale" && s.currentNode === 4,
)!;
export const finalGraph = graphSteps.at(-1)!;
export const finalGrid = gridSteps.at(-1)!;
export const graphPath = recoverPath(finalGraph, 6);
export const gridPath = recoverPath(finalGrid, GRID.length ** 2 - 1);
export const phaseLabels = {
  init: "초기화",
  poll: "후보 꺼내기",
  select: "최소 후보 선택",
  inspect: "간선 확인",
  "relax-success": "거리 갱신",
  "relax-fail": "갱신하지 않음",
  stale: "오래된 후보",
  complete: "탐색 완료",
};
