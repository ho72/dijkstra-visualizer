export const chapters = [
  {
    number: "01",
    title: "문제 이해",
    summary: "이동 규칙과 최소화할 비용",
    description:
      "파손된 도로의 복구 시간을 살펴보고,\n출발지에서 도착지까지 무엇을 최소화할지 정리합니다.",
  },
  {
    number: "02",
    title: "알고리즘 선택",
    summary: "후보 비교와 다익스트라의 선택 근거",
    description:
      "경로 탐색 알고리즘의 후보를 비교하고,\nBFS의 반례를 통해 다익스트라를 선택하는 이유를 확인합니다.",
  },
  {
    number: "03",
    title: "다익스트라 알고리즘",
    summary: "탐색 순서와 최소 비용 갱신",
    description:
      "dist와 PQ의 역할, 비용 갱신과 확정의 원리를 배우고,\n하나의 그래프에서 전체 실행을 따라갑니다.",
  },
  {
    number: "04",
    title: "보급로에 적용",
    summary: "좌표 기반 코드와 격자 실행",
    description:
      "정점과 간선을 좌표와 상하좌우 이동으로 바꾸고,\n코드와 격자 실행으로 최소 복구 시간을 확인합니다.",
  },
  {
    number: "05",
    title: "정리",
    summary: "알고리즘 선택 기준과 핵심 복습",
    description:
      "문제의 비용 조건에 따른 알고리즘 선택 기준을 정리하고,\n보급로와 다익스트라의 핵심 원리를 되짚습니다.",
  },
] as const;
