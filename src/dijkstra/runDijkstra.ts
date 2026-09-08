import type { DijkstraStep, Edge, QueueEntry } from "./types";

/** Pure deterministic execution. Each snapshot owns its arrays and records. */
export function runDijkstra(
  nodes: number[],
  edges: Edge[],
  start: number,
): DijkstraStep[] {
  if (new Set(nodes).size !== nodes.length || !nodes.includes(start))
    throw new Error("시작 정점과 정점 목록을 확인하세요.");
  if (
    edges.some(
      (e) =>
        !nodes.includes(e.from) ||
        !nodes.includes(e.to) ||
        !Number.isFinite(e.cost) ||
        e.cost < 0,
    )
  )
    throw new Error("다익스트라는 유한한 0 이상의 가중치가 필요합니다.");
  const dist: Record<number, number | null> = Object.fromEntries(
    nodes.map((n) => [n, null]),
  );
  const previous: Record<number, number | null> = { ...dist };
  const queue: QueueEntry[] = [];
  const settled: number[] = [];
  const steps: DijkstraStep[] = [];
  const adjacency = new Map(
    nodes.map((n) => [n, edges.filter((e) => e.from === n)]),
  );
  let serial = 0;
  const sort = () =>
    queue.sort((a, b) => a.cost - b.cost || a.node - b.node || a.id - b.id);
  const snapshot = (
    state: Pick<DijkstraStep, "phase" | "message"> & Partial<DijkstraStep>,
  ) => {
    sort();
    steps.push({
      ...state,
      id: `step-${steps.length}`,
      dist: { ...dist },
      previous: { ...previous },
      queue: queue.map((e) => ({
        ...e,
        stale: dist[e.node] !== null && e.cost > dist[e.node]!,
      })),
      settled: [...settled],
      calculation: state.calculation ? { ...state.calculation } : undefined,
      activeEdge: state.activeEdge ? [...state.activeEdge] : undefined,
    });
  };
  dist[start] = 0;
  queue.push({ id: serial++, node: start, cost: 0 });
  snapshot({
    phase: "init",
    message: "시작점의 비용은 0, 나머지는 ∞로 초기화한다.",
  });
  while (queue.length) {
    sort();
    const cur = queue.shift()!;
    if (cur.cost > dist[cur.node]!) {
      snapshot({
        phase: "stale",
        currentNode: cur.node,
        currentCost: cur.cost,
        message: "현재 dist보다 큰 오래된 후보는 건너뛴다.",
      });
      continue;
    }
    settled.push(cur.node);
    snapshot({
      phase: "select",
      currentNode: cur.node,
      currentCost: cur.cost,
      message: "PQ에서 누적 비용이 가장 작은 후보를 꺼낸다.",
    });
    for (const edge of adjacency.get(cur.node)!) {
      const newCost = cur.cost + edge.cost,
        oldCost = dist[edge.to];
      const updated = oldCost === null || newCost < oldCost;
      const calculation = {
        from: cur.node,
        to: edge.to,
        currentCost: cur.cost,
        edgeCost: edge.cost,
        newCost,
        oldCost,
        updated,
      };
      const common = {
        currentNode: cur.node,
        currentCost: cur.cost,
        activeEdge: [cur.node, edge.to] as [number, number],
        calculation,
      };
      snapshot({
        ...common,
        phase: "inspect",
        message: "현재 비용에 간선 가중치를 더해 새 비용을 계산한다.",
      });
      if (updated) {
        dist[edge.to] = newCost;
        previous[edge.to] = cur.node;
        queue.push({ id: serial++, node: edge.to, cost: newCost });
      }
      snapshot({
        ...common,
        phase: updated ? "relax-success" : "relax-fail",
        message: updated
          ? "더 싼 경로를 발견하면 dist를 갱신하고 PQ에 추가한다."
          : "새 비용이 기존 값 이상이면 갱신하지 않는다.",
      });
    }
  }
  snapshot({
    phase: "complete",
    message: "도달 가능한 정점의 최소 비용이 확정되었다.",
  });
  return steps;
}

export function recoverPath(step: DijkstraStep, target: number): number[] {
  if (step.dist[target] === null || step.dist[target] === undefined) return [];
  const path: number[] = [];
  let node: number | null = target;
  while (node !== null) {
    if (path.includes(node)) throw new Error("경로에 순환이 있습니다.");
    path.unshift(node);
    node = step.previous[node] ?? null;
  }
  return path;
}
