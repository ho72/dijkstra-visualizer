import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeSlide } from "../components/CodeSlide";
import { slides } from "../slides/deck";
import { JAVA_TEMPLATE, javaSections, javaSteps, GRID_CODE, gridFocus } from "../slides/code";

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
  for (let step = 0; step < gridFocus.length; step++) {
    const html = renderToStaticMarkup(createElement(CodeSlide, { step, grid: true }));
    assert.equal((html.match(/class="code-line[\s"]/g) ?? []).length, GRID_CODE.length);
    assert.ok(html.includes("SWEA 1249"));
    assert.ok(!html.includes("solution(n, start, roads)"));
  }
});
