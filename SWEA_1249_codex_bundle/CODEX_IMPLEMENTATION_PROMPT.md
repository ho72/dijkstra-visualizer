# Codex 구현 프롬프트 — SWEA 1249 보급로 웹 발표

## 역할

너는 이 저장소에서 **SWEA 1249 보급로 알고리즘 발표용 인터랙티브 웹 프레젠테이션**을 구현한다.

이 프로젝트는 일반 웹사이트, 교육용 대시보드, 관리자 화면이 아니다.

**PowerPoint 슬라이드쇼처럼 16:9 화면을 한 장씩 넘기면서 발표하는 웹 프레젠테이션**이며,
웹의 장점은 다익스트라 알고리즘을 단계별로 실제 움직이게 보여주는 데 사용한다.

먼저 제공된 문서와 이미지를 모두 읽고 이해한 뒤 작업을 시작하라.

---

# 1. 반드시 먼저 읽을 파일

우선순위 순서대로 읽는다.

1. `docs/01_발표_구성안_v4.md`
   - 무엇을 설명할지에 대한 발표 내용의 기준 문서
   - 발표 흐름과 알고리즘 설명 내용은 이 문서를 따른다.

2. `docs/02_웹발표_상세기획_v2.md`
   - 각 내용을 웹에서 어떻게 보여줄지에 대한 Scene / UX / 애니메이션 기준

3. `docs/03_웹발표_스타일가이드_v1.md`
   - 디자인 관련 최상위 규칙
   - 디자인 충돌이 있으면 이 문서를 우선한다.

4. `references/style_reference.png`
   - 현재 합의한 전체적인 디자인 스타일 참고 이미지
   - 그대로 복제하지 말고 분위기와 정보 밀도만 참고한다.

5. `references/road_depth_reference.png`
   - 보급로 문제의 “도로 깊이 = 복구 시간” 설명용 시각 자료

6. `references/grid_reference.png`
   - 좌상단 S, 우하단 G, 0-based 행/열 인덱스, 상하좌우 이동 설명용 자료

7. `references/dijkstra_graph_reference.png`
   - 다익스트라 설명에 사용할 방향 그래프의 구조 참고 이미지
   - 디자인은 새 웹 스타일로 다시 그려야 한다.
   - 이미지를 통째로 박아 넣지 말고 SVG/DOM/Three.js 요소로 재구현한다.

---

# 2. 가장 중요한 디자인 원칙

프로젝트의 디자인 키워드는:

> **Minimal Presentation × Engineering Illustration × Subtle 2.5D Motion**

즉:

> **깔끔한 PPT 알고리즘 발표 자료 + 아주 약한 보급로/도로 복구 콘셉트 + 필요한 곳만 2.5D 모션**

이다.

## 디자인 우선순위

1. 알고리즘 이해 / 가독성
2. PPT 슬라이드다운 정돈된 구성
3. 필요한 순간의 동적 시각화
4. 보급로 문제의 분위기
5. 2.5D 효과

“있어 보이는 웹”을 만드는 것보다,
**현재 설명 중인 개념이 무엇인지 1초 안에 파악할 수 있는 화면**을 만들어라.

---

# 3. 절대 금지 사항

## 3-1. 의미 없는 문구를 절대 추가하지 말 것

특히 아래와 같은 문구를 만들거나 삽입하지 않는다.

- “가장 안전한 길을, 다시 연결하다.”
- “더 나은 내일을 위한 알고리즘”
- “최적의 길을 찾아서”
- “Mission Complete”
- “Route Recovery for a Better Tomorrow”
- 그 외 감성 슬로건 / 캐치프레이즈 / 브랜드성 문구

**문서에 실제로 존재하지 않는 장식용 문구를 AI가 임의 생성해서는 안 된다.**

허용되는 텍스트:
- 발표 제목
- 섹션 제목
- 실제 발표 내용
- 알고리즘 용어
- 계산식
- 코드
- 필요한 라벨
- `SWEA 1249 · 보급로`
- 페이지 / Step 번호

