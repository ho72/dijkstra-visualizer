# SWEA 1249 Codex 전달 패키지

## 파일 구성

### docs
- `01_발표_구성안_v4.md` — 발표 내용 기준
- `02_웹발표_상세기획_v2.md` — 웹 Scene / UX / 애니메이션 기획
- `03_웹발표_스타일가이드_v1.md` — 확정 디자인 규칙

### references
- `style_reference.png` — 승인된 전체 디자인 스타일 참고
- `road_depth_reference.png` — 도로 깊이/복구 시간 설명 자료
- `grid_reference.png` — 격자/인덱스/상하좌우 설명 자료
- `dijkstra_graph_reference.png` — 다익스트라 예제 그래프 구조 참고

### root
- `CODEX_IMPLEMENTATION_PROMPT.md` — Codex에 그대로 전달할 구현 프롬프트

## 기술 방향

React + TypeScript + SVG + Framer Motion을 기본으로 하고,
Three.js / React Three Fiber는 Graph→Grid 전환과 보급로 Grid의 제한적인 2.5D 표현에만 사용한다.
