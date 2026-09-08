import { algorithmChoices } from "../slides/algorithmChoices";
import { Reveal } from "./ConceptVisuals";
import { Icon } from "./Icon";
import { motion } from "framer-motion";

export function AlgorithmCandidates({ step }: { step: number }) {
  const complete = step >= algorithmChoices.length;
  return (
    <div className="algorithm-candidates">
      <p className="selection-lead">
        경로를 찾는 문제도, 목표와 비용 조건에 따라 선택이 달라진다.
      </p>
      <table className="algorithm-table">
        <thead>
          <tr>
            <th>알고리즘</th>
            <th>주로 검토하는 상황</th>
          </tr>
        </thead>
        <tbody>
          {algorithmChoices.map((algorithm, index) => (
            <motion.tr
              key={algorithm.id}
              initial={false}
              animate={{ opacity: step >= index ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              aria-hidden={step < index}
              className={
                complete && algorithm.id === "bfs" ? "candidate-bfs" : ""
              }
            >
              <th scope="row">{algorithm.name}</th>
              <td>{algorithm.purpose}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <Reveal show={complete} hiddenOpacity={0} className="selection-takeaway">
        격자와 상하좌우 이동을 보면 <strong>BFS</strong>가 떠오른다.
      </Reveal>
    </div>
  );
}

export function AlgorithmChoice({ step }: { step: number }) {
  return (
    <div className="algorithm-choice">
      <div className="problem-conditions" aria-label="보급로의 조건">
        <span>
          출발점 <strong>하나</strong>
        </span>
        <span>
          목표 <strong>최소 누적 비용</strong>
        </span>
        <span>
          비용 <strong>0~9 · 음수 없음</strong>
        </span>
      </div>
      <table className="algorithm-table choice-table">
        <thead>
          <tr>
            <th>후보</th>
            <th>보급로에서의 판단</th>
          </tr>
        </thead>
        <tbody>
          {algorithmChoices.map((algorithm) => {
            const selected = algorithm.id === "dijkstra" && step >= 3;
            return (
              <tr
                key={algorithm.id}
                className={selected ? "candidate-selected" : ""}
              >
                <th scope="row">{algorithm.name}</th>
                <td>
                  <Reveal show={step >= algorithm.revealAt}>
                    {selected && <Icon name="check" size={31} />}
                    <span>{algorithm.decision}</span>
                  </Reveal>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Reveal show={step >= 3} className="selection-takeaway selected-takeaway">
        누적 비용이 가장 작은 후보부터 탐색한다.
      </Reveal>
    </div>
  );
}