## 3-2. 웹앱 / 대시보드처럼 만들지 말 것

기본 슬라이드에서 금지:
- 왼쪽 상시 Sidebar
- Dashboard형 여러 카드
- 큰 Navigation Bar
- 항상 보이는 설정 버튼
- 항상 보이는 큰 하단 컨트롤 바
- 불필요한 Widget
- 과도한 상태 패널

이 웹은 **웹앱이 아니라 슬라이드쇼**다.

## 3-3. 테마 과잉 금지

금지:
- 군사 HUD
- 사이버펑크
- 네온 Grid
- 레이더 UI
- 전술 지휘실 UI
- 과도한 Glow
- 계속 움직이는 장식 배경
- 카모플라주

보급로 콘셉트는 아주 옅은:
- 도로
- 도로 단면
- 공병 장비
- Grid
- 지형선

정도로만 표현한다.

---

# 4. 확정 기술 스택

기본:

- React
- TypeScript
- Vite
- SVG
- Framer Motion

부분적으로만:

- Three.js
- 가능하면 React Three Fiber

## Three.js 사용 원칙

Three.js를 전체 프레젠테이션 UI에 사용하지 않는다.

사용 후보:
1. 일반 Graph → N×N Grid 변환 Scene
2. 보급로 Grid의 아주 약한 2.5D Tile 표현
3. 필요한 경우 제한적인 Camera / Perspective transition

사용하지 않을 곳:
- 일반 텍스트
- 제목
- PriorityQueue
- dist 표
- 설명 카드
- 대부분의 일반 그래프 애니메이션

다익스트라 방향 그래프 자체는 **SVG + Framer Motion을 기본으로 한다.**

SVG가 더 적합한 이유:
- 방향 화살표와 Weight의 가독성이 좋음
- 정확한 위치 제어가 쉬움
- 발표 해상도에서 텍스트가 선명함
- Edge highlight / path animation 구현이 간단함

---

# 5. 슬라이드 시스템

## 반드시 16:9

내부 기준 Stage:

```text
1920 × 1080
```

실제 viewport에 `contain` 방식으로 scale한다.

브라우저 크기가 바뀌어도:
- 비율 유지
- 슬라이드 안에서 스크롤 발생 금지
- 화면 밖 콘텐츠 금지

## 슬라이드쇼 조작

필수:

- `ArrowRight` → 다음
- `Space` → 다음
- `PageDown` → 다음
- `ArrowLeft` → 이전
- `PageUp` → 이전
- `Home` → 처음
- `End` → 마지막
- `F` → Fullscreen API로 전체화면
- `Esc` → 브라우저 기본 전체화면 종료
- `R` → 현재 동적 Scene 초기화
- `P` → 현재 동적 Scene 자동재생 / 정지

발표 중 키보드를 사용할 것이므로 안정적으로 동작해야 한다.

## 마우스 컨트롤

우측 하단 등에 작은 컨트롤을 제공하되:
- 평소에는 숨김 또는 매우 약하게 표시
- 마우스가 움직이면 등장
- 몇 초 후 자동 Fade Out

---

# 6. 슬라이드 디자인

기본 배경:
- White 또는 매우 옅은 Cool Gray / Blue Gray

텍스트:
- Dark Navy / Charcoal

Accent:
- Clear Blue

상태 색:
- Start: Warm Yellow
- Goal: Soft Red / Coral
- Current Node: Strong Blue
- Normal Node: Light Blue Gray
- Relaxation Success: Green
- No Update: Orange
- Inactive Edge: Gray
- Active Edge: Blue

## 기본 레이아웃

일반 슬라이드는 다음처럼 매우 단순해야 한다.

