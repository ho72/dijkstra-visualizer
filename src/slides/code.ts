const JAVA_GRAPH_CODE = [
  "List<int[]>[] graph = new ArrayList[n + 1];",
  "for (int i = 1; i <= n; i++) {",
  "    graph[i] = new ArrayList<>();",
  "}",
  "",
  "for (int[] road : roads) {",
  "    int from = road[0];",
  "    int to = road[1];",
  "    int cost = road[2];",
  "    graph[from].add(new int[] {to, cost});",
  "}",
];
const JAVA_INIT_CODE = [
  "int[] distance = new int[n + 1];",
  "Arrays.fill(distance, Integer.MAX_VALUE);",
  "distance[start] = 0;",
  "",
  "PriorityQueue<int[]> pq = new PriorityQueue<>(",
  "    (a, b) -> Integer.compare(a[1], b[1]));",
  "pq.offer(new int[] {start, 0});",
];
const JAVA_LOOP_CODE = [
  "while (!pq.isEmpty()) {",
  "    int[] current = pq.poll();",
  "    int now = current[0];",
  "    int currentDistance = current[1];",
  "    if (currentDistance > distance[now]) {",
  "        continue;",
  "    }",
  "",
  "    for (int[] next : graph[now]) {",
  "        int nextNode = next[0];",
  "        int cost = next[1];",
  "        int newDistance = currentDistance + cost;",
  "        if (newDistance < distance[nextNode]) {",
  "            distance[nextNode] = newDistance;",
  "            pq.offer(new int[] {",
  "                nextNode, newDistance});",
  "        }",
  "    }",
  "}",
];
export const javaSections = [
  { title: "그래프 구성", code: JAVA_GRAPH_CODE },
  { title: "distance와 PQ 초기화", code: JAVA_INIT_CODE },
  { title: "탐색 반복", code: JAVA_LOOP_CODE },
];
// These sections form one continuous excerpt of the user's solution method.
export const JAVA_TEMPLATE = javaSections.flatMap((section, i) =>
  i === 0 ? section.code : ["", ...section.code],
);
export const javaSteps = [
  {
    section: 0, focus: [0, 10],
    note: ["01", "방향 그래프 구성", "graph[from]에 {to, cost}", "각 간선을 출발 정점의 리스트에 넣는다. 반대 방향은 추가하지 않는다."],
  },
  {
    section: 1, focus: [0, 2],
    note: ["02", "최소 비용표 초기화", "dist = distance", "앞서 본 dist 배열이다. 시작점은 0, 나머지는 Integer.MAX_VALUE로 초기화한다."],
  },
  {
    section: 1, focus: [4, 6],
    note: ["03", "누적 비용 순으로 정렬", "pq: {정점, 누적 비용}", "배열의 [1]을 비교한다. 시작 후보 {start, 0}을 넣는다."],
  },
  {
    section: 2, focus: [0, 3],
    note: ["04", "최소 후보 꺼내기", "now · currentDistance", "current[0]은 정점, current[1]은 PQ에 넣을 당시의 누적 비용이다."],
  },
  {
    section: 2, focus: [4, 6],
    note: ["05", "꺼낸 비용 비교", "currentDistance >\ndistance[now]", "더 크면 오래된 후보이므로 건너뛴다. 이 검사를 통과한 최소 후보의 거리는 확정된다."],
  },
  {
    section: 2, focus: [8, 10],
    note: ["06", "인접 정점 확인", "next: {다음 정점, 간선 비용}", "graph[now]를 순회한다. next[1]은 누적 비용이 아닌 한 간선의 비용이다."],
  },
  {
    section: 2, focus: [11, 12],
    note: ["07", "새 비용 계산·비교", "currentDistance + cost", "newDistance를 계산하고, distance[nextNode]보다 작은지 비교한다."],
  },
  {
    section: 2, focus: [13, 15],
    note: ["08", "갱신하고 PQ에 추가", "{nextNode, newDistance}", "더 작은 비용을 distance에 기록하고 새 후보를 넣는다. PQ에 남은 이전 기록은 그대로 둔다."],
  },
];
export const GRID_CODE = [
  "for (int[] row : dist) Arrays.fill(row, INF);",
  "dist[0][0] = 0;",
  "pq.offer(new Cell(0, 0, 0));",
  "",
  "while (!pq.isEmpty()) {",
  "    Cell cur = pq.poll();",
  "    if (cur.cost > dist[cur.r][cur.c]) continue;",
  "    for (int d = 0; d < 4; d++) {",
  "        int nr = cur.r + dr[d];",
  "        int nc = cur.c + dc[d];",
  "        if (nr < 0 || nr >= N || nc < 0 || nc >= N)",
  "            continue;",
  "        int nextCost = cur.cost + map[nr][nc];",
  "        if (nextCost < dist[nr][nc]) {",
  "            dist[nr][nc] = nextCost;",
  "            pq.offer(new Cell(nr, nc, nextCost));",
  "        }",
  "    }",
  "}",
];
export const gridFocus = [
  [0, 2],
  [5, 6],
  [7, 11],
  [12, 12],
  [13, 15],
];
export const gridNotes = [
  [
    "01",
    "시작점 초기화",
    "dist[0][0] = 0",
    "시작점에서 복구 비용 0으로 출발한다.",
  ],
  ["02", "최소 후보 선택", "pq.poll()", "오래된 후보는 건너뛴다."],
  ["03", "상하좌우 탐색", "(nr, nc)", "격자 범위를 벗어나는 좌표는 제외한다."],
  [
    "04",
    "도착할 칸의 비용",
    "cur.cost + map[nr][nc]",
    "현재 칸이 아니라 이동할 칸의 값을 더한다.",
  ],
  [
    "05",
    "최소 비용 갱신",
    "nextCost < dist[nr][nc]",
    "더 작으면 갱신하고 PQ에 추가한다.",
  ],
];
