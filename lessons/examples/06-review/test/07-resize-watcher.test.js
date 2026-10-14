import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { ResizeWatcher } = await load("07-resize-watcher.js");

test("destroy()-ийн дараа listener ажиллахгүй", () => {
  const target = new EventTarget();
  const seen = [];
  const watcher = new ResizeWatcher(target, (n) => seen.push(n));

  target.dispatchEvent(new Event("resize"));
  watcher.destroy();
  target.dispatchEvent(new Event("resize"));
  target.dispatchEvent(new Event("resize"));

  assert.deepEqual(seen, [1], "destroy хийсний дараа ч listener ажилласаар байна → leak");
});