```text
┌──────────────────────────────────────────────────────────┐
│ 03 | 다익스트라 알고리즘                 SWEA 1249 · 보급로 │
│                                                          │
│ 현재까지 비용이 가장 작은 정점부터 탐색한다               │
│                                                          │
│                                                          │
│                  핵심 시각 자료                           │
│                                                          │
│                                                          │
│                                                   03 / 18 │
└──────────────────────────────────────────────────────────┘
```

원칙:
- 한 슬라이드에 한 메시지
- 넓은 여백
- 긴 문단 금지
- 설명에 필요 없는 UI 제거

---

# 7. 애니메이션 원칙

기본 화면은 거의 정적이다.

**다음 Step을 눌렀을 때 필요한 요소만 움직이게 한다.**

허용:
- 현재 Node가 6~10px 정도 Lift
- Edge를 따라 작은 Light Dot 이동
- Edge highlight
- Weight pulse 1회
- `∞ → 3`
- `5 → 4`
- PQ 카드 순서 재정렬
- 필요한 Camera / Morph transition
- 최종 경로를 따라 순차적인 Highlight

금지:
- 계속 움직이는 배경
- 의미 없는 Float animation
- 끊임없는 Particle
- 과도한 Zoom
- 카메라가 계속 흔들리거나 회전

---

# 8. 발표 전체 구조

발표 내용과 Scene 구성은 문서를 따르되,
웹에서는 한 장에 한 메시지가 되도록 필요하면 Scene을 더 잘게 나눈다.

큰 흐름:

1. 표지
2. 보급로 문제 상황
3. 도로 깊이 = 복구 시간
4. 지도와 이동 방향
5. 무엇을 최소화하는가
6. BFS를 떠올리는 과정
7. BFS 반례
8. 격자를 그래프로 해석
9. Dijkstra 선택
10. Dijkstra 핵심 아이디어
11. dist
12. PriorityQueue
13. 예제 방향 그래프 단계별 실행
14. Relaxation
15. 갱신 실패
16. stale PQ entry (선택적)
17. 다익스트라 반복 구조
18. Java 기본 템플릿
19. 일반 Graph → 보급로 Grid
20. 보급로에 템플릿 적용
21. 보급로 실제 실행
22. 코테에서 Dijkstra 알아보는 법
23. BFS vs Dijkstra
24. 정리

---

# 9. 다익스트라 예제 그래프

아래 구조는 반드시 정확히 유지한다.

```text
1 → 2  (3)
1 → 3  (2)
1 → 4  (5)

2 → 3  (2)
2 → 5  (8)

3 → 4  (2)

4 → 5  (6)

5 → 6  (1)
```

시작 정점:

```text
1
```

이 그래프는 **방향 그래프**다.

화살표 방향이 반드시 명확하게 보이게 한다.

`references/dijkstra_graph_reference.png`의 배치 느낌은 참고만 하고,
최종 디자인은 현재 스타일 가이드에 맞게 다시 설계한다.

---

# 10. 다익스트라 핵심 실행 상태

알고리즘 로직을 애니메이션 코드와 직접 섞지 않는다.

먼저 Dijkstra 실행 결과를 **Step Snapshot 배열**로 생성하고,
프레젠테이션은 Snapshot 사이를 애니메이션한다.

예상 Snapshot 구조:

```ts
type DijkstraStep = {
  id: string;
  phase:
    | "init"
    | "select"
    | "inspect"
    | "relax-success"
    | "relax-fail"
    | "stale"
    | "complete";

  currentNode?: number;
  activeEdge?: [number, number];

  dist: Record<number, number | null>;

  queue: Array<{
    node: number;
    cost: number;
    stale?: boolean;
  }>;

  calculation?: {
    from: number;
    to: number;
    currentCost: number;
    edgeCost: number;
    newCost: number;
    oldCost: number | null;
    updated: boolean;
  };

  message: string;
};
```

`null`은 UI에서 `∞`로 렌더링한다.

이 방식으로:
- 이전
- 다음
- Reset
- 자동 재생
- 특정 Step 재생

이 모두 결정론적으로 동작해야 한다.

