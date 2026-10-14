import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { moveUser } = await load("09-move-user.js");

test("шинэ объект шинэ хоттой", () => {
  const user = { name: "Bat", address: { city: "Улаанбаатар", zip: "14200" } };
  const moved = moveUser(user, "Дархан");
  assert.equal(moved.address.city, "Дархан");
  assert.equal(moved.address.zip, "14200");
});

test("эх объект өөрчлөгдөхгүй (nested объект ч)", () => {
  const user = { name: "Bat", address: { city: "Улаанбаатар", zip: "14200" } };
  moveUser(user, "Дархан");
  assert.equal(user.address.city, "Улаанбаатар", "эх объектын address өөрчлөгдсөн байна");
});
