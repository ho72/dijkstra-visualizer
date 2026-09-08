export type PresentationState = {
  index: number;
  step: number;
  playing: boolean;
  revision: number;
};
export type Action =
  | {
      type:
        | "next"
        | "previous"
        | "home"
        | "end"
        | "reset"
        | "play"
        | "pause"
        | "tick"
        | "skip";
    }
  | { type: "jump"; index: number; step?: number }
  | { type: "step"; step: number };
export function createPresentationReducer(lengths: number[]) {
  const last = lengths.length - 1;
  return (state: PresentationState, action: Action): PresentationState => {
    const maxStep = lengths[state.index] - 1;
    switch (action.type) {
      case "next":
        return state.step < maxStep
          ? { ...state, step: state.step + 1, playing: false }
          : state.index < last
            ? { ...state, index: state.index + 1, step: 0, playing: false }
            : { ...state, playing: false };
      case "previous":
        return state.step > 0
          ? { ...state, step: state.step - 1, playing: false }
          : state.index > 0
            ? {
                ...state,
                index: state.index - 1,
                step: lengths[state.index - 1] - 1,
                playing: false,
              }
            : { ...state, playing: false };
      case "home":
        return { ...state, index: 0, step: 0, playing: false };
      case "end":
        return { ...state, index: last, step: 0, playing: false };
      case "reset":
        return {
          ...state,
          step: 0,
          playing: false,
          revision: state.revision + 1,
        };
      case "pause":
        return { ...state, playing: false };
      case "play":
        return maxStep === 0
          ? state
          : {
              ...state,
              step: state.step === maxStep ? 0 : state.step,
              playing: !state.playing,
            };
      case "tick":
        return state.step < maxStep
          ? {
              ...state,
              step: state.step + 1,
              playing: state.step + 1 < maxStep,
            }
          : { ...state, playing: false };
      case "skip":
        return state.index < last
          ? { ...state, index: state.index + 1, step: 0, playing: false }
          : { ...state, step: maxStep, playing: false };
      case "step":
        return {
          ...state,
          step: Math.max(0, Math.min(maxStep, Math.trunc(action.step) || 0)),
          playing: false,
        };
      case "jump": {
        const index = Math.max(
          0,
          Math.min(last, Math.trunc(action.index) || 0),
        );
        return {
          ...state,
          index,
          step: Math.max(
            0,
            Math.min(lengths[index] - 1, Math.trunc(action.step ?? 0) || 0),
          ),
          playing: false,
        };
      }
    }
  };
}
export function readLocation(
  search: string,
  lengths: number[],
): PresentationState {
  const params = new URLSearchParams(search);
  const base: PresentationState = {
    index: 0,
    step: 0,
    playing: false,
    revision: 0,
  };
  return createPresentationReducer(lengths)(base, {
    type: "jump",
    index: Number(params.get("scene") ?? 1) - 1,
    step: Number(params.get("step") ?? 1) - 1,
  });
}
