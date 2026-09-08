import { motion } from "framer-motion";
import {
  javaSections,
  javaSteps,
  GRID_CODE,
  gridFocus,
  gridNotes,
} from "../slides/code";

function Tokens({ line }: { line: string }) {
  return (
    <>
      {line
        .split(
          /(\b(?:int|for|if|while|continue|new)\b|\b(?:dist|distance|pq|map|graph|now|currentDistance|nextNode|newDistance|nextCost|cur|edge)\b|\b\d+\b)/g,
        )
        .map((part, i) => (
          <span
            key={i}
            className={
              /^(int|for|if|while|continue|new)$/.test(part)
                ? "syntax-keyword"
                : /^(dist|distance|pq|map|graph|now|currentDistance|nextNode|newDistance|nextCost)$/.test(part)
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
  const javaStep = javaSteps[step],
    section = grid ? undefined : javaSections[javaStep.section],
    code = grid ? GRID_CODE : section!.code,
    focus = grid ? gridFocus[step] : javaStep.focus,
    note = grid ? gridNotes[step] : javaStep.note;
  return (
    <div className={`code-layout ${grid ? "" : "java-code-layout"}`}>
      <div className="code-surface">
        <div className="code-heading">
          <span>Java</span>
          <span>{grid ? "SWEA 1249" : `${javaStep.section + 1} / 3 · ${section!.title}`}</span>
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
        {!grid && <div className="code-footnote">solution(n, start, roads) 핵심 발췌</div>}
        {grid && (
          <div className="code-footnote">
            PQ는 cost 오름차순
            <br />
            dr = {"{ −1, 0, 1, 0 }"}
            <br />
            dc = {"{ 0, 1, 0, −1 }"}
          </div>
        )}
      </motion.div>
    </div>
  );
}
