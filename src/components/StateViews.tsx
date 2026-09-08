import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DijkstraStep, QueueEntry } from "../dijkstra/types";
import { phaseLabels } from "../dijkstra/snapshots";
import { coordinate } from "../dijkstra/graph";

export function AnimatedValue({ value }: { value: number | null | undefined }) {
  return (
    <span className="animated-value">
      <AnimatePresence initial={false}>
        <motion.span
          key={value ?? "infinity"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {value ?? "∞"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
export function PriorityQueueView({
  queue,
  grid = false,
  large = false,
  reservedSlots = large ? 3 : 4,
  emptyLabel = "비어 있음",
}: {
  queue: QueueEntry[];
  grid?: boolean;
  large?: boolean;
  reservedSlots?: number;
  emptyLabel?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div
      className={`pq-view ${large ? "pq-large" : ""}`}
      style={{ "--pq-slots": Math.max(reservedSlots, queue.length, 1) } as CSSProperties}
    >
      <div className="pq-heading">
        <span>{grid ? "좌표" : "정점"}</span>
        <span>누적 비용</span>
      </div>
      <div className="pq-rows">
        {/* Rows use local slots, never viewport-based layout projection. This
            stays stable inside the scaled presentation, including exit cleanup. */}
        <AnimatePresence initial={false}>
          {queue.map((entry, i) => (
            <motion.div
              key={entry.id}
              data-queue-entry={entry.id}
              data-queue-node={entry.node}
              data-queue-cost={entry.cost}
              initial={{ opacity: 0, y: `${i * 100}%` }}
              animate={{ opacity: 1, y: `${i * 100}%` }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: "easeInOut" }}
              className={`pq-row ${i === 0 ? "pq-min" : ""}`}
            >
              <span>{grid ? coordinate(entry.node) : entry.node}</span>
              <strong>{entry.cost}</strong>
              <small>
                {i === 0 ? "← 최소" : ""}
              </small>
            </motion.div>
          ))}
        </AnimatePresence>
        {queue.length === 0 && <div className="pq-empty">{emptyLabel}</div>}
      </div>
    </div>
  );
}
export function DistView({ snapshot }: { snapshot: DijkstraStep }) {
  return (
    <div className="dist-strip" aria-label="최소 비용 배열">
      <div className="dist-name">dist</div>
      {Object.entries(snapshot.dist).map(([node, cost]) => (
        <div
          className={`dist-cell ${snapshot.calculation?.to === Number(node) && snapshot.phase === "relax-success" ? "dist-changed" : ""} ${snapshot.settled.includes(Number(node)) ? "dist-settled" : ""}`}
          key={node}
        >
          <span>{node}</span>
          <strong>
            <AnimatedValue value={cost} />
          </strong>
          {snapshot.settled.includes(Number(node)) && <small>확정</small>}
        </div>
      ))}
    </div>
  );
}
export function CalculationView({
  snapshot,
  grid = false,
}: {
  snapshot: DijkstraStep;
  grid?: boolean;
}) {
  const c = snapshot.calculation;
  if (snapshot.phase === "poll")
    return (
      <div className="calculation poll-calculation">
        <span className="label">poll()로 꺼낸 비용</span>
        <strong>{snapshot.currentCost}</strong>
        <div className="cost-comparison">
          현재 dist = {snapshot.dist[snapshot.currentNode!]}
        </div>
        <p>다음: 두 비용 비교</p>
      </div>
    );
  if (snapshot.phase === "stale")
    return (
      <div className="calculation stale-calculation">
        <span className="label">꺼낸 비용 &gt; 현재 최소 비용</span>
        <strong>
          {snapshot.currentCost} &gt; {snapshot.dist[snapshot.currentNode!]}
        </strong>
        <p>오래된 후보 · 건너뛰기</p>
      </div>
    );
  if (!c)
    return (
      <div className="calculation">
        <span className="label">
          {snapshot.phase === "init"
            ? "시작점 초기화"
            : snapshot.phase === "complete"
              ? "모든 유효 후보 탐색 완료"
              : "이 정점의 최소 비용 확정"}
        </span>
        <strong>
          {snapshot.phase === "init"
            ? "dist[start] = 0"
            : snapshot.phase === "complete"
              ? "PQ = ∅"
              : snapshot.currentCost}
        </strong>
      </div>
    );
  const inspected = snapshot.phase === "inspect";
  return (
    <div
      className={`calculation ${inspected ? "" : c.updated ? "success" : "no-update"}`}
    >
      <span className="label">
        {grid ? coordinate(c.from) : c.from} → {grid ? coordinate(c.to) : c.to}
      </span>
      <strong>
        {c.currentCost} + {c.edgeCost} = {c.newCost}
      </strong>
      <div className="cost-comparison">
        새 비용 {c.newCost}{" "}
        <b>{c.updated ? "＜" : c.newCost === c.oldCost ? "＝" : "＞"}</b> 기존{" "}
        {c.oldCost ?? "∞"}
      </div>
      {!inspected && (
        <p>
          {c.updated
            ? `갱신  ${c.oldCost ?? "∞"} → ${c.newCost}`
            : "갱신하지 않음"}
        </p>
      )}
    </div>
  );
}
export function ExecutionState({
  snapshot,
  grid = false,
}: {
  snapshot: DijkstraStep;
  grid?: boolean;
}) {
  return (
    <aside className="execution-state">
      <div className="phase-label">
        <span className={`phase-dot phase-${snapshot.phase}`} />
        {phaseLabels[snapshot.phase]}
      </div>
      <div className="current-line">
        <span className="label">
          {snapshot.phase === "poll" || snapshot.phase === "stale" ? "꺼낸 후보" : `현재 ${grid ? "좌표" : "정점"}`}
        </span>
        <b>
          {snapshot.currentNode === undefined
            ? "—"
            : grid
              ? coordinate(snapshot.currentNode)
              : snapshot.currentNode}
        </b>
      </div>
      <h3>Priority Queue</h3>
      <PriorityQueueView queue={snapshot.queue} grid={grid} reservedSlots={grid ? 4 : 3} />
      <CalculationView snapshot={snapshot} grid={grid} />
    </aside>
  );
}
