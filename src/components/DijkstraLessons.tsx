import { GraphSvg } from "./GraphSvg";
import { DistView, PriorityQueueView } from "./StateViews";
import { Reveal } from "./ConceptVisuals";
import { afterOne, firstRelax, graphSteps, initial, staleStep } from "../dijkstra/snapshots";
import "../styles/dijkstra-lessons.css";

const selectedThree = graphSteps.find(s => s.phase === "select" && s.currentNode === 3)!;

export function DijkstraOverview({ step }: { step: number }) {
  return (
    <div className="dijkstra-overview">
      <GraphSvg snapshot={step === 0 ? undefined : step === 1 ? afterOne : selectedThree} />
      <div className="lesson-copy">
        <span className="label">출발 1 · 도착 6</span>
        <h2>간선 비용의 합이<br />가장 작은 경로</h2>
        <p>화살표 방향으로 이동하며,<br />간선의 숫자만큼 비용을 더한다.</p>
        {step === 0 ? (
          <p className="blue">첫 비용은 0에서 시작한다.</p>
        ) : (
          <>
            <span className="label">1번의 이웃까지 발견한 누적 비용</span>
            <div className="lesson-candidates">
              {afterOne.queue.map(entry => (
                <div key={entry.node} className={step >= 2 && entry.node === 3 ? "chosen" : ""}>
                  <span>정점 {entry.node}</span><strong>{entry.cost}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="bottom-message">
        {step === 0 ? "목표: 1에서 6까지의 최소 누적 비용" : step === 1
          ? "다음에는 어느 후보를 먼저 탐색할까?"
          : <>정점 번호와 관계없이 <strong>누적 비용 2인 정점 3</strong>을 선택한다.</>}
      </p>
    </div>
  );
}

export function DistLesson({ step }: { step: number }) {
  const snapshot = step === 0 ? initial : step === 1 ? afterOne : firstRelax;
  return (
    <div className="dist-scene">
      <GraphSvg snapshot={snapshot} showDist />
      <DistView snapshot={snapshot} />
      <p className="bottom-message dist-definition">
        {step === 0 ? <>시작점은 <strong>0</strong>, 나머지는 <strong>∞</strong>로 초기화한다. ∞는 아직 경로를 찾지 못했다는 뜻이다.</>
          : step === 1 ? <><code>dist[v]</code>는 현재까지 발견한 최선이다. <strong>확정 전에는 더 작아질 수 있다.</strong></>
          : <><code>dist[4]</code>는 <strong>5에서 4로 갱신</strong>된다. PQ에 넣는 시점에는 아직 확정하지 않는다.</>}
      </p>
    </div>
  );
}

export function SettlementLesson({ step }: { step: number }) {
  return (
    <div className="settlement-lesson">
      <div className="settlement-comparison">
        <div>
          <span className="label">PQ에서 꺼낸 유효한 최소 후보</span>
          <h2>1 → 3</h2><strong className="settlement-cost">2</strong>
          <p>꺼낸 비용 = dist[3] = 2</p>
        </div>
        <div>
          <span className="label">정점 2를 거쳐 정점 3으로 간다면?</span>
          <h2>1 → 2까지 이미 비용 3</h2>
          <div className="settlement-formula"><b>3</b><span>+</span><b>(0 이상)</b><span>≥ 3</span></div>
          <Reveal show={step >= 1}>
            <p className="blue">2를 거치는 경로는 비용 2보다 작아질 수 없다.<br /><strong>실제 1 → 2 → 3의 비용도 3 + 2 = 5다.</strong></p>
          </Reveal>
        </div>
      </div>
      <Reveal show={step >= 2} className="settlement-conclusion">
        <strong>유효한 최소 후보를 꺼낼 때, 그 정점의 비용을 확정한다.</strong>
        <p>모든 간선 비용 ≥ 0이므로 먼저 확정할 수 있다.<br />나중에 2 → 3을 비교해도 5 &gt; 2라서 갱신하지 않는다.</p>
      </Reveal>
    </div>
  );
}

export function StaleLesson({ step }: { step: number }) {
  const fourCandidates = firstRelax.queue.filter(entry => entry.node === 4);
  const previousCandidate = fourCandidates.find(entry => entry.cost === 5)!;
  const queue = step === 0 || step === 2 ? [previousCandidate]
    : step === 1 ? fourCandidates : [];
  return (
    <div className="stale-lesson">
      <div>
        <span className="label">PQ에 남은 정점 4의 기록만 확대</span>
        <PriorityQueueView queue={queue} large reservedSlots={2} emptyLabel="정점 4의 기록 없음" />
        <p className="lesson-footnote">PQ는 (정점, 넣을 당시 누적 비용)을 저장한다.</p>
      </div>
      <div className="lesson-copy">
        <span className="label">최신 비용표</span>
        <h2>dist[4] = <span className="blue">{step === 0 ? 5 : staleStep.dist[4]}</span></h2>
        <div className="stale-step-copy">
          {step === 0 ? <p>처음에는 비용 5인 경로를 발견했다.</p>
            : step === 1 ? <p>dist[4]를 4로 갱신한다.<br />새 후보 (4, 4)를 PQ에 추가한다.<br /><strong>기존 기록 (4, 5)도 그대로 남긴다.</strong></p>
            : step === 2 ? <p>그 뒤, 비용 4인 후보를 먼저 꺼내 탐색했다.<br />정점 4의 남은 기록은 <strong>(4, 5)</strong>다.</p>
            : step === 3 ? <p>이제 (4, 5)를 PQ에서 꺼냈다.<br />꺼낸 비용을 현재 dist[4]와 비교한다.</p>
            : <p>꺼낸 비용 5가 현재 dist[4]보다 크다.<br />dist는 그대로 두고 다음 후보로 넘어간다.</p>}
        </div>
      </div>
      <div className="stale-explanation">
        {step < 3 ? <p>{[
          "처음 발견한 비용 5를 PQ에 기록한다.",
          "dist를 갱신해도, PQ 안의 기존 기록을 찾아서 지우지는 않는다.",
          "작은 비용의 후보부터 처리한다. 다음으로 (4, 5)를 꺼낼 차례다.",
        ][step]}</p> : step === 3 ? <>
          <strong className="blue">poll() 결과: (4, 5)</strong>
          <code>cur.cost &gt; dist[cur.node] ?</code>
          <p>다음 단계에서 5와 4를 비교한다.</p>
        </> : <>
          <strong>꺼낸 비용 5 &gt; 현재 dist[4] = 4</strong>
          <code>if (cur.cost &gt; dist[cur.node]) continue;</code>
          <p className="stale-verdict">오래된 후보 · 건너뛰기</p>
        </>}
      </div>
    </div>
  );
}
