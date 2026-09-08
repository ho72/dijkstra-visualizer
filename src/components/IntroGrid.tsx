const values = [
  [0, 1, 5, 3, 2],
  [2, 1, 2, 1, 4],
  [4, 1, 0, 2, 3],
  [3, 2, 1, 1, 2],
  [2, 4, 3, 1, 0],
];
const path = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [2, 2],
  [3, 2],
  [3, 3],
  [4, 3],
  [4, 4],
];
export function IntroGrid() {
  const point = (r: number, c: number) => [120 + c * 107, 105 + r * 107];
  const cells = values.flatMap((row, r) =>
    row.map((value, c) => {
      const [x, y] = point(r, c);
      const start = r === 0 && c === 0;
      const goal = r === 4 && c === 4;
      const onPath = path.some(([pr, pc]) => pr === r && pc === c);
      return {
        key: `${r}-${c}`,
        x,
        y,
        onPath,
        label: start ? "S" : goal ? "G" : value,
        background: start
          ? "#f8da87"
          : goal
            ? "#f4b5ac"
            : onPath
              ? "#e3edfd"
              : "#f0f4f8",
        foreground: start || goal ? "#283749" : onPath ? "#2866cf" : "#a7b4c4",
      };
    }),
  );
  return (
    <svg
      className="intro-grid"
      viewBox="0 0 680 680"
      role="img"
      aria-label="S에서 G까지 복구 비용이 적은 칸들을 연결한 격자 경로"
    >
      <defs>
        <filter id="tile-shadow">
          <feDropShadow
            dx="0"
            dy="9"
            stdDeviation="7"
            floodColor="#7890ae"
            floodOpacity=".12"
          />
        </filter>
      </defs>
      {cells.map(({ key, x, y, background, onPath }) => (
        <rect
          key={key}
          x={x - 43}
          y={y - 43}
          width="86"
          height="86"
          rx="13"
          fill={background}
          stroke={onPath ? "#c4d6f3" : "#e0e7ef"}
          filter="url(#tile-shadow)"
        />
      ))}
      <polyline
        points={path
          .map(([r, c]) => {
            const [x, y] = point(r, c);
            return `${x},${y}`;
          })
          .join(" ")}
        fill="none"
        stroke="#4b80df"
        strokeWidth="3"
        opacity=".65"
        strokeLinejoin="round"
      />
      {path.map(([r, c], i) => {
        const [x, y] = point(r, c);
        return <circle key={i} cx={x} cy={y} r="4" fill="#2968dd" />;
      })}
      {cells.map(({ key, x, y, label, background, foreground }) => (
        <text
          key={key}
          x={x}
          y={y + 10}
          textAnchor="middle"
          fill={foreground}
          stroke={background}
          strokeWidth="8"
          strokeLinejoin="round"
          paintOrder="stroke"
          fontSize="29"
          fontWeight="600"
        >
          {label}
        </text>
      ))}
      <text x="80" y="632" fontSize="18" fill="#7d8da2" fontFamily="monospace">
        S (0, 0)
      </text>
      <text
        x="588"
        y="632"
        textAnchor="end"
        fontSize="18"
        fill="#7d8da2"
        fontFamily="monospace"
      >
        G (N−1, N−1)
      </text>
    </svg>
  );
}
