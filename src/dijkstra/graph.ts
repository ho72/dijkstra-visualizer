import type { Edge } from "./types";

export const GRAPH_NODES = [1, 2, 3, 4, 5, 6];
export const GRAPH_EDGES: Edge[] = [
  { from: 1, to: 2, cost: 3 },
  { from: 1, to: 3, cost: 2 },
  { from: 1, to: 4, cost: 5 },
  { from: 2, to: 3, cost: 2 },
  { from: 2, to: 5, cost: 8 },
  { from: 3, to: 4, cost: 2 },
  { from: 4, to: 5, cost: 6 },
  { from: 5, to: 6, cost: 1 },
];
export const GRAPH_POSITIONS: Record<number, [number, number]> = {
  1: [130, 460],
  2: [260, 125],
  3: [480, 320],
  4: [710, 525],
  5: [915, 310],
  6: [1070, 120],
};
export const GRID = [
  [0, 1, 5],
  [2, 1, 2],
  [4, 1, 0],
];
export const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;
export const coordinate = (node: number, size = GRID.length) =>
  `(${Math.floor(node / size)}, ${node % size})`;
export function gridGraph(map: number[][]) {
  const n = map.length;
  if (
    !n ||
    map.some(
      (row) =>
        row.length !== n || row.some((v) => !Number.isFinite(v) || v < 0),
    )
  )
    throw new Error(
      "격자는 비어 있지 않은 정사각형이고 비용은 유한한 0 이상이어야 합니다.",
    );
  const nodes = Array.from({ length: n * n }, (_, i) => i);
  const edges: Edge[] = [];
  for (const node of nodes) {
    const r = Math.floor(node / n),
      c = node % n;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n)
        edges.push({ from: node, to: nr * n + nc, cost: map[nr][nc] });
    }
  }
  return { nodes, edges };
}
