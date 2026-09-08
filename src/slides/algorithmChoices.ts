// Source notes and algorithm caveats are in docs/presenter-notes.md.
export const algorithmChoices = [
  {
    id: "dfs",
    name: "DFS",
    purpose: "도달 가능 여부와 경로 탐색",
    decision: "기본 DFS만으로는 최소 비용을 보장하지 않음",
    revealAt: 1,
  },
  {
    id: "bfs",
    name: "BFS",
    purpose: "이동 비용이 같을 때 최소 이동 횟수",
    decision: "이동 비용이 달라 일반 BFS의 보장 조건과 다름",
    revealAt: 1,
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    purpose: "음수 비용이 없는 단일 출발점 최단 경로",
    decision: "한 출발점의 최소 비용, 모든 비용이 0 이상",
    revealAt: 3,
  },
  {
    id: "bellman-ford",
    name: "Bellman–Ford",
    purpose: "음수 간선도 고려하는 단일 출발점 최단 경로",
    decision: "적용 가능하지만, 이 조건에서는 다익스트라가 더 효율적",
    revealAt: 2,
  },
  {
    id: "floyd-warshall",
    name: "Floyd–Warshall",
    purpose: "모든 정점 쌍 사이의 최단 경로",
    decision: "모든 정점 쌍의 경로까지 계산할 필요는 없음",
    revealAt: 2,
  },
] as const;
