export type Edge = { from: number; to: number; cost: number };
export type QueueEntry = {
  id: number;
  node: number;
  cost: number;
  stale?: boolean;
};
export type Calculation = {
  from: number;
  to: number;
  currentCost: number;
  edgeCost: number;
  newCost: number;
  oldCost: number | null;
  updated: boolean;
};
export type DijkstraStep = {
  id: string;
  phase:
    | "init"
    | "select"
    | "inspect"
    | "relax-success"
    | "relax-fail"
    | "stale"
    | "complete";
  currentNode?: number;
  currentCost?: number;
  activeEdge?: [number, number];
  dist: Record<number, number | null>;
  queue: QueueEntry[];
  settled: number[];
  previous: Record<number, number | null>;
  calculation?: Calculation;
  message: string;
};
