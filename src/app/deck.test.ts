import test from "node:test";
import assert from "node:assert/strict";
import { slides } from "../slides/deck";
import { chapters } from "../slides/chapters";
import { createPresentationReducer, readLocation } from "./presentationState";

test("deck opens with cover and agenda and has unique slide identifiers", () => {
  assert.equal(slides.length, 35);
  assert.deepEqual(
    slides.slice(0, 2).map((slide) => slide.kind),
    ["cover", "agenda"],
  );
  assert.equal(new Set(slides.map((slide) => slide.id)).size, slides.length);
  assert.deepEqual(slides.slice(-2).map(slide => slide.id), ["summary", "thanks"]);
  assert.equal(slides.at(-1)?.title, "감사합니다.");
  assert.equal(slides.at(-1)?.kind, "closing");
  assert.equal(slides.at(-1)?.steps, 1);
});

test("each chapter has one single-step introduction immediately before its content", () => {
  assert.equal(slides.filter((slide) => slide.kind === "chapter").length, 5);
  for (const chapter of chapters) {
    const index = slides.findIndex(
      (slide) => slide.id === `chapter-${chapter.number}`,
    );
    assert.ok(index > 1);
    assert.equal(slides[index].steps, 1);
    assert.equal(slides[index].title, chapter.title);
    assert.equal(slides[index + 1].kind, "content");
    assert.equal(slides[index + 1].section, chapter.number);
    assert.notEqual(slides[index - 1].section, chapter.number);
  }
});

test("selection introduces candidates and graph interpretation before BFS and its counterexample", () => {
  assert.deepEqual(
    slides
      .filter((slide) => slide.section === "02" && slide.kind === "content")
      .map((slide) => slide.id),
    ["candidates", "interpretation", "bfs", "counterexample", "choice"],
  );
});

test("only pages 05, 06, 09 and 10 reveal automatically with no manual steps", () => {
  const automatic = slides.filter(slide => slide.autoRevealStages !== undefined);
  assert.deepEqual(automatic.map(slide => slides.indexOf(slide) + 1), [5, 6, 9, 10]);
  assert.deepEqual(automatic.map(slide => slide.id),
    ["rules", "objective", "interpretation", "bfs"]);
  assert.deepEqual(automatic.map(slide => slide.autoRevealStages), [3, 3, 4, 4]);
  assert.deepEqual(automatic.map(slide => slide.autoRevealIntervalMs ?? 300), [300, 300, 300, 500]);
  const lengths = slides.map(slide => slide.steps);
  const reduce = createPresentationReducer(lengths);
  for (const slide of automatic) {
    const index = slides.indexOf(slide);
    assert.equal(slide.steps, 1);
    // Old shared step URLs are normalized to the single navigable state.
    const state = readLocation(`?scene=${index + 1}&step=4`, lengths);
    assert.equal(state.step, 0);
    assert.equal(reduce(state, { type: "next" }).index, index + 1);
    assert.equal(reduce(state, { type: "previous" }).index, index - 1);
    assert.deepEqual(reduce(state, { type: "play" }), state);
    assert.deepEqual(reduce(state, { type: "tick" }), state);
  }
  assert.equal(slides.find(slide => slide.id === "counterexample")?.steps, 3);
  assert.equal(slides.find(slide => slide.id === "choice")?.steps, 4);
});

test("page 08 has two manual steps with reversible navigation and URL restoration", () => {
  assert.equal(slides[7].id, "candidates");
  assert.equal(slides[7].steps, 2);
  assert.equal(slides[7].autoRevealStages, undefined);
  const lengths = slides.map(slide => slide.steps);
  const reduce = createPresentationReducer(lengths);
  const first = readLocation("?scene=8&step=1", lengths);
  const second = reduce(first, { type: "next" });
  assert.equal(second.index, 7);
  assert.equal(second.step, 1);
  assert.deepEqual(second, readLocation("?scene=8&step=2", lengths));
  assert.deepEqual(reduce(second, { type: "previous" }), first);
  assert.equal(reduce(second, { type: "next" }).index, 8);
});

test("grid execution follows the code directly inside chapter four", () => {
  const codeIndex = slides.findIndex(slide => slide.id === "grid-code");
  assert.deepEqual(slides.slice(codeIndex, codeIndex + 3).map(slide => slide.id),
    ["grid-code", "grid-execution", "grid-result"]);
  for (const slide of slides.slice(codeIndex, codeIndex + 3)) {
    assert.equal(slide.section, "04");
    assert.equal(slide.sectionName, "보급로에 적용");
    assert.equal(slide.kind, "content");
  }
  assert.equal(slides[codeIndex + 1].steps, 16);
  assert.deepEqual(chapters.map(chapter => chapter.number), ["01", "02", "03", "04", "05"]);
  assert.equal(slides.filter(slide => slide.kind === "chapter" && slide.title === "격자 실행").length, 0);
  assert.equal(slides[codeIndex + 3].title, "정리");
});

test("selection criteria and recap share one final chapter without an extra divider", () => {
  assert.deepEqual(slides.slice(-5).map(slide => slide.id),
    ["chapter-05", "recognition", "comparison", "summary", "thanks"]);
  for (const slide of slides.slice(-5)) {
    assert.equal(slide.section, "05");
    assert.equal(slide.sectionName, "정리");
  }
  assert.equal(slides.filter(slide => slide.kind === "chapter" && slide.title === "정리").length, 1);
  assert.equal(slides.find(slide => slide.id === "recognition")?.steps, 5);
});

test("all actual slide steps and chapter boundaries support next/previous and URL restoration", () => {
  const lengths = slides.map((slide) => slide.steps);
  const reduce = createPresentationReducer(lengths);
  let state = readLocation("", lengths);
  const totalSteps = lengths.reduce((sum, count) => sum + count, 0);
  for (let i = 0; i < totalSteps - 1; i++) {
    const next = reduce(state, { type: "next" });
    assert.deepEqual(reduce(next, { type: "previous" }), state);
    assert.deepEqual(
      readLocation(`?scene=${next.index + 1}&step=${next.step + 1}`, lengths),
      next,
    );
    state = next;
  }
  assert.equal(state.index, slides.length - 1);
  assert.deepEqual(reduce(state, { type: "next" }), state);
});

test("Dijkstra teaches the rules before the complete walkthrough without repeating relaxation", () => {
  assert.deepEqual(
    slides.filter(slide => slide.section === "03" && slide.kind === "content").map(slide => slide.id),
    ["idea", "dist", "pq", "cycle", "relaxation", "no-update", "settlement", "stale", "execution", "graph-result", "java"],
  );
  assert.equal(slides.find(slide => slide.id === "execution")!.steps, 17);
  assert.equal(slides.find(slide => slide.id === "stale")!.steps, 5);
});
