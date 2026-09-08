import { motion } from "framer-motion";
import { AnimatedValue } from "./StateViews";
import type { DijkstraStep } from "../dijkstra/types";

export function Reveal({
  show,
  children,
  className = "",
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0.14, y: show ? 0 : 8 }}
      transition={{ duration: 0.35 }}
      aria-hidden={!show}
    >
      {children}
    </motion.div>
  );
}
export function Counterexample({ step }: { step: number }) {
  return (
    <div className="counterexample">
      <svg
        viewBox="0 0 1500 400"
        role="img"
        aria-label="경로 A는 3번 이동하고 비용 18, 경로 B는 5번 이동하고 비용 4"
      >
        <path
          d="M100 200 470 80 1030 80 1400 200"
          fill="none"
          stroke="#c79550"
          strokeWidth="3"
        />
        <motion.path
          d="M100 200 360 320 620 320 880 320 1140 320 1400 200"
          fill="none"
          stroke="#2968dd"
          strokeWidth="3"
          animate={{
            opacity: step >= 1 ? 1 : 0.12,
            pathLength: step >= 1 ? 1 : 0,
          }}
          transition={{ duration: 0.7 }}
        />
        {[
          { x: 100, y: 200, label: "S", fill: "#f7d78a" },
          { x: 1400, y: 200, label: "G", fill: "#efb1a6" },
          { x: 470, y: 80, label: "9", fill: "#f3e5d2" },
          { x: 1030, y: 80, label: "9", fill: "#f3e5d2" },
          ...[360, 620, 880, 1140].map((x) => ({
            x,
            y: 320,
            label: "1",
            fill: "#e0ebfb",
          })),
        ].map((n, i) => (
          <motion.g
            key={i}
            animate={{ opacity: i >= 4 && step < 1 ? 0.12 : 1 }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r="42"
              fill={n.fill}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={n.x}
              y={n.y + 12}
              fontSize="34"
              fill="#28405c"
              fontWeight="600"
              textAnchor="middle"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
        <text x="750" y="31" textAnchor="middle" fontSize="30" fill="#95601f">
          경로 A
        </text>
        <text
          x="750"
          y="390"
          textAnchor="middle"
          fontSize="30"
          fill="#2968dd"
          opacity={step >= 1 ? 1 : 0.12}
        >
          경로 B
        </text>
      </svg>
      <div className="path-comparisons">
        <div>
          <span className="label">경로 A</span>
          <p>
            이동 <b>3</b>
            <i />
            비용 <strong className="orange">18</strong>
          </p>
        </div>
        <Reveal show={step >= 1}>
          <span className="label">경로 B</span>
          <p>
            이동 <b>5</b>
            <i />
            비용 <strong className="blue">4</strong>
          </p>
        </Reveal>
      </div>
      <Reveal show={step >= 2} className="bottom-message">
        이동 횟수가 최소라고 비용이 최소인 것은 아니다.
      </Reveal>
    </div>
  );
}
export function RelaxationVisual({
  snapshot,
  step,
}: {
  snapshot: DijkstraStep;
  step: number;
}) {
  const c = snapshot.calculation!;
  const failure = !c.updated;
  return (
    <div className={`relaxation-visual ${failure ? "failure" : ""}`}>
      <div className="relax-edge">
        <span className="label">
          dist[{c.from}] = {c.currentCost}
        </span>
        <svg
          viewBox="0 0 750 250"
          role="img"
          aria-label={`${c.from}에서 ${c.to}로, 가중치 ${c.edgeCost}`}
        >
          <defs>
            <marker
              id={`focus-arrow-${c.from}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path
                d="M1 1 9 5 1 9"
                fill="none"
                stroke="#2968dd"
                strokeWidth="1.5"
              />
            </marker>
          </defs>
          <line
            x1="170"
            y1="120"
            x2="565"
            y2="120"
            stroke="#729bdc"
            strokeWidth="3"
            markerEnd={`url(#focus-arrow-${c.from})`}
          />
          <text x="375" y="90" textAnchor="middle" fontSize="35" fill="#2968dd">
            {c.edgeCost}
          </text>
          <circle cx="110" cy="120" r="58" fill="#3676e3" />
          <circle
            cx="630"
            cy="120"
            r="58"
            fill={step >= 2 && !failure ? "#dcefe5" : "#dfe8f3"}
          />
          <text x="110" y="137" textAnchor="middle" fontSize="47" fill="white">
            {c.from}
          </text>
          <text
            x="630"
            y="137"
            textAnchor="middle"
            fontSize="47"
            fill="#253f63"
          >
            {c.to}
          </text>
        </svg>
        <p className="large-equation">
          {c.currentCost} + {c.edgeCost} <span>=</span> {c.newCost}
        </p>
      </div>
      <div className="relax-result">
        <Reveal show={step >= 1}>
          <div className="new-old">
            <div>
              <span className="label">새 비용</span>
              <b>{c.newCost}</b>
            </div>
            <span className="compare-symbol">{failure ? "＞" : "＜"}</span>
            <div>
              <span className="label">기존 비용</span>
              <b className="old-cost">{c.oldCost}</b>
            </div>
          </div>
        </Reveal>
        <Reveal show={step >= 2}>
          <div className="big-update">
            <span className="label">dist[{c.to}]</span>
            <div>
              <span className="old-cost">{c.oldCost}</span>
              <span className="update-arrow">{failure ? "=" : "→"}</span>
              <strong>
                <AnimatedValue
                  value={
                    step >= 2 ? (failure ? c.oldCost : c.newCost) : c.oldCost
                  }
                />
              </strong>
            </div>
            <p>{failure ? "갱신하지 않음" : "갱신 · Relaxation"}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
