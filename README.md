# SWEA 1249 보급로 — 다익스트라 시각화 발표

SSAFY 16기 광주 4반에서 SWEA 1249 「보급로」 문제를 설명하기 위해 만든 웹 발표 자료입니다. 격자를 가중치 그래프로 해석하고, 다익스트라 알고리즘으로 최소 복구 시간을 찾는 과정을 단계별로 보여줍니다.

- [웹 발표 자료 보기](https://dijkstra-ppt.vercel.app/)
- [PDF 발표 자료 보기](output/pdf/swea-1249-presentation.pdf)

## 주요 내용

- BFS와 가중치 최단 경로의 차이, 다익스트라를 선택하는 이유
- 최소 비용 후보 선택, 거리 갱신, 오래된 후보 처리의 단계별 시각화
- 그래프 예제를 보급로 격자 문제에 적용하고 Java 풀이 코드 설명
- 슬라이드 목차·단계 선택·자동재생·전체화면 지원

**기술:** React · TypeScript · Vite · Framer Motion · Three.js / React Three Fiber

## 로컬 실행

Node.js와 npm이 설치된 환경에서 실행합니다.

```bash
git clone https://github.com/ho72/dijkstra-visualizer.git
cd dijkstra-visualizer
npm ci
npm run dev
```

터미널에 표시된 주소에서 발표를 열 수 있습니다.

```bash
npm run build    # TypeScript 검사와 배포용 빌드
npm run preview  # 빌드 결과 미리보기
```

`package.json`에 `npm test` 명령이 등록되어 있지만, 현재 공개 저장소에는 해당 명령이 참조하는 `*.test.ts` 파일이 없습니다.

## 발표 조작

| 키 | 동작 |
| --- | --- |
| `→` / `Space` / `PageDown` | 다음 슬라이드·단계 |
| `←` / `PageUp` | 이전 슬라이드·단계 |
| `P` / `R` | 현재 장면 자동재생·정지 / 초기화 |
| `F` / `?` | 전체화면 / 단축키 도움말 |
