import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { Counter } = await load("10-counter.js");

test("addAll бүх тоог нэмнэ", () => {
  assert.equal(new Counter().addAll([1, 2, 3]), 6);
});

test("add-ийг дангаар нь ч ашиглаж болно", () => {
  const c = new Counter();
  c.add(5);
  assert.equal(c.total, 5);
});
