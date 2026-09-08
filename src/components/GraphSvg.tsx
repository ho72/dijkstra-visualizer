import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GRAPH_EDGES, GRAPH_NODES, GRAPH_POSITIONS } from "../dijkstra/graph";
import type { DijkstraStep } from "../dijkstra/types";

export function GraphSvg({
  snapshot,
  showDist = false,
  path = [],
  compact = false,
}: {
  snapshot?: DijkstraStep;
  showDist?: boolean;
  path?: number[];
  compact?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  const reduced = useReducedMotion();
  const colors = {
    idle: "#a5b2c3",
    active: "#2968dd",
    success: "#16815b",
    fail: "#bc7629",
    path: "#2968dd",
  };
  return (
    <svg
      viewBox="0 0 1200 660"
      className={`graph-svg ${compact ? "compact" : ""}`}
      role="img"
      aria-label="시작 정점 1에서 도착 정점 6까지, 6개 정점과 8개 방향 간선으로 구성된 다익스트라 예제"
    >
      <defs>
        {Object.entries(colors).map(([key, color]) => (
          <marker
            key={key}
            id={`${uid}-${key}`}
            viewBox="0 0 12 12"
            refX="9"
            refY="6"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path
              d="M2 2 L10 6 L2 10"
              fill="none"
              stroke={color}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        ))}
        <filter
          id={`${uid}-shadow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="220%"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="9"
            floodColor="#61738c"
            floodOpacity=".15"
          />
        </filter>
      </defs>
      {GRAPH_EDGES.map((edge) => {
        const a = GRAPH_POSITIONS[edge.from],
          b = GRAPH_POSITIONS[edge.to];
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const dx = (b[0] - a[0]) / length,
          dy = (b[1] - a[1]) / length;
        const from = [a[0] + dx * 52, a[1] + dy * 52],
          to = [b[0] - dx * 62, b[1] - dy * 62];
        const active =
          snapshot?.activeEdge?.[0] === edge.from &&
          snapshot.activeEdge[1] === edge.to;
        const onPath = path.some(
          (v, i) => v === edge.from && path[i + 1] === edge.to,
        );
        const state = onPath
          ? "path"
          : !active
            ? "idle"
            : snapshot?.phase === "relax-success"
              ? "success"
              : snapshot?.phase === "relax-fail"
                ? "fail"
                : "active";
        const x = (from[0] + to[0]) / 2 - dy * 25,
          y = (from[1] + to[1]) / 2 + dx * 25;
        return (
          <g
            key={`${edge.from}-${edge.to}`}
            data-edge={`${edge.from}-${edge.to}`}
          >
            <title>{`${edge.from} → ${edge.to}, 가중치 ${edge.cost}`}</title>
            <motion.line
              key={onPath ? "final-path" : "edge"}
              x1={from[0]}
              y1={from[1]}
              x2={to[0]}
              y2={to[1]}
              stroke={colors[state]}
              strokeWidth={active || onPath ? 3.4 : 2.4}
              markerEnd={`url(#${uid}-${state})`}
              initial={{ pathLength: onPath && !reduced ? 0 : 1 }}
              animate={{
                opacity: path.length && !onPath ? 0.26 : 1,
                pathLength: 1,
              }}
              transition={{
                duration: reduced ? 0 : 0.45,
                delay: onPath && !reduced ? path.indexOf(edge.from) * 0.2 : 0,
              }}
            />
            <motion.g
              key={`${edge.from}-${edge.to}-${active ? snapshot?.id : "idle"}`}
              animate={{ scale: active ? [1, 1.12, 1] : 1 }}
              transition={{ duration: reduced ? 0 : 0.4 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <rect
                x={x - 25}
                y={y - 25}
                width="50"
                height="48"
                rx="7"
                fill="var(--paper)"
              />
              <text
                x={x}
                y={y + 11}
                textAnchor="middle"
                fontSize="34"
                fontWeight="500"
                fill={active || onPath ? colors[state] : "#52657e"}
              >
                {edge.cost}
              </text>
            </motion.g>
            {active && !reduced && snapshot?.phase === "inspect" && (
              <motion.circle
                key={snapshot.id}
                r="5"
                fill={colors.active}
                initial={{ cx: from[0], cy: from[1], opacity: 0 }}
                animate={{ cx: to[0], cy: to[1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}
      {GRAPH_NODES.map((node) => {
        const [x, y] = GRAPH_POSITIONS[node];
        const current =
          snapshot?.currentNode === node && snapshot.phase !== "stale";
        const changed =
          snapshot?.calculation?.to === node &&
          snapshot.phase === "relax-success";
        const settled = snapshot?.settled.includes(node);
        const fill = current
          ? "#3473df"
          : changed
            ? "#dcefe5"
            : node === 1
              ? "#f7d780"
              : node === 6
                ? "#f1ada4"
                : "#dfe8f3";
        const ink = current ? "#fff" : changed ? "#16815b" : "#223c5f";
        return (
          <g key={node} data-node={node}>
            {showDist && (
              <g
                className="node-dist"
                paintOrder="stroke"
                stroke="var(--paper)"
                strokeWidth="5"
                strokeLinejoin="round"
              >
                <text
                  x={x}
                  y={y - 102}
                  textAnchor="middle"
                  fontSize="27"
                  fill="#5e728e"
                >
                  dist[{node}]
                </text>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.text
                    key={snapshot?.dist[node] ?? "inf"}
                    x={x}
                    y={y - 66}
                    textAnchor="middle"
                    fontSize="36"
                    fill={changed ? "#16815b" : "#2968dd"}
                    fontFamily="var(--mono)"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  >
                    {snapshot?.dist[node] ?? "∞"}
                  </motion.text>
                </AnimatePresence>
              </g>
            )}
            <ellipse
              cx={x}
              cy={y + 13}
              rx="48"
              ry="45"
              fill="#b7c5d7"
              opacity=".4"
            />
            <motion.g
              animate={{ y: current ? -8 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              <circle
                cx={x}
                cy={y}
                r="48"
                fill={fill}
                stroke={current ? "#2460c9" : "#ffffffc9"}
                strokeWidth="2"
                filter={`url(#${uid}-shadow)`}
              />
              <text
                x={x}
                y={y + 13}
                textAnchor="middle"
                fontSize="42"
                fontWeight="700"
                fill={ink}
              >
                {node}
              </text>
            </motion.g>
            {settled && !current && (
              <text x={x + 47} y={y + 42} fill="#527397" fontSize="26">
                ✓
              </text>
            )}
            {current && (
              <text
                x={x}
                y={y + 90}
                fill="#2968dd"
                fontSize="28"
                textAnchor="middle"
                paintOrder="stroke"
                stroke="var(--paper)"
                strokeWidth="5"
                strokeLinejoin="round"
              >
                현재 정점
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