---

# 11. 반드시 포함할 다익스트라 실행 장면

## 초기화

```text
dist
1 = 0
2 = ∞
3 = ∞
4 = ∞
5 = ∞
6 = ∞

PQ
(1, 0)
```

## 1번 정점 탐색 후

```text
dist[2] = 3
dist[3] = 2
dist[4] = 5
```

PQ:

```text
3 : 2
2 : 3
4 : 5
```

여기서 **3번이 먼저 선택되는 이유를 시각적으로 분명하게 보여준다.**

## 첫 번째 Relaxation

```text
3 → 4
dist[3] = 2
weight = 2

new = 4
old = 5

4 < 5
```

따라서:

```text
dist[4]
5 → 4
```

이 장면은 발표에서 가장 중요한 장면 중 하나다.

## 갱신 실패

```text
2 → 3

3 + 2 = 5
old dist[3] = 2

5 > 2
```

```text
NO UPDATE
```

단, UI 문구는 한국어 발표 흐름에 맞게 `갱신하지 않음` 등으로 표현 가능하다.

## 두 번째 Relaxation

```text
4 → 5

4 + 6 = 10
old = 11

10 < 11
```

```text
dist[5]
11 → 10
```

## stale PQ entry

기존:

```text
4 : 5
```

가 Queue에 남아 있지만 현재:

```text
dist[4] = 4
```

이므로 stale.

이 장면은 별도 Step으로 구현하되,
발표 시간이 부족하면 UI에서 Skip 가능한 구조로 만든다.

## 완료

```text
dist
1 = 0
2 = 3
3 = 2
4 = 4
5 = 10
6 = 11
```

최종 경로:

```text
1 → 3 → 4 → 5 → 6
```

총 비용:

```text
2 + 2 + 6 + 1 = 11
```

---

# 12. 그래프 디자인

SVG로 구현한다.

## Node

- 단순한 원형
- 아주 약한 2.5D 그림자
- 정점 번호 크게
- 현재 Node만 살짝 Lift
- dist는 필요할 때 Node 위에 표시
- 너무 많은 Ring/Glow 금지

## Edge

- 명확한 화살표
- Weight는 작은 라벨
- 기본 Edge는 Gray
- 현재 Edge는 Blue
- Relax 성공은 짧은 Green accent
- 실패는 짧은 Orange accent

Edge Light Dot은 Source → Target 방향으로만 이동한다.

---

# 13. PriorityQueue 디자인

항상 노출하지 않는다.

필요한 슬라이드에서만 등장한다.

형태:

```text
3   2   ← 최소
2   3
4   5
```

최소 비용 후보가 위에 위치.

새 요소가 들어오면 Framer Motion layout animation으로 자연스럽게 정렬된다.

PQ를 실제 Binary Heap 트리처럼 시각화하지 않는다.
발표 핵심은 “최소값이 먼저 나온다”이다.

---

# 14. dist 표현

필요에 따라:
- Node 위 숫자
- 간단한 1행 표
- 집중 Slide

중 하나를 사용한다.

모든 Scene에서 큰 dist Table을 고정 표시하지 않는다.

값 변경:

```text
5 → 4
```

은 숫자가 부드럽게 교체되는 Motion을 사용한다.

---

# 15. Relaxation 전용 슬라이드

이 Scene에서는 다른 정보는 최대한 제거한다.

예시 구성:

```text
더 싼 경로를 발견하면 갱신한다


dist[3] = 2

[3] ── 2 ──▶ [4]

NEW = 4
OLD = 5

4 < 5

5 → 4


Relaxation
```

PriorityQueue 전체, 다른 노드, 불필요한 설명은 숨긴다.

---

# 16. 보급로 문제 소개 이미지 사용

`references/road_depth_reference.png`

용도:
- “도로 깊이가 깊을수록 복구 시간이 증가” 설명

원본 이미지를 필요에 맞게 crop해서 사용 가능하다.

