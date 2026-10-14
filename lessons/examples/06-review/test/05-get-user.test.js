import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { getUser } = await load("05-get-user.js");

function fakeFetch(status, body) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  return { impl, calls };
}

test("амжилттай үед хэрэглэгчийг буцаана", async () => {
  const { impl } = fakeFetch(200, { id: 1, name: "Bat" });
  assert.deepEqual(await getUser(1, impl), { id: 1, name: "Bat" });
});

test("404 үед алдаа шиднэ (алдааны body-г хэрэглэгч гэж буцаахгүй)", async () => {
  const { impl } = fakeFetch(404, { message: "Not found" });
  await assert.rejects(getUser(999, impl), /404/);
});

test("id-г URL-д encode хийнэ (path injection)", async () => {
  const { impl, calls } = fakeFetch(200, {});
  await getUser("../admin", impl);
  assert.equal(calls[0], "https://api.example.com/users/..%2Fadmin");
});
