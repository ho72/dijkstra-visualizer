export const AUTO_REVEAL_INTERVAL_MS = 300;

// Schedule a finite entrance sequence, never a presentation navigation action.
// Cleanup cancels pending phases on slide exit, reset, or StrictMode remount.
export function scheduleAutomaticReveal(
  stages: number,
  onReveal: (stage: number) => void,
  intervalMs = AUTO_REVEAL_INTERVAL_MS,
) {
  const timers = Array.from({ length: Math.max(0, stages - 1) }, (_, index) =>
    setTimeout(() => onReveal(index + 1), (index + 1) * intervalMs),
  );
  return () => timers.forEach(clearTimeout);
}
