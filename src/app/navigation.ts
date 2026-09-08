/** Fit the unchanged 16:9 slide into the space left beside the navigator. */
export function fitStage(width: number, height: number) {
  return Math.max(0, Math.min(width / 1920, height / 1080));
}

export function navigationFocusIndex(key: string, current: number, count: number) {
  if (count === 0) return undefined;
  switch (key) {
    case "ArrowUp": return Math.max(0, current - 1);
    case "ArrowDown": return Math.min(count - 1, current + 1);
    case "Home": return 0;
    case "End": return count - 1;
    default: return undefined;
  }
}
