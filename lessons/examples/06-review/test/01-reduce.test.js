import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { reduce } = await load("01-reduce.js");
const sum = (a, b) => a + b;

test("initialValue-тэй үед ажиллана", () => {
  assert.equal(reduce([1, 2, 3], sum, 10), 16);
});

test("initialValue өгөөгүй бол эхний элементээс эхэлнэ", () => {
  assert.equal(reduce([1, 2, 3], sum), 6);
});

test("хоосон массив, initialValue-гүй бол TypeError", () => {
  assert.throws(() => reduce([], sum), TypeError);
});

test("хоосон массив, initialValue-тэй бол initialValue", () => {
  assert.equal(reduce([], sum, 0), 0);
});
