import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { saveAll } = await load("03-save-all.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("буцаахаас өмнө бүх item хадгалагдсан байна", async () => {
  const saved = [];
  const save = async (item) => {
    await sleep(10);
    saved.push(item);
  };
  const count = await saveAll(["a", "b", "c"], save);
  assert.equal(count, 3);
  assert.equal(saved.length, 3, "saveAll дууссан ч бүх item хадгалагдаагүй байна");
});
