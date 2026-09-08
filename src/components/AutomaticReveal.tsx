import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { scheduleAutomaticReveal } from "../app/automaticReveal";

// Mount inside the keyed slide, after the outgoing slide's exit has completed.
// Content phases never change the presentation step or restart on parent renders.
export function AutomaticReveal({
  stages,
  children,
}: {
  stages: number;
  children: (stage: number) => ReactNode;
}) {
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    return scheduleAutomaticReveal(stages, setStage);
  }, [stages, reduced]);

  return children(reduced ? stages - 1 : stage);
}
