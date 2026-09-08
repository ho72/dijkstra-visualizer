export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    next: "m9 5 7 7-7 7",
    previous: "m15 5-7 7 7 7",
    play: "m8 5 11 7-11 7V5",
    pause: "M8 5v14M16 5v14",
    reset: "M3 10a9 9 0 1 1 2 9M3 4v6h6",
    fullscreen: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
    help: "M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 4v.1",
    close: "m6 6 12 12M6 18 18 6",
    check: "m5 12 4 4L19 6",
    skip: "m5 5 9 7-9 7V5m13 0v14",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.next} />
    </svg>
  );
}
