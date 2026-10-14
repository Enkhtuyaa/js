import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { topScores } = await load("11-top-scores.js");

test("тоогоор (үсгээр биш) эрэмбэлнэ", () => {
  assert.deepEqual(topScores([5, 100, 20, 9]), [100, 20, 9]);
});

test("оролтын массивыг өөрчлөхгүй", () => {
  const scores = [5, 100, 20, 9];
  topScores(scores);
  assert.deepEqual(scores, [5, 100, 20, 9]);
});
