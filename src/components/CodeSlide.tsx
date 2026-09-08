import { motion } from "framer-motion";
import {
  javaSections,
  javaSteps,
  gridSections,
  gridCodeSteps,
} from "../slides/code";

function Tokens({ line }: { line: string }) {
  return (
    <>
      {line
        .split(
          /(\b(?:int|for|if|while|continue|break|new)\b|\b(?:dist|distance|minCost|pq|map|graph|now|currentDistance|currentCost|currentX|currentY|nextX|nextY|dx|dy|nextNode|newDistance)\b|\b\d+\b)/g,
        )
        .map((part, i) => (
          <span
            key={i}
            className={
              /^(int|for|if|while|continue|break|new)$/.test(part)
                ? "syntax-keyword"
                : /^(dist|distance|minCost|pq|map|graph|now|currentDistance|currentCost|currentX|currentY|nextX|nextY|dx|dy|nextNode|newDistance)$/.test(part)
                  ? "syntax-variable"
                  : /^\d+$/.test(part)
                    ? "syntax-number"
                    : ""
            }
          >
            {part}
          </span>
        ))}
    </>
  );
}
export function CodeSlide({
  step,
  grid = false,
}: {
  step: number;
  grid?: boolean;
}) {
  const entry = (grid ? gridCodeSteps : javaSteps)[step],
    sections = grid ? gridSections : javaSections,
    section = sections[entry.section],
    code = section.code,
    focus = entry.focus,
    note = entry.note;
  return (
    <div className="code-layout java-code-layout">
      <div className="code-surface">
        <div className="code-heading">
          <span>Java</span>
          <span>{`${entry.section + 1} / ${sections.length} · ${section.title}`}</span>
        </div>
        <pre>
          <code>
            {code.map((line, i) => (
              <div
                key={i}
                className={`code-line ${line === "" ? "code-line-empty" : ""} ${i >= focus[0] && i <= focus[1] ? "code-active" : ""}`}
              >
                <span className="line-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <Tokens line={line} />
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
      <motion.div
        className="code-note"
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="note-number">{note[0]}</span>
        <h2>{note[1]}</h2>
        <p className="mono blue">{note[2]}</p>
        <p>{note[3]}</p>
        <div className="code-footnote">
          {grid ? "SWEA 1249 핵심 발췌" : "solution(n, start, roads) 핵심 발췌"}
        </div>
      </motion.div>
    </div>
  );
}
