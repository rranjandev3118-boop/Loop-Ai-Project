import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateScrollProgress } from "../lib/scroll-progress";

test("scroll progress is empty at the top and complete at the bottom", () => {
  assert.equal(calculateScrollProgress(0, 2_000, 1_000), 0);
  assert.equal(calculateScrollProgress(1_000, 2_000, 1_000), 1);
});

test("scroll progress reverses continuously as scroll position decreases", () => {
  assert.equal(calculateScrollProgress(750, 2_000, 1_000), 0.75);
  assert.equal(calculateScrollProgress(500, 2_000, 1_000), 0.5);
  assert.equal(calculateScrollProgress(250, 2_000, 1_000), 0.25);
});

test("scroll progress clamps invalid overscroll and handles short documents", () => {
  assert.equal(calculateScrollProgress(-10, 2_000, 1_000), 0);
  assert.equal(calculateScrollProgress(1_200, 2_000, 1_000), 1);
  assert.equal(calculateScrollProgress(0, 800, 1_000), 0);
});
