import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { promiseAll } = await load("04-promise-all.js");
const later = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));

test("үр дүнгийн дараалал оролтынхтой адил", async () => {
  const result = await promiseAll([later("a", 40), later("b", 10), later("c", 20)]);
  assert.deepEqual(result, ["a", "b", "c"]);
});

test("хоосон массив шууд [] болно", async () => {
  const hang = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("хоосон массив дээр Promise хэзээ ч resolve болохгүй байна (hang)")), 200)
  );
  assert.deepEqual(await Promise.race([promiseAll([]), hang]), []);
});

test("Promise биш утгыг дэмжинэ", async () => {
  assert.deepEqual(await promiseAll([1, Promise.resolve(2)]), [1, 2]);
});

test("аль нэг нь reject болбол reject", async () => {
  await assert.rejects(promiseAll([later(1, 10), Promise.reject(new Error("x"))]), /x/);
});
