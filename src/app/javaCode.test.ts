import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { CodeSlide } from "../components/CodeSlide";
import { slides } from "../slides/deck";
import { JAVA_TEMPLATE, javaSections, javaSteps, GRID_CODE, gridSections, gridCodeSteps } from "../slides/code";

test("Java excerpts retain the user's array-based directed-graph implementation", () => {
  const code = JAVA_TEMPLATE.join("\n");
  for (const line of [
    "List<int[]>[] graph = new ArrayList[n + 1];",
    "graph[from].add(new int[] {to, cost});",
    "int[] distance = new int[n + 1];",
    "Arrays.fill(distance, Integer.MAX_VALUE);",
    "Integer.compare(a[1], b[1])",
    "int[] current = pq.poll();",
    "int now = current[0];",
    "int currentDistance = current[1];",
    "if (currentDistance > distance[now])",
    "int nextNode = next[0];",
    "int cost = next[1];",
    "int newDistance = currentDistance + cost;",
    "if (newDistance < distance[nextNode])",
    "distance[nextNode] = newDistance;",
  ]) assert.ok(code.includes(line), line);
  assert.doesNotMatch(code, /\bNode\b|\bEdge\b|graph\[to\]\.add|System\.out|package |expected_answ/);
  assert.ok(code.indexOf("pq.poll()") < code.indexOf("currentDistance > distance[now]"));
  assert.ok(code.indexOf("continue;") < code.indexOf("for (int[] next"));
});

test("Java teaching steps select bounded excerpts and highlight the corresponding lines", () => {
  assert.equal(slides.find(s => s.id === "java")!.steps, 8);
  assert.deepEqual(javaSteps.map(s => s.section), [0, 1, 1, 2, 2, 2, 2, 2]);
  for (const section of javaSections) {
    assert.ok(section.code.length <= 20);
    assert.ok(section.code.every(line => line.length <= 60));
  }
  for (const [step, entry] of javaSteps.entries()) {
    const section = javaSections[entry.section];
    const [start, end] = entry.focus;
    assert.ok(start >= 0 && end < section.code.length && end >= start);
    const html = renderToStaticMarkup(createElement(CodeSlide, { step }));
    assert.equal((html.match(/class="code-line[\s"]/g) ?? []).length, section.code.length);
    assert.equal((html.match(/code-active/g) ?? []).length, end - start + 1);
    assert.ok(html.includes(entry.note[1]));
    assert.ok(!html.includes("undefined"));
  }
});

test("the SWEA grid code retains its own excerpt and highlighting", () => {
  assert.equal(slides.find(s => s.id === "grid-code")!.steps, 8);
  assert.deepEqual(gridCodeSteps.map(s => s.section), [0, 0, 1, 1, 1, 2, 2, 2]);
  for (const section of gridSections) {
    assert.ok(section.code.length <= 20);
    assert.ok(section.code.every(line => line.length <= 60));
  }
  for (const [step, entry] of gridCodeSteps.entries()) {
    const html = renderToStaticMarkup(createElement(CodeSlide, { step, grid: true }));
    assert.equal((html.match(/class="code-line[\s"]/g) ?? []).length, gridSections[entry.section].code.length);
    assert.equal((html.match(/code-active/g) ?? []).length, entry.focus[1] - entry.focus[0] + 1);
    assert.ok(entry.focus[0] >= 0 && entry.focus[1] < gridSections[entry.section].code.length);
    assert.ok(html.includes(entry.note[1]));
    assert.ok(html.includes("SWEA 1249"));
    assert.ok(!html.includes("solution(n, start, roads)"));
    assert.ok(!html.includes("undefined"));
  }
});

test("SWEA excerpts match the runnable user's algorithm and check staleness before early exit", () => {
  const normalize = (text: string) => text.replace(/\/\/[^\n]*/g, "").replace(/\s/g, "");
  const source = readFileSync(new URL("../../public/code/Solution.java", import.meta.url), "utf8");
  const code = GRID_CODE.join("\n");
  assert.ok(normalize(source).includes(normalize(code)));
  assert.doesNotMatch(code, /\bCell\b|\bdist\b|\bdr\b|\bdc\b/);
  assert.doesNotMatch(source, /System\.setIn|FileInputStream|^package /m);
  const poll = code.indexOf("int[] current = pq.poll()");
  const stale = code.indexOf("currentCost > minCost[currentX][currentY]");
  const target = code.indexOf("currentX == N - 1 && currentY == N - 1");
  const neighbors = code.indexOf("for (int dir = 0");
  assert.ok(poll >= 0 && poll < stale && stale < target && target < neighbors);
  assert.match(code, /Integer\.compare\(a\[2\], b\[2\]\)/);
  assert.match(code, /int cost = map\[nextX\]\[nextY\]/);
  assert.match(code, /int newDistance = currentCost \+ cost/);
});
