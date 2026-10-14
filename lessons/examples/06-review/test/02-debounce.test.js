import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { debounce } = await load("02-debounce.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("олон дуудлагаас зөвхөн сүүлийнх нь нэг удаа ажиллана", async () => {
  const calls = [];
  const search = debounce((q) => calls.push(q), 30);
  search("a");
  search("ab");
  search("abc");
  await sleep(60);
  assert.deepEqual(calls, ["abc"]);
});

test("this-ийг дамжуулна (method болгон ашиглахад)", async () => {
  let seen;
  const box = {
    name: "box",
    save: null,
  };
  box.save = debounce(function () {
    seen = this?.name;
  }, 10);
  box.save();
  await sleep(30);
  assert.equal(seen, "box");
});
