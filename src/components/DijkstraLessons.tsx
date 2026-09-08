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
          <span className="label">현재 꺼낼 유효한 최소 후보</span>
          <h2>정점 3</h2><strong className="settlement-cost">2</strong>
          <p>꺼낸 비용 = dist[3]</p>
        </div>
        <div>
          <span className="label">다른 미확정 후보를 거치는 경로</span>
          <h2>이미 든 비용 + 앞으로 들 비용</h2>
          <div className="settlement-formula"><b>≥ 3</b><span>+</span><b>≥ 0</b></div>
          <Reveal show={step >= 1}><p className="blue">다른 후보에서 더 이동해도<br /><strong>현재 최소 비용 2보다 작아질 수 없다.</strong></p></Reveal>
        </div>
      </div>
      <Reveal show={step >= 2} className="settlement-conclusion">
        <strong>유효한 최소 후보를 꺼낼 때, 그 정점의 비용을 확정한다.</strong>
        <p>전제: 모든 간선 비용 ≥ 0. 같은 비용의 후보가 여럿이면 어느 것을 먼저 골라도 된다.</p>
      </Reveal>
    </div>
  );
}

export function StaleLesson({ step }: { step: number }) {
  const fourCandidates = firstRelax.queue.filter(entry => entry.node === 4);
  return (
    <div className="stale-lesson">
      <div>
        <span className="label">정점 4의 후보 기록만 확대</span>
        <PriorityQueueView queue={step === 0 ? fourCandidates.filter(entry => entry.cost === 5).map(entry => ({...entry, stale: false})) : fourCandidates} large reservedSlots={2} />
        <p className="lesson-footnote">PQ는 (정점, 넣을 당시 누적 비용)을 저장한다.</p>
      </div>
      <div className="lesson-copy">
        <span className="label">최신 비용표</span>
        <h2>dist[4] = <span className="blue">{step === 0 ? 5 : staleStep.dist[4]}</span></h2>
        <p>{step === 0 ? "처음에는 비용 5인 경로를 발견했다." : <>dist[4]를 4로 갱신한다.<br />새 후보 (4, 4)를 PQ에 추가한다.</>}</p>
        <Reveal show={step >= 1}><p>이전 후보 <strong>(4, 5)는 PQ에 남아 있다.</strong></p></Reveal>
      </div>
      <Reveal show={step >= 2} className="stale-explanation">
        <strong>나중에 (4, 5)를 꺼내면: 5 &gt; dist[4] = 4</strong>
        <code>if (cur.cost &gt; dist[cur.node]) continue;</code>
        <p>이미 더 싼 비용을 알고 있으므로 이 기록은 건너뛴다.</p>
      </Reveal>
    </div>
  );
}
