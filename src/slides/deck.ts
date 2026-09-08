import { graphPresentationSteps, gridSteps } from "../dijkstra/snapshots";
import { chapters } from "./chapters";

export type SlideDefinition = {
  id: string;
  section: string;
  sectionName: string;
  title: string;
  steps: number;
  kind: "cover" | "agenda" | "chapter" | "content";
};

const contentSlides = [
  {
    id: "intro",
    section: "00",
    sectionName: "보급로",
    title: "SWEA 1249 · 보급로",
    steps: 1,
  },
  {
    id: "problem",
    section: "01",
    sectionName: "문제 이해",
    title: "S에서 G까지, 파손된 도로를 복구해야 한다",
    steps: 1,
  },
  {
    id: "rules",
    section: "01",
    sectionName: "문제 이해",
    title: "한 번에 한 칸, 상하좌우로 이동한다",
    steps: 3,
  },
  {
    id: "objective",
    section: "01",
    sectionName: "문제 이해",
    title: "최소화해야 하는 것은 총 복구 시간이다",
    steps: 3,
  },
  {
    id: "candidates",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "그래프 탐색과 최단 경로의 대표 알고리즘",
    steps: 2,
  },
  {
    id: "interpretation",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "격자도 결국 그래프다",
    steps: 4,
  },
  {
    id: "bfs",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "격자 최단 경로니까, BFS로 풀 수 있을까?",
    steps: 4,
  },
  {
    id: "counterexample",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "더 적게 이동하는 길이 더 저렴할까?",
    steps: 3,
  },
  {
    id: "choice",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "보급로의 조건에 맞는 선택, 다익스트라",
    steps: 4,
  },
  {
    id: "idea",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "예제 목표와 최소 비용 후보",
    steps: 3,
  },
  {
    id: "dist",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "dist는 현재까지 발견한 최소 비용이다",
    steps: 3,
  },
  {
    id: "pq",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "최소 비용 후보를 먼저 꺼내기 위해 PQ를 쓴다",
    steps: 2,
  },
  {
    id: "cycle",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "후보 하나를 꺼낸 뒤 하는 일",
    steps: 5,
  },
  {
    id: "relaxation",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "더 싼 경로를 발견하면 갱신한다",
    steps: 3,
  },
  {
    id: "no-update",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "새로운 경로가 더 비싸면 갱신하지 않는다",
    steps: 3,
  },
  {
    id: "settlement",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "최소 비용 후보를 확정할 수 있는 이유",
    steps: 3,
  },
  {
    id: "stale",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "PQ에는 오래된 비용의 후보도 남아 있다",
    steps: 3,
  },
  {
    id: "execution",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "배운 규칙으로 전체 실행 따라가기",
    steps: graphPresentationSteps.length,
  },
  {
    id: "graph-result",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "1에서 6까지의 최소 비용은 11이다",
    steps: 1,
  },
  {
    id: "java",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "눈으로 본 움직임을 Java 코드로 연결한다",
    steps: 6,
  },
  {
    id: "transform",
    section: "04",
    sectionName: "보급로에 적용",
    title: "그럼 이걸 보급로에 적용하면 어떻게 될까?",
    steps: 5,
  },
  {
    id: "mapping",
    section: "04",
    sectionName: "보급로에 적용",
    title: "좌표가 정점, 이동할 칸의 값이 가중치다",
    steps: 4,
  },
  {
    id: "grid-code",
    section: "04",
    sectionName: "보급로에 적용",
    title: "인접 간선 대신 상하좌우를 확인한다",
    steps: 5,
  },
  {
    id: "grid-execution",
    section: "05",
    sectionName: "격자 실행",
    title: "같은 다익스트라를 격자에서 실행한다",
    steps: gridSteps.length,
  },
  {
    id: "grid-result",
    section: "05",
    sectionName: "격자 실행",
    title: "목적지의 dist가 최소 복구 시간이다",
    steps: 1,
  },
  {
    id: "recognition",
    section: "06",
    sectionName: "코테에서 알아보기",
    title: "이런 조건이라면 다익스트라를 고려한다",
    steps: 5,
  },
  {
    id: "comparison",
    section: "06",
    sectionName: "코테에서 알아보기",
    title: "격자 문제라고 무조건 BFS가 아니다",
    steps: 1,
  },
  {
    id: "summary",
    section: "07",
    sectionName: "정리",
    title: "문제의 모양보다 비용 구조를 보자",
    steps: 1,
  },
];

// Derive chapter boundaries and the agenda from the same ordered chapter list.
export const slides: SlideDefinition[] = contentSlides.flatMap(
  (slide, index) => {
    const content: SlideDefinition = {
      ...slide,
      kind: index === 0 ? "cover" : "content",
    };
    if (index === 0) {
      return [
        content,
        {
          id: "agenda",
          section: "00",
          sectionName: "발표 순서",
          title: "목차",
          steps: 1,
          kind: "agenda",
        },
      ];
    }
    if (slide.section === contentSlides[index - 1].section) return [content];
    const chapter = chapters.find((item) => item.number === slide.section);
    if (!chapter) throw new Error(`Unknown chapter: ${slide.section}`);
    return [
      {
        id: `chapter-${chapter.number}`,
        section: chapter.number,
        sectionName: chapter.title,
        title: chapter.title,
        steps: 1,
        kind: "chapter",
      },
      content,
    ];
  },
);
