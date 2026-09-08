import test from "node:test";
import assert from "node:assert/strict";
import { createPresentationReducer, readLocation } from "./presentationState";
import type { PresentationState } from "./presentationState";
const lengths = [1, 4, 26, 3, 1];
const reduce = createPresentationReducer(lengths);
const init: PresentationState = {
  index: 0,
  step: 0,
  playing: false,
  revision: 0,
};

test("every next/previous pair restores the exact scene and step", () => {
  let state = init;
  for (let i = 0; i < lengths.reduce((a, b) => a + b, 0) - 1; i++) {
    const next = reduce(state, { type: "next" });
    assert.deepEqual(reduce(next, { type: "previous" }), state);
    state = next;
  }
  assert.deepEqual(reduce(state, { type: "next" }), state);
  assert.deepEqual(reduce(init, { type: "previous" }), init);
});
test("reset clears current playback without leaving the scene", () => {
  const state = { index: 2, step: 17, playing: true, revision: 0 };
  assert.deepEqual(reduce(state, { type: "reset" }), {
    index: 2,
    step: 0,
    playing: false,
    revision: 1,
  });
});
test("autoplay ends at the last step and never spills into the next scene", () => {
  let state = { index: 3, step: 0, playing: true, revision: 0 };
  for (let i = 0; i < 10; i++) state = reduce(state, { type: "tick" });
  assert.equal(state.index, 3);
  assert.equal(state.step, 2);
  assert.equal(state.playing, false);
  const replay = reduce(state, { type: "play" });
  assert.equal(replay.step, 0);
  assert.equal(replay.playing, true);
});
test("arbitrary step jumps and skipped scenes are bounded", () => {
  let state = reduce(init, { type: "jump", index: 2, step: 999 });
  assert.equal(state.step, 25);
  state = reduce(state, { type: "skip" });
  assert.equal(state.index, 3);
  assert.equal(state.step, 0);
  assert.equal(reduce(state, { type: "step", step: -50 }).step, 0);
  assert.equal(reduce(state, { type: "home" }).index, 0);
  assert.equal(reduce(state, { type: "end" }).index, 4);
});
test("refresh and malformed URLs restore a valid deterministic state", () => {
  assert.deepEqual(readLocation("?scene=3&step=18", lengths), {
    index: 2,
    step: 17,
    playing: false,
    revision: 0,
  });
  assert.equal(readLocation("?scene=-99&step=NaN", lengths).index, 0);
  assert.equal(readLocation("?scene=999&step=999", lengths).index, 4);
  assert.equal(readLocation("?scene=Infinity&step=Infinity", lengths).step, 0);
});
