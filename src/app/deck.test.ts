import test from "node:test";
import assert from "node:assert/strict";
import { slides } from "../slides/deck";
import { chapters } from "../slides/chapters";
import { createPresentationReducer, readLocation } from "./presentationState";

test("deck opens with cover and agenda and has unique slide identifiers", () => {
  assert.equal(slides.length, 36);
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
  assert.equal(slides.filter((slide) => slide.kind === "chapter").length, 6);
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
  assert.deepEqual(chapters.map(chapter => chapter.number), ["01", "02", "03", "04", "05", "06"]);
  assert.equal(slides.filter(slide => slide.kind === "chapter" && slide.title === "격자 실행").length, 0);
  assert.equal(slides[codeIndex + 3].title, "코테에서 알아보기");
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
