import { Component, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { GRAPH_EDGES, GRAPH_POSITIONS, GRID } from "../dijkstra/graph";
import { GridSvg } from "../components/GridSvg";
import { GraphSvg } from "../components/GraphSvg";

const gridPosition = (i: number) =>
  new THREE.Vector3(((i % 3) - 1) * 2, (1 - Math.floor(i / 3)) * 2, 0);
const graphPosition = (i: number) => {
  const p = GRAPH_POSITIONS[i + 1];
  return p
    ? new THREE.Vector3((p[0] - 600) / 120, (330 - p[1]) / 110, 0)
    : gridPosition(i);
};

function NumberLabel({
  text,
  color = "#29415f",
}: {
  text: string;
  color?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.font = '500 80px "Arial", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 65);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.23]}>
      <planeGeometry args={[1.3, 0.65]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
function MorphNode({
  index,
  step,
  reduced,
}: {
  index: number;
  step: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);
  const invalidate = useThree((s) => s.invalidate);
  const target = useMemo(
    () => (step === 0 ? graphPosition(index) : gridPosition(index)),
    [index, step],
  );
  const initial = useRef(
    step === 0 ? graphPosition(index) : gridPosition(index),
  );
  const tile = step >= 2;
  const visible = index < 6 || tile;
  const fill =
    index === 0
      ? "#f6d58b"
      : tile && index === 8
        ? "#efaaa0"
        : !tile && index === 5
          ? "#efaaa0"
          : "#dce7f5";
  useEffect(() => {
    invalidate();
  }, [step, invalidate]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const distance = ref.current.position.distanceTo(target);
    if (reduced) ref.current.position.copy(target);
    else if (distance > 0.002) {
      ref.current.position.lerp(target, 1 - Math.exp(-10 * delta));
      invalidate();
    }
  });
  return (
    <group ref={ref} position={initial.current} visible={visible}>
      <mesh position={[0, -0.04, -0.095]}>
        <boxGeometry args={tile ? [1.37, 1.37, 0.09] : [0, 0, 0]} />
        <meshStandardMaterial color="#b5c8e2" />
      </mesh>
      {tile ? (
        <mesh>
          <boxGeometry args={[1.4, 1.4, 0.15]} />
          <meshStandardMaterial color={fill} roughness={0.85} />
        </mesh>
      ) : (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.14, 48]} />
          <meshStandardMaterial color={fill} roughness={0.85} />
        </mesh>
      )}
      <NumberLabel
        text={
          tile
            ? String(GRID[Math.floor(index / 3)][index % 3])
            : String(index + 1)
        }
      />
    </group>
  );
}
function Connections({ step }: { step: number }) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    if (step === 0) {
      for (const edge of GRAPH_EDGES) {
        const a = graphPosition(edge.from - 1),
          b = graphPosition(edge.to - 1),
          direction = b.clone().sub(a).normalize();
        a.addScaledVector(direction, 0.65);
        b.addScaledVector(direction, -0.7);
        points.push(a.x, a.y, -0.02, b.x, b.y, -0.02);
      }
    } else if (step < 2) {
      for (let n = 0; n < 9; n++) {
        if (n >= 6) continue;
        const a = gridPosition(n);
        if (n % 3 < 2) {
          const b = gridPosition(n + 1);
          points.push(a.x + 0.65, a.y, -0.02, b.x - 0.65, b.y, -0.02);
        }
        if (n < 3) {
          const b = gridPosition(n + 3);
          points.push(a.x, a.y - 0.65, -0.02, b.x, b.y + 0.65, -0.02);
        }
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    return result;
  }, [step]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#adbfd5" transparent opacity={0.8} />
    </lineSegments>
  );
}
function Scene({ step, reduced }: { step: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const invalidate = useThree((s) => s.invalidate);
  const xTarget = step >= 2 ? -0.13 : 0;
  useEffect(() => {
    invalidate();
  }, [step, invalidate]);
  useFrame((_, delta) => {
    if (!group.current) return;
    const difference = xTarget - group.current.rotation.x;
    if (reduced) group.current.rotation.x = xTarget;
    else if (Math.abs(difference) > 0.001) {
      group.current.rotation.x += difference * (1 - Math.exp(-8 * delta));
      invalidate();
    }
  });
  return (
    <>
      <ambientLight intensity={2.2} />
      <directionalLight position={[-3, 5, 9]} intensity={1.8} />
      <group ref={group}>
        <Connections step={step} />
        {Array.from({ length: 9 }, (_, i) => (
          <MorphNode key={i} index={i} step={step} reduced={reduced} />
        ))}
      </group>
    </>
  );
}
class WebGLFallback extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <GridSvg /> : this.props.children;
  }
}
export default function GraphToGridScene({ step }: { step: number }) {
  const reduced = Boolean(useReducedMotion());
  return (
    <div
      className="three-morph"
      role="img"
      aria-label={
        step < 2
          ? "6개 정점이 행과 열로 정렬되는 그래프"
          : "정점이 3×3 격자 타일로 변환됨. 칸의 값 0 1 5 / 2 1 2 / 4 1 0"
      }
    >
      {step === 0 && (
        <div className="morph-source-graph">
          <GraphSvg />
        </div>
      )}
      <WebGLFallback>
        <Canvas
          resize={{ offsetSize: true }}
          style={{ opacity: step === 0 ? 0 : 1 }}
          orthographic
          camera={{ position: [0, 0, 12], zoom: 80, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          frameloop="demand"
          gl={{ alpha: true, antialias: true }}
          fallback={<GridSvg />}
        >
          <Scene step={step} reduced={reduced} />
        </Canvas>
      </WebGLFallback>
      {step >= 2 && (
        <div className="morph-coordinate-labels">
          <span>S (0, 0)</span>
          <span>G (N−1, N−1)</span>
        </div>
      )}
    </div>
  );
}