`references/grid_reference.png`

용도:
- S = (0,0)
- G = (N-1,N-1)
- 0-based 행/열
- 상하좌우 이동

이미지 위에 과도한 추가 라벨을 붙이지 않는다.

---

# 17. Graph → Grid 전환: Three.js 사용 지점

이 부분은 Three.js / React Three Fiber를 사용할 수 있다.

## 목표

일반 다익스트라의 “Node / Edge / Weight” 개념이
보급로에서는 “좌표 / 상하좌우 / 칸 비용”으로 대응된다는 것을 보여준다.

## 전환 예시

1. SVG Graph 설명 종료
2. Graph가 중앙으로 모임
3. 3D Scene으로 자연스럽게 전환
4. Node들이 평면 위 정렬
5. Node가 Grid Tile 형태로 Morph
6. Camera가 Top-ish View로 이동
7. N×N Grid 완성

아래 매핑 문구를 순차 표시:

```text
Node       → (row, col)
Edge       → 상 / 하 / 좌 / 우
Weight     → map[nr][nc]
dist[node] → dist[row][col]
```

## 중요

이 전환은 멋을 위한 장면이 아니라 **개념 대응을 이해시키기 위한 장면**이다.

지나치게 길거나 화려하게 만들지 않는다.

---

# 18. 보급로 Grid의 Three.js 사용

Grid를 진짜 3D 지형처럼 만들 필요는 없다.

Tile은 매우 약한 높이만 준다.

가능하면:
- 기본 높이는 거의 동일
- 현재 Tile만 약간 Lift
- 비용에 따른 높이차를 사용한다면 아주 작게
- 숫자 비용은 항상 명확히 표시

“높은 Tile = 지나갈 수 없는 장애물”로 오해하지 않도록 한다.

---

# 19. Fullscreen

Fullscreen API를 사용한다.

버튼 또는 `F` 입력 시:

```ts
document.documentElement.requestFullscreen()
```

가능하면 슬라이드 Stage가 화면을 최대한 채우게 한다.

전체화면이 지원되지 않는 환경에서도
일반 브라우저 모드에서 문제없이 발표 가능해야 한다.

---

# 20. 접근성과 안정성

- 모든 핵심 내용은 색만으로 전달하지 않는다.
- 키보드 Focus가 이상하게 이동하지 않게 한다.
- Space가 버튼 클릭이나 페이지 스크롤과 충돌하지 않게 한다.
- prefers-reduced-motion 사용자는 Motion을 최소화한다.
- Resize 시 상태를 잃지 않는다.
- Slide 전환 도중 입력 연타로 상태가 꼬이지 않게 한다.
- Presentation에서 인터넷 연결이 없어도 핵심 기능이 동작해야 한다.
- 외부 API나 네트워크 데이터에 의존하지 않는다.

---

# 21. 코드 구조 권장

예:

```text
src/
  app/
    Presentation.tsx
    presentationState.ts

  slides/
    IntroSlide.tsx
    ProblemRoadSlide.tsx
    GridRulesSlide.tsx
    BfsQuestionSlide.tsx
    BfsCounterexampleSlide.tsx
    GraphInterpretationSlide.tsx
    DijkstraIntroSlide.tsx
    DijkstraExecutionSlide.tsx
    RelaxationSlide.tsx
    GraphToGridSlide.tsx
    GridExecutionSlide.tsx
    SummarySlide.tsx

  dijkstra/
    graph.ts
    runDijkstra.ts
    snapshots.ts
    types.ts

  components/
    SlideFrame.tsx
    SlideHeader.tsx
    GraphSvg.tsx
    GraphNode.tsx
    GraphEdge.tsx
    PriorityQueueView.tsx
    DistView.tsx
    CalculationView.tsx
    PresenterControls.tsx

  three/
    GraphToGridScene.tsx
    RecoveryGridScene.tsx

  styles/
    tokens.css
    presentation.css
```

