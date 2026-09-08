import { IntroGrid } from "../components/IntroGrid";
import { DijkstraOverview, DistLesson, SettlementLesson, StaleLesson } from "../components/DijkstraLessons";
import { AgendaSlide, ChapterSlide } from "../components/ChapterSlides";
import {
  AlgorithmCandidates,
  AlgorithmChoice,
} from "../components/AlgorithmSelection";
import { lazy, Suspense, useState } from "react";
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
  firstRelax,
  failedRelax,
  finalGraph,
  finalGrid,
  graphPath,
  gridPath,
  graphPresentationSteps,
  gridSteps,
} from "../dijkstra/snapshots";
import roadImage from "../../SWEA_1249_codex_bundle/references/road_depth_reference.png";
import gridImage from "../../SWEA_1249_codex_bundle/references/grid_reference.png";

const GraphToGridScene = lazy(() => import("../three/GraphToGridScene"));

export { slides } from "./deck";
export function SlideContent({ id, step }: { id: string; step: number }) {
  if (id === "agenda") return <AgendaSlide />;
  if (id.startsWith("chapter-")) return <ChapterSlide number={id.slice(8)} />;
  if (id === "candidates") return <AlgorithmCandidates step={step} />;
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
  if (id === "problem")
    return (
      <div className="road-content">
        <div className="road-figure">
          <img
            src={roadImage}
            alt="파손 깊이가 1, 2, 3인 도로 단면과 각각의 복구 시간 1, 2, 3"
          />
        </div>
        <p>
          출발지 <b className="start-text">S</b>
          <span className="route-line" aria-label="에서" />
          도착지 <b className="goal-text">G</b>
        </p>
        <p className="depth-equation">
          파손 깊이 <span>=</span> <strong>복구 시간</strong>
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
          <p>이동 횟수가 적은 칸부터 탐색</p>
          <div className="bfs-levels">
            0 <span>→</span> 1 <span>→</span> 2 <span>→</span> 3
          </div>
          <Reveal show={step >= 3}>
            <p className="blue">
              모든 이동 비용이 같을 때<br />
              최소 이동 횟수로 최소 비용도 보장
            </p>
            <p>보급로는 칸마다 복구 시간이 다르다.</p>
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
        <p className="bottom-message">
          한 출발점에서 <strong>누적 복구 시간이 최소인 경로</strong>를 찾는
          문제다.
        </p>
      </div>
    );
  if (id === "choice") return <AlgorithmChoice step={step} />;
  if (id === "idea") return <DijkstraOverview step={step} />;
  if (id === "dist") return <DistLesson step={step} />;
  if (id === "settlement") return <SettlementLesson step={step} />;
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
          <p className="lesson-footnote">후보 = (정점, 기록한 누적 비용)</p>
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
          <p>처리할 후보는 PQ에,<br />최신 최선의 비용은 dist에 기록한다.</p>
        </div>
      </div>
    );
  if (id === "execution") {
    const s = graphPresentationSteps[step];
    const focus = s.id === afterOne.id ? "1번의 이웃 세 곳을 기록"
      : s.phase === "select" ? `정점 ${s.currentNode} 선택·확정`
      : s.phase === "relax-success" ? `dist[${s.calculation!.to}] 갱신 + PQ 추가`
      : s.phase === "relax-fail" ? `dist[${s.calculation!.to}] 유지`
      : s.phase === "poll" ? `후보 (${s.currentNode}, ${s.currentCost}) 꺼내기`
      : s.phase === "stale" ? "비용 비교 후 오래된 기록 건너뛰기"
      : s.phase === "init" ? "dist와 PQ 초기화" : "최종 비용 확인";
    return (
      <div className="execution-scene">
        <div className="execution-main">
          <p className="execution-focus">{focus}</p>
          <GraphSvg
            snapshot={s}
            path={s.phase === "complete" ? graphPath : []}
          />
          <DistView snapshot={s} />
        </div>
        <ExecutionState snapshot={s} />
        <p className="execution-message">
          {s.id === afterOne.id ? "1번에서 이웃 2·3·4의 비용 3·2·5를 기록한다. 다음 최소 후보는?"
            : s.phase === "select" && s.currentNode === 3 ? "다른 후보의 비용은 이미 3 이상이다. 음수 간선이 없으므로 dist[3] = 2를 확정한다."
            : s.phase === "relax-fail" && s.activeEdge?.[1] === 3 ? "나중에 2→3을 비교해도 3+2=5 > 2이므로, 이미 확정한 dist[3]은 그대로다."
            : s.message}
        </p>
      </div>
    );
  }
  if (["relaxation", "no-update"].includes(id))
    return (
      <>
        <RelaxationVisual
          snapshot={
            id === "relaxation" ? firstRelax : failedRelax
          }
          step={step}
        />
        <p className="bottom-message focus-caption">
          {id === "relaxation"
            ? step >= 2 ? "dist[4]를 4로 갱신하고, 새 후보 (4, 4)를 PQ에 추가한다." : "기존 경로 1→4는 비용 5. 새 경로 1→3→4는?"
            : "정점 3은 이미 비용 2로 확정했다. 나중에 비교한 3+2=5로는 갱신하지 않는다."}
        </p>
      </>
    );
  if (id === "stale") return <StaleLesson step={step} />;
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
        <p className="execution-message">{s.message.replace(/\bdist\b/g, "minCost")}</p>
      </div>
    );
  }
  if (id === "grid-result")
    return (
      <div className="split">
        <GridSvg snapshot={finalGrid} path={gridPath} showDist />
        <div className="grid-result-copy">
          <span className="label">최소 복구 시간</span>
          <code>minCost[N−1][N−1]</code>
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
    ["01", "최소 후보 꺼내기", "pq.poll()"],
    ["02", "인접 정점 확인", "graph[now]"],
    ["03", "새 누적 비용 계산", "currentDistance + cost"],
  ];
  return (
    <div className="cycle-scene">
      <div className="cycle-top">
        {lines.map(([n, title, code], i) => (
          <Reveal key={n} show={step >= i}>
            <span className="label">{n}</span>
            <h3>{title}</h3>
            <code>{code}</code>
            {i === 0 && <p className="cycle-hint">오래된 기록이면 건너뛰기</p>}
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
          <span>모든 이웃에 대해 비교한 뒤, 다음 PQ 후보를 꺼낸다.<br />PQ가 빌 때까지 반복한다.</span>
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
          ["Node", "(x, y)"],
          ["Edge", "상 / 하 / 좌 / 우"],
          ["Weight", "map[nextX][nextY]"],
          ["distance[v]", "minCost[x][y]"],
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
            <code>currentCost + map[nextX][nextY]</code>
            <p>다음 칸에 들어가는 비용을 더한다.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
