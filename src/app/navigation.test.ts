import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { SlideNavigator } from "../components/SlideNavigator";
import { slides } from "../slides/deck";
import { fitStage, navigationFocusIndex } from "./navigation";
import { createPresentationReducer, readLocation } from "./presentationState";

test("the stage fits the available pane while preserving the 16:9 slide", () => {
  for (const [width, height] of [[1640, 1080], [1920, 1080], [232, 844], [2560, 720], [0, 0]]) {
    const scale = fitStage(width, height);
    assert.ok(scale >= 0);
    assert.ok(1920 * scale <= width + 1e-9);
    assert.ok(1080 * scale <= height + 1e-9);
    assert.ok(Math.abs(1920 * scale - width) < 1e-9 || Math.abs(1080 * scale - height) < 1e-9);
  }
  assert.equal(fitStage(1920, 1080), 1);
  assert.equal(fitStage(1920 - 280, 1080), 1640 / 1920);
  assert.ok(fitStage(1920 - 280, 1080) < fitStage(1920, 1080));
});

test("navigator focus keys stay within the list and leave activation to native buttons", () => {
  assert.equal(navigationFocusIndex("ArrowUp", 0, 36), 0);
  assert.equal(navigationFocusIndex("ArrowDown", 35, 36), 35);
  assert.equal(navigationFocusIndex("ArrowUp", 27, 36), 26);
  assert.equal(navigationFocusIndex("ArrowDown", 27, 36), 28);
  assert.equal(navigationFocusIndex("Home", 27, 36), 0);
  assert.equal(navigationFocusIndex("End", 27, 36), 35);
  assert.equal(navigationFocusIndex("Home", 0, 0), undefined);
  for (const key of ["Enter", " ", "f", "ArrowRight"]) {
    assert.equal(navigationFocusIndex(key, 27, 36), undefined);
  }
});

test("the navigator renders every slide and exactly one accessible current page", () => {
  for (const activeIndex of [0, 27, slides.length - 1]) {
    const markup = renderToStaticMarkup(createElement(SlideNavigator, {
      slides, activeIndex, disabled: false, onSelect: () => {}, onPresent: () => {},
    }));
    assert.equal((markup.match(/<li>/g) ?? []).length, slides.length);
    assert.equal((markup.match(/aria-controls="presentation-stage"/g) ?? []).length, slides.length);
    assert.equal((markup.match(/aria-current="page"/g) ?? []).length, 1);
    assert.equal((markup.match(/navigator-chapter/g) ?? []).length, 6);
    assert.ok(markup.includes(`title="${slides[activeIndex].title}" aria-current="page"`));
    assert.equal((markup.match(/class="navigator-preview"/g) ?? []).length, slides.length);
    for (const slide of slides) assert.ok(markup.includes(slide.title));
    assert.ok(markup.includes('aria-label="전체화면으로 발표"'));
    assert.ok(!markup.includes('inert=""'));
  }
  const disabled = renderToStaticMarkup(createElement(SlideNavigator, {
    slides, activeIndex: 27, disabled: true, onSelect: () => {}, onPresent: () => {},
  }));
  assert.ok(disabled.includes('inert=""'));
});

test("every navigator image is a captured JPEG asset with a stable slide-id filename", () => {
  for (const slide of slides) {
    const bytes = readFileSync(new URL(`../../public/slide-thumbnails/${slide.id}.jpg`, import.meta.url));
    assert.ok(bytes.length > 1000, `${slide.id} has a real screenshot`);
    assert.equal(bytes.readUInt16BE(0), 0xffd8, `${slide.id} is a JPEG`);
    assert.equal(bytes.readUInt16BE(bytes.length - 2), 0xffd9, `${slide.id} is complete`);
  }
});

test("selecting any listed slide pauses playback, starts at step one, and restores from its URL", () => {
  const lengths = slides.map(slide => slide.steps);
  const reduce = createPresentationReducer(lengths);
  const previous = { index: 27, step: 5, playing: true, revision: 0 };
  for (let index = 0; index < slides.length; index++) {
    const selected = reduce(previous, { type: "jump", index });
    assert.deepEqual(selected, { index, step: 0, playing: false, revision: 0 });
    assert.deepEqual(readLocation(`?scene=${index + 1}&step=1`, lengths), selected);
  }
  assert.deepEqual(previous, { index: 27, step: 5, playing: true, revision: 0 });
});