실제 구조는 저장소 상황에 맞춰 조정 가능하다.

---

# 22. 구현 순서

처음부터 모든 것을 만들지 않는다.

## Phase 1 — Presentation Shell

먼저:
- 16:9 Stage
- Slide navigation
- keyboard controls
- fullscreen
- 기본 Typography
- 기본 Header / page number
- style tokens

을 완성한다.

이 시점에서 3~4개의 Dummy Slide로
진짜 PPT처럼 보이고 넘어가는지 확인한다.

## Phase 2 — Static content

- 문제 소개
- BFS 판단
- BFS 반례
- Graph interpretation
- 코테 판단법

등 일반 슬라이드를 구현한다.

## Phase 3 — Dijkstra SVG

- 예제 그래프
- Node
- directed Edge
- weight
- dist
- PQ
- Step snapshots
- next/prev/reset

을 완성한다.

## Phase 4 — Dijkstra Motion

- Edge light
- current node lift
- number transition
- PQ reorder
- Relaxation
- no update
- stale

을 추가한다.

## Phase 5 — Three.js hybrid

마지막에:
- Graph → Grid transition
- Recovery Grid의 2.5D 효과

만 추가한다.

Three.js 때문에 Phase 1~4 구조가 복잡해지면 안 된다.

---

# 23. 첫 구현에서 반드시 검증할 Acceptance Criteria

## Slide system

- [ ] 화면은 항상 16:9
- [ ] 세로 스크롤 없음
- [ ] ← / →로 안정적으로 이동
- [ ] Space로 다음
- [ ] 전체화면 동작
- [ ] Slide 번호 표시
- [ ] 일반 PPT처럼 보임

## Style

- [ ] Sidebar 없음
- [ ] Dashboard 느낌 없음
- [ ] 의미 없는 슬로건 없음
- [ ] 밝고 심플함
- [ ] 넓은 여백
- [ ] 보급로 콘셉트는 미세하게만 적용
- [ ] 한 슬라이드 한 메시지

## Dijkstra

- [ ] 방향 간선 정확
- [ ] Weight 정확
- [ ] PQ 순서 정확
- [ ] dist 계산 정확
- [ ] `5 → 4` Relaxation 정확
- [ ] `2 → 3` 갱신 실패 정확
- [ ] `11 → 10` 정확
- [ ] stale entry 표현 가능
- [ ] 이전 Step으로 정확하게 복귀
- [ ] Reset 시 완전 초기화

## Hybrid

- [ ] Three.js가 전체 UI를 지배하지 않음
- [ ] Graph → Grid 전환이 개념 이해에 도움
- [ ] Grid 숫자 가독성 유지

---

# 24. 작업 방식

1. 제공된 문서를 먼저 읽는다.
2. 기존 저장소가 있다면 구조와 패키지를 확인한다.
3. 구현 전, 짧은 실행 계획을 작성한다.
4. Phase 1부터 순차적으로 구현한다.
5. 각 Phase 종료 시 실제 브라우저 화면을 확인한다.
6. 가독성을 해치는 요소는 스스로 제거한다.
7. 문서와 구현이 충돌하면:
   - 발표 내용: `01_발표_구성안_v4.md`
   - 웹 UX: `02_웹발표_상세기획_v2.md`
   - 디자인: `03_웹발표_스타일가이드_v1.md`
   순으로 해당 영역의 기준을 따른다.

---

# 25. 최종 목표

완성 결과는 다음 느낌이어야 한다.

> 브라우저에서 실행되지만 처음 보는 사람은 “웹앱”보다 **“잘 만든 알고리즘 PPT 슬라이드쇼”**라고 느껴야 한다.

그리고 다익스트라 실행 부분에서는:

> 정적인 PPT로는 어려운 **PQ 선택 → 간선 탐색 → 비용 비교 → dist 갱신**이 실제로 움직여서 누구나 이해할 수 있어야 한다.

화려함보다 이해도를 우선하라.
