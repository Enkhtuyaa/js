import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { cartTotal } = await load("08-cart-total.js");

test("0.1 + 0.2 = 0.3 (бутархай тооны алдаагүй)", () => {
  assert.equal(cartTotal([{ price: 0.1, qty: 1 }, { price: 0.2, qty: 1 }]), 0.3);
});

test("0.1 × 3 = 0.3", () => {
  assert.equal(cartTotal([{ price: 0.1, qty: 3 }]), 0.3);
});

test("хоосон сагс 0", () => {
  assert.equal(cartTotal([]), 0);
});
