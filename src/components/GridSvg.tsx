import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GRID } from "../dijkstra/graph";
import type { DijkstraStep } from "../dijkstra/types";

export function GridSvg({
  snapshot,
  path = [],
  wave = -1,
  selected,
  onSelect,
  graph = false,
  reveal = 4,
  showDist = false,
}: {
  snapshot?: DijkstraStep;
  path?: number[];
  wave?: number;
  selected?: number;
  onSelect?: (node: number) => void;
  graph?: boolean;
  reveal?: number;
  showDist?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  const reduced = useReducedMotion();
  const current = snapshot?.currentNode ?? selected;
  const point = (n: number) => [
    168 + (n % 3) * 182,
    145 + Math.floor(n / 3) * 182,
  ];
  return (
    <svg
      className="grid-svg"
      viewBox="0 0 700 680"
      role={onSelect ? "group" : "img"}
      aria-label="3×3 보급로 격자. 0 1 5 / 2 1 2 / 4 1 0. S는 (0,0), G는 (2,2)"
    >
      <defs>
        <filter id={`${uid}-shadow`}>
          <feDropShadow
            dx="0"
            dy="7"
            stdDeviation="6"
            floodColor="#617999"
            floodOpacity=".1"
          />
        </filter>
        <marker
          id={`${uid}-arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="m2 1 6 4-6 4"
            fill="none"
            stroke="#2968dd"
            strokeWidth="1.6"
          />
        </marker>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <text
            x={168 + i * 182}
            y="42"
            textAnchor="middle"
            fill="#637792"
            fontSize="28"
          >
            {i}
          </text>
          <text
            x="43"
            y={153 + i * 182}
            textAnchor="middle"
            fill="#637792"
            fontSize="28"
          >
            {i}
          </text>
        </g>
      ))}
      {graph &&
        Array.from({ length: 9 }, (_, n) => {
          const [x, y] = point(n);
          return (
            <g key={n}>
              {n % 3 < 2 && (
                <path
                  d={`M${x + 40} ${y}h102`}
                  stroke="#aebed0"
                  strokeWidth="3"
                />
              )}
              {n < 6 && (
                <path
                  d={`M${x} ${y + 40}v102`}
                  stroke="#aebed0"
                  strokeWidth="3"
                />
              )}
            </g>
          );
        })}
      {GRID.flatMap((row, r) =>
        row.map((cost, c) => {
          const n = r * 3 + c,
            [x, y] = point(n),
            isCurrent = current === n,
            updated =
              snapshot?.calculation?.to === n &&
              snapshot.phase === "relax-success";
          const onPath = path.includes(n),
            reached =
              snapshot?.dist[n] !== null && snapshot?.dist[n] !== undefined;
          const fill = isCurrent
            ? "#3473df"
            : n === 0
              ? "#f8dda0"
              : n === 8
                ? "#f4b8af"
                : updated
                  ? "#deefe5"
                  : onPath
                    ? "#dfebfe"
                    : wave >= r + c
                      ? "#e0ebfc"
                      : reached
                        ? "#e9f0fa"
                        : "#f0f4f8";
          const color = isCurrent ? "#fff" : "#29415f";
          const activate = () => onSelect?.(n);
          return (
            <motion.g
              key={n}
              data-tile={n}
              animate={{ y: isCurrent ? -8 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={
                onSelect ? `좌표 (${r}, ${c}), 칸 비용 ${cost}` : undefined
              }
              onClick={activate}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  activate();
                }
              }}
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              {graph ? (
                <circle
                  cx={x}
                  cy={y}
                  r="43"
                  fill={fill}
                  stroke="#bdcfe6"
                  strokeWidth="2"
                />
              ) : (
                <>
                  <rect
                    x={x - 75}
                    y={y - 66}
                    width="150"
                    height="146"
                    rx="13"
                    fill="#cbd7e6"
                    opacity=".6"
                  />
                  <rect
                    x={x - 75}
                    y={y - 75}
                    width="150"
                    height="146"
                    rx="13"
                    fill={fill}
                    stroke={
                      isCurrent ? "#2662c8" : onPath ? "#a9c5f2" : "#d6e0eb"
                    }
                    strokeWidth={onPath ? 2.5 : 1.5}
                    filter={`url(#${uid}-shadow)`}
                  />
                </>
              )}
              {reveal >= 1 && !graph && (n === 0 || n === 8) && (
                <text
                  x={x - 53}
                  y={y - 43}
                  fill={n === 0 ? "#987018" : "#b65c51"}
                  fontWeight="700"
                  fontSize="27"
                >
                  {n === 0 ? "S" : "G"}
                </text>
              )}
              {!showDist && (
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fill={color}
                  fontSize={graph ? 34 : 43}
                  fontWeight="500"
                >
                  {wave >= 0 ? r + c : cost}
                </text>
              )}
              {showDist && (
                <>
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={isCurrent ? "#e0ebff" : "#5f738d"}
                    fontSize="25"
                  >
                    칸 비용 {cost}
                  </text>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.text
                      key={snapshot?.dist[n] ?? "inf"}
                      x={x}
                      y={y + 31}
                      textAnchor="middle"
                      fill={
                        isCurrent ? "white" : updated ? "#16815b" : "#2968dd"
                      }
                      fontSize="44"
                      fontFamily="var(--mono)"
                      initial={{ opacity: 0, y: 9 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -9 }}
                    >
                      {snapshot?.dist[n] ?? "∞"}
                    </motion.text>
                  </AnimatePresence>
                </>
              )}
              {snapshot?.settled.includes(n) && !isCurrent && !graph && (
                <text x={x + 49} y={y + 57} fill="#526e91" fontSize="25">
                  ✓
                </text>
              )}
              {isCurrent && !graph && (
                <text
                  x={x}
                  y={y + 61}
                  textAnchor="middle"
                  fill="white"
                  fontSize="22"
                >
                  현재 위치
                </text>
              )}
            </motion.g>
          );
        }),
      )}
      {path.length > 0 && (
        <motion.polyline
          key={path.join("-")}
          points={path
            .map((n) => {
              const [x, y] = point(n);
              return `${x - 49},${y + 49}`;
            })
            .join(" ")}
          fill="none"
          stroke="#2968dd"
          strokeWidth="4"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.9 }}
        />
      )}
      {snapshot?.activeEdge &&
        snapshot.phase === "relax-success" &&
        !reduced && (
          <motion.circle
            key={snapshot.id}
            r="6"
            fill="#16815b"
            initial={{
              cx: point(snapshot.activeEdge[0])[0],
              cy: point(snapshot.activeEdge[0])[1],
              opacity: 0,
            }}
            animate={{
              cx: point(snapshot.activeEdge[1])[0],
              cy: point(snapshot.activeEdge[1])[1],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.65 }}
          />
        )}
      {selected !== undefined &&
        reveal >= 3 &&
        [-3, 1, 3, -1]
          .filter(
            (d) =>
              selected + d >= 0 &&
              selected + d < 9 &&
              (Math.abs(d) === 3 ||
                Math.floor((selected + d) / 3) === Math.floor(selected / 3)),
          )
          .map((d) => {
            const a = point(selected),
              b = point(selected + d),
              dx = (b[0] - a[0]) / 182,
              dy = (b[1] - a[1]) / 182;
            return (
              <path
                key={d}
                d={`M${a[0] + dx * 82} ${a[1] + dy * 82}L${b[0] - dx * 85} ${b[1] - dy * 85}`}
                stroke="#2968dd"
                strokeWidth="4"
                markerEnd={`url(#${uid}-arrow)`}
              />
            );
          })}
      <text x="350" y="646" textAnchor="middle" fontSize="28" fill="#5c718e">
        {showDist
          ? "큰 숫자 = 현재 minCost"
          : wave >= 0
            ? "숫자 = 시작점에서의 이동 횟수"
            : "숫자 = 해당 칸의 복구 시간"}
      </text>
    </svg>
  );
}
