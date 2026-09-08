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
const GRID_INIT_CODE = [
  "int[] dx = {-1, 1, 0, 0};",
  "int[] dy = {0, 0, -1, 1};",
  "Queue<int[]> pq = new PriorityQueue<>(",
  "    (a, b) -> Integer.compare(a[2], b[2]));",
  "",
  "int[][] minCost = new int[N][N];",
  "for (int i = 0; i < N; i++) {",
  "    Arrays.fill(minCost[i], Integer.MAX_VALUE);",
  "}",
  "minCost[0][0] = 0;",
  "pq.offer(new int[] {0, 0, 0});",
];
const GRID_POLL_CODE = [
  "while (!pq.isEmpty()) {",
  "    int[] current = pq.poll();",
  "    int currentX = current[0];",
  "    int currentY = current[1];",
  "    int currentCost = current[2];",
  "    if (currentCost > minCost[currentX][currentY]) {",
  "        continue;",
  "    }",
  "",
  "    if (currentX == N - 1 && currentY == N - 1) {",
  "        break;",
  "    }",
  "    // 이어서 상하좌우 탐색",
];
const GRID_NEIGHBOR_CODE = [
  "    for (int dir = 0; dir < 4; dir++) {",
  "        int nextX = currentX + dx[dir];",
  "        int nextY = currentY + dy[dir];",
  "        if (nextX < 0 || nextX >= N ||",
  "            nextY < 0 || nextY >= N) {",
  "            continue;",
  "        }",
  "        int cost = map[nextX][nextY];",
  "        int newDistance = currentCost + cost;",
  "        if (newDistance < minCost[nextX][nextY]) {",
  "            minCost[nextX][nextY] = newDistance;",
  "            pq.offer(new int[] {",
  "                nextX, nextY, newDistance});",
  "        }",
  "    }",
  "}",
];
export const gridSections = [
  { title: "좌표와 초기화", code: GRID_INIT_CODE },
  { title: "최소 후보와 종료 조건", code: GRID_POLL_CODE },
  { title: "while문 안의 상하좌우 탐색", code: GRID_NEIGHBOR_CODE },
];
export const GRID_CODE = gridSections.flatMap((section, i) =>
  i === 0 ? section.code : ["", ...section.code],
);
export const gridCodeSteps = [
  {
    section: 0, focus: [0, 3],
    note: ["01", "좌표와 우선순위 큐", "{x, y, 누적 비용}", "x는 행, y는 열이다. PQ는 배열의 [2]를 비교해 누적 비용이 작은 후보부터 꺼낸다."],
  },
  {
    section: 0, focus: [5, 10],
    note: ["02", "최소 비용표 초기화", "distance[v]\nminCost[x][y]", "정점별 거리 배열이 2차원으로 바뀐다. 시작 칸은 0, 나머지는 무한대로 초기화한다."],
  },
  {
    section: 1, focus: [0, 4],
    note: ["03", "최소 후보 꺼내기", "currentX, currentY\ncurrentCost", "current[0], [1]은 좌표이고 [2]는 PQ에 넣을 당시의 누적 복구 비용이다."],
  },
  {
    section: 1, focus: [5, 7],
    note: ["04", "오래된 후보 검사", "currentCost >\nminCost[currentX][currentY]", "꺼낸 비용이 최신 비용보다 크면 건너뛴다. 목적지 확인도 이 검사 다음에 한다."],
  },
  {
    section: 1, focus: [9, 11],
    note: ["05", "목적지에서 종료", "(N - 1, N - 1)", "목적지를 유효한 최소 후보로 꺼냈으므로 비용이 확정된다. PQ에 후보가 남아 있어도 종료한다."],
  },
  {
    section: 2, focus: [0, 6],
    note: ["06", "상하좌우 탐색", "currentX + dx[dir]\ncurrentY + dy[dir]", "인접 리스트 대신 방향 배열로 이웃을 구한다. 지도 밖의 좌표는 제외한다."],
  },
  {
    section: 2, focus: [7, 9],
    note: ["07", "이동할 칸의 비용", "currentCost + cost", "cost는 map[nextX][nextY]다. 다음 칸에 들어가는 비용을 더해 기존 최소 비용과 비교한다."],
  },
  {
    section: 2, focus: [10, 12],
    note: ["08", "갱신하고 PQ에 추가", "{nextX, nextY, newDistance}", "더 작은 값을 minCost에 기록하고 새 후보를 넣는다. 최종 답은 minCost[N-1][N-1]이다."],
  },
];
