import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { normalizeItem } = await load("13-normalize-item.js");

test("өгөөгүй талбарт анхдагч утга", () => {
  assert.deepEqual(normalizeItem({ name: "ном" }), { name: "ном", qty: 1, discount: 0.1 });
});

test("0 бол хүчинтэй утга — анхдагчаар солигдохгүй", () => {
  assert.deepEqual(normalizeItem({ name: "ном", qty: 0, discount: 0 }), {
    name: "ном",
    qty: 0,
    discount: 0,
  });
});
