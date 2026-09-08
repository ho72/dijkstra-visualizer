import { IntroGrid } from "../components/IntroGrid";
import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { GraphSvg } from "../components/GraphSvg";
import { GridSvg } from "../components/GridSvg";
import {
  Counterexample,
  RelaxationVisual,
  Reveal,
} from "../components/ConceptVisuals";
import {
  DistView,
  ExecutionState,
  PriorityQueueView,
} from "../components/StateViews";
import { CodeSlide } from "../components/CodeSlide";
import { Icon } from "../components/Icon";
import { coordinate, GRID } from "../dijkstra/graph";
import {
  afterOne,
  initial,
  firstRelax,
  failedRelax,
  secondRelax,
  staleStep,
  finalGraph,
  finalGrid,
  graphPath,
  gridPath,
  graphSteps,
  gridSteps,
} from "../dijkstra/snapshots";
import roadImage from "../../SWEA_1249_codex_bundle/references/road_depth_reference.png";
import gridImage from "../../SWEA_1249_codex_bundle/references/grid_reference.png";

const GraphToGridScene = lazy(() => import("../three/GraphToGridScene"));

export const slides = [
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
    id: "depth",
    section: "01",
    sectionName: "문제 이해",
    title: "도로의 파손 깊이가 곧 복구 시간이다",
    steps: 3,
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
    id: "interpretation",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "격자도 결국 그래프다",
    steps: 4,
  },
  {
    id: "choice",
    section: "02",
    sectionName: "알고리즘 선택",
    title: "비용의 조건으로 알고리즘을 선택한다",
    steps: 4,
  },
  {
    id: "idea",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "현재까지 비용이 가장 작은 정점부터 탐색한다",
    steps: 2,
  },
  {
    id: "dist",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "dist는 현재까지 발견한 최소 비용이다",
    steps: 2,
  },
  {
    id: "pq",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "최소 비용 후보를 먼저 꺼내기 위해 PQ를 쓴다",
    steps: 2,
  },
  {
    id: "execution",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "하나의 그래프로, 한 단계씩 실행해보자",
    steps: graphSteps.length,
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
    id: "second-relaxation",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "더 좋은 경로를 찾으면 다시 갱신할 수 있다",
    steps: 3,
  },
  {
    id: "stale",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "PQ에는 오래된 비용의 후보도 남아 있다",
    steps: 2,
  },
  {
    id: "graph-result",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "1에서 6까지의 최소 비용은 11이다",
    steps: 1,
  },
  {
    id: "cycle",
    section: "03",
    sectionName: "다익스트라 알고리즘",
    title: "다익스트라는 같은 과정을 반복한다",
    steps: 5,
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
export function SlideContent({ id, step }: { id: string; step: number }) {
  if (id === "intro")
    return (
      <div className="intro-content">
        <div className="intro-copy">
          <div className="eyebrow">SWEA 1249</div>
          <h1>
            보급로<span className="title-dot">.</span>
          </h1>
          <p>
            가중치가 있는 격자에서
            <br />
            최소 비용 경로 찾기
          </p>
          <div className="algorithm-label">
            <span />
            Dijkstra
          </div>
        </div>
        <IntroGrid />
      </div>
    );
  if (id === "rules")
    return (
      <div className="split">
        <img
          className="rules-image"
          src={gridImage}
          alt="0부터 시작하는 행과 열, 좌상단 S, 우하단 G, 상하좌우 이동을 표시한 6×6 격자"
        />
        <div className="plain-notes">
          <p>
            <span className="label">출발점 S</span>
            <strong>(0, 0)</strong>
          </p>
          <Reveal show={step >= 1}>
            <p>
              <span className="label">도착점 G</span>
              <strong>(N−1, N−1)</strong>
            </p>
          </Reveal>
          <Reveal show={step >= 2}>
            <p className="muted">
              N × N 격자 · 0-based 인덱스
              <br />
              <span className="blue">상 / 하 / 좌 / 우</span>
            </p>
          </Reveal>
        </div>
      </div>
    );
  if (id === "problem" || id === "depth")
    return (
      <div className="road-content">
        <div className="road-figure">
          <img
            src={roadImage}
            alt="파손 깊이가 1, 2, 3인 도로 단면과 각각의 복구 시간 1, 2, 3"
          />
          {id === "depth" && (
            <motion.div
              className="depth-focus"
              animate={{ left: `${19.6 + step * 26.5}%` }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
        <p>
          {id === "depth" ? (
            <>
              파손 깊이 <strong>{step + 1}</strong>
              <span className="muted">=</span>복구 시간{" "}
              <strong>{step + 1}</strong>
            </>
          ) : (
            <>
              출발지 <b className="start-text">S</b>
              <span className="route-line" />
              도착지 <b className="goal-text">G</b>
            </>
          )}
        </p>
      </div>
    );
  if (id === "objective")
    return (
      <div className="split">
        <GridSvg path={step >= 2 ? gridPath : []} />
        <div className="objective-copy">
          <p className="label">이동 시간 자체는 무시한다.</p>
          <div className="objective-row muted">
            <span>이동 거리 · 이동 횟수</span>
            <span>×</span>
          </div>
          <Reveal show={step >= 1}>
            <div className="objective-row blue">
              <span>복구 시간의 합</span>
              <Icon name="check" size={40} />
            </div>
          </Reveal>
          <Reveal show={step >= 2}>
            <p className="objective-result">
              칸마다 비용 <b>0~9</b>
              <br />
              모든 비용 <b>≥ 0</b>
            </p>
          </Reveal>
        </div>
      </div>
    );
  if (id === "bfs")
    return (
      <div className="split">
        <GridSvg wave={step} />
        <div className="bfs-copy">
          <p className="label">격자 + 상하좌우 이동</p>
          <h2>
            BFS<span className="blue">?</span>
          </h2>
          <p>시작점에서 가까운 위치부터 탐색</p>
          <div className="bfs-levels">
            0 <span>→</span> 1 <span>→</span> 2 <span>→</span> 3
          </div>
          <Reveal show={step >= 3}>
            <p className="blue">
              모든 이동 비용이 같을 때<br />
              최소 이동 횟수를 보장한다.
            </p>
          </Reveal>
        </div>
      </div>
    );
  if (id === "counterexample") return <Counterexample step={step} />;
  if (id === "interpretation")
    return (
      <div className="interpretation">
        <div className="interpret-visuals">
          <GridSvg />
          <span className="morph-arrow">→</span>
          <GridSvg graph />
        </div>
        <div className="mapping-strip">
          {[
            ["칸", "정점 · Vertex"],
            ["상하좌우 이동", "간선 · Edge"],
            ["복구 시간", "가중치 · Weight"],
          ].map(([a, b], i) => (
            <Reveal key={a} show={step >= i + 1}>
              <span>{a}</span>
              <i>→</i>
              <strong>{b}</strong>
            </Reveal>
          ))}
        </div>
      </div>
    );
  if (id === "choice")
    return (
      <div className="choice-flow">
        <div className="choice-conditions">
          {[
            ["최소 비용", "목표"],
            ["가중치 존재", "이동 비용"],
            ["모든 비용 ≥ 0", "음수 없음"],
          ].map(([a, b], i) => (
            <Reveal key={a} show={step >= i}>
              <span className="label">{b}</span>
              <strong>{a}</strong>
              {i < 2 && <span className="flow-arrow">→</span>}
            </Reveal>
          ))}
        </div>
        <Reveal show={step >= 3}>
          <div className="algorithm-answer">
            <span className="answer-line" />
            <h2>Dijkstra</h2>
            <p>가중치가 있는 최단 경로</p>
          </div>
        </Reveal>
      </div>
    );
  if (id === "idea")
    return (
      <div className="idea-scene">
        <GraphSvg
          snapshot={
            step === 0
              ? afterOne
              : {
                  ...afterOne,
                  currentNode: 3,
                  phase: "select",
                  activeEdge: undefined,
                }
          }
          showDist
        />
        <div className="idea-candidates">
          {[
            { node: 2, cost: 3 },
            { node: 3, cost: 2 },
            { node: 4, cost: 5 },
          ].map((c) => (
            <div
              key={c.node}
              className={step >= 1 && c.node === 3 ? "selected-candidate" : ""}
            >
              <span>정점 {c.node}</span>
              <strong>{c.cost}</strong>
              {step >= 1 && c.node === 3 && <small>최소 → 다음 선택</small>}
            </div>
          ))}
        </div>
        <p className="bottom-message">
          정점 번호가 아니라 <strong>누적 비용</strong>을 기준으로 선택한다.
        </p>
      </div>
    );
  if (id === "dist")
    return (
      <div className="dist-scene">
        <GraphSvg snapshot={step === 0 ? initial : afterOne} showDist />
        <DistView snapshot={step === 0 ? initial : afterOne} />
        <p className="bottom-message">
          <code>dist[v]</code> = 시작점에서 v까지 현재까지 알고 있는 가장 싼
          비용
        </p>
      </div>
    );
  if (id === "pq")
    return (
      <div className="pq-scene">
        <div className="pq-focus">
          <h2>Priority Queue</h2>
          <PriorityQueueView
            queue={
              step === 0
                ? afterOne.queue
                : afterOne.queue.filter((e) => e.node !== 3)
            }
            large
          />
        </div>
        <div className="pq-explanation">
          <span className="label">최소 누적 비용</span>
          <p className="pq-order">
            2 <span>＜</span> 3 <span>＜</span> 5
          </p>
          <Reveal show={step >= 1}>
            <div className="selected-node">
              <span>poll()</span>
              <b>3</b>
              <div>
                다음 탐색 정점<strong>누적 비용 2</strong>
              </div>
            </div>
          </Reveal>
          <p>가장 작은 후보가 먼저 나온다.</p>
        </div>
      </div>
    );
  if (id === "execution") {
    const s = graphSteps[step];
    return (
      <div className="execution-scene">
        <div className="execution-main">
          <GraphSvg
            snapshot={s}
            showDist
            path={s.phase === "complete" ? graphPath : []}
          />
          <DistView snapshot={s} />
        </div>
        <ExecutionState snapshot={s} />
        <p className="execution-message">
          {s.id === afterOne.id ? "다음에는 어떤 정점을 선택할까?" : s.message}
        </p>
      </div>
    );
  }
  if (["relaxation", "no-update", "second-relaxation"].includes(id))
    return (
      <>
        <RelaxationVisual
          snapshot={
            id === "relaxation"
              ? firstRelax
              : id === "no-update"
                ? failedRelax
                : secondRelax
          }
          step={step}
        />
        <p className="bottom-message focus-caption">
          {id === "relaxation"
            ? "처음 발견한 경로가 최종 경로라는 보장은 없다."
            : id === "no-update"
              ? "기존 최소 비용은 그대로 유지한다."
              : "더 저렴한 경로가 발견될 때마다 갱신한다."}
        </p>
      </>
    );
  if (id === "stale")
    return (
      <div className="stale-scene">
        <div className="stale-old">
          <span className="label">PQ에서 꺼낸 후보</span>
          <div className={`stale-entry ${step >= 1 ? "dismissed" : ""}`}>
            <b>정점 4</b>
            <strong>5</strong>
            <span>오래된 후보</span>
          </div>
        </div>
        <span className="stale-greater">&gt;</span>
        <div className="stale-current">
          <span className="label">현재 dist[4]</span>
          <strong>{staleStep.dist[4]}</strong>
        </div>
        <Reveal show={step >= 1} className="stale-code">
          <code>if (cur.cost &gt; dist[cur.node]) continue;</code>
          <p>더 좋은 비용이 이미 기록되어 있으므로 건너뛴다.</p>
        </Reveal>
      </div>
    );
  if (id === "graph-result")
    return (
      <div className="result-scene">
        <GraphSvg snapshot={finalGraph} showDist path={graphPath} />
        <div className="result-summary">
          <span className="label">최소 비용 경로</span>
          <p className="path-formula">1 → 3 → 4 → 5 → 6</p>
          <p className="total-equation">
            2 + 2 + 6 + 1 <span>=</span> <strong>11</strong>
          </p>
        </div>
      </div>
    );
  if (id === "cycle") return <Cycle step={step} />;
  if (id === "java") return <CodeSlide step={step} />;
  if (id === "transform") return <Transform step={step} />;
  if (id === "mapping") return <GridMapping step={step} />;
  if (id === "grid-code") return <CodeSlide step={step} grid />;
  if (id === "grid-execution") {
    const s = gridSteps[step];
    return (
      <div className="execution-scene grid-execution-scene">
        <div className="execution-main">
          <GridSvg
            snapshot={s}
            showDist
            path={s.phase === "complete" ? gridPath : []}
          />
        </div>
        <ExecutionState snapshot={s} grid />
        <p className="execution-message">{s.message}</p>
      </div>
    );
  }
  if (id === "grid-result")
    return (
      <div className="split">
        <GridSvg snapshot={finalGrid} path={gridPath} showDist />
        <div className="grid-result-copy">
          <span className="label">최소 복구 시간</span>
          <code>dist[N−1][N−1]</code>
          <div className="answer-cost">3</div>
          <p className="sum-equation">1 + 1 + 1 + 0 = 3</p>
          <div className="grid-path">
            <span className="label">복구 경로</span>
            {gridPath.map((n, i) => (
              <span key={n}>
                {coordinate(n)}
                {i < gridPath.length - 1 && <i>→</i>}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  if (id === "recognition")
    return (
      <div className="recognition">
        <div className="checklist">
          {[
            "최소 비용 / 최소 시간 / 최단 거리?",
            "그래프로 표현할 수 있는가?",
            "이동마다 서로 다른 비용이 있는가?",
            "음수 가중치가 없는가?",
          ].map((line, i) => (
            <Reveal key={line} show={step >= i}>
              <span className="check-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{line}</span>
              <Icon name="check" size={32} />
            </Reveal>
          ))}
        </div>
        <Reveal show={step >= 4}>
          <div className="recognition-result">
            <span className="label">조건으로 판단</span>
            <h2>Dijkstra</h2>
            <p>현재 가장 싼 후보부터 탐색한다.</p>
          </div>
        </Reveal>
      </div>
    );
  if (id === "comparison")
    return (
      <div className="comparison-scene">
        <table>
          <thead>
            <tr>
              <th>문제의 비용 구조</th>
              <th>알고리즘</th>
              <th>선택 기준</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>단순 도달 여부</td>
              <td>DFS / BFS</td>
              <td>방문할 수 있는가</td>
            </tr>
            <tr>
              <td>모든 이동 비용 동일</td>
              <td>BFS</td>
              <td>최소 이동 횟수</td>
            </tr>
            <tr className="table-highlight">
              <td>서로 다른 비용 · 음수 없음</td>
              <td>Dijkstra</td>
              <td>최소 누적 비용</td>
            </tr>
            <tr>
              <td>음수 간선 존재</td>
              <td>Bellman–Ford 등</td>
              <td>다익스트라의 전제 불충족</td>
            </tr>
          </tbody>
        </table>
        <p className="bottom-message">
          중요한 것은 격자의 모양이 아니라 <strong>간선 비용의 구조</strong>다.
        </p>
      </div>
    );
  return (
    <div className="summary-scene">
      {[
        ["격자도", "그래프다."],
        ["이동 비용이 다르면", "단순 BFS로는 부족할 수 있다."],
        ["다익스트라는", "현재 가장 싼 후보부터 탐색한다."],
        ["더 싼 경로를 발견하면", "dist를 갱신한다."],
      ].map(([a, b], i) => (
        <div className="summary-row" key={a}>
          <span className="summary-number">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p>
            <span>{a}</span> {b}
          </p>
        </div>
      ))}
    </div>
  );
}

function Cycle({ step }: { step: number }) {
  const lines = [
    ["01", "PQ 최소값 선택", "pq.poll()"],
    ["02", "인접 정점 확인", "graph[cur.node]"],
    ["03", "새 누적 비용 계산", "cur.cost + edge.cost"],
  ];
  return (
    <div className="cycle-scene">
      <div className="cycle-top">
        {lines.map(([n, title, code], i) => (
          <Reveal key={n} show={step >= i}>
            <span className="label">{n}</span>
            <h3>{title}</h3>
            <code>{code}</code>
            {i < 2 && <span className="cycle-arrow">→</span>}
          </Reveal>
        ))}
      </div>
      <Reveal show={step >= 3}>
        <div className="cycle-decision">
          <span>새 비용 &lt; 기존 dist ?</span>
          <div className="decision-branches">
            <div>
              <b>YES</b>
              <p>dist 갱신 + PQ에 추가</p>
            </div>
            <div>
              <b>NO</b>
              <p>기존 값 유지</p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal show={step >= 4}>
        <div className="cycle-repeat">
          ↶ <span>PQ가 빌 때까지 반복</span>
        </div>
      </Reveal>
    </div>
  );
}
function Transform({ step }: { step: number }) {
  return (
    <div className="transform-scene">
      <div className="transform-visual">
        <Suspense fallback={<GridSvg />}>
          <GraphToGridScene step={step} />
        </Suspense>
      </div>
      <div className="transform-map">
        {[
          ["Node", "(row, col)"],
          ["Edge", "상 / 하 / 좌 / 우"],
          ["Weight", "map[nr][nc]"],
          ["dist[node]", "dist[row][col]"],
        ].map(([a, b], i) => (
          <Reveal key={a} show={step >= i + 1}>
            <span>{a}</span>
            <i>→</i>
            <strong>{b}</strong>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
function GridMapping({ step }: { step: number }) {
  const [selected, setSelected] = useState(4);
  const r = Math.floor(selected / 3),
    c = selected % 3;
  return (
    <div className="split">
      <GridSvg selected={selected} onSelect={setSelected} reveal={step + 1} />
      <div className="mapping-explanation">
        <span className="label">정점 · 선택한 칸</span>
        <h2 className="mono">{coordinate(selected)}</h2>
        <Reveal show={step >= 1}>
          <p>
            간선 <span className="blue">상 / 하 / 좌 / 우</span>
          </p>
        </Reveal>
        <Reveal show={step >= 2}>
          <p className="label">선택한 칸의 값</p>
          <p className="mono">
            map[{r}][{c}] = <b className="blue">{GRID[r][c]}</b>
          </p>
        </Reveal>
        <Reveal show={step >= 3}>
          <div className="entry-cost">
            <span className="label">이동할 때 더하는 비용</span>
            <code>cur.cost + map[nr][nc]</code>
            <p>다음 칸에 들어가는 비용을 더한다.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
