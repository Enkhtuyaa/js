import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { createSearch } = await load("12-search.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("хуучин, удаан хариу шинэ хариуг дарахгүй (race condition)", async () => {
  const delays = { a: 50, ab: 10 }; // "a"-ийн хариу удаан ирнэ
  const fetchResults = async (q) => {
    await sleep(delays[q]);
    return [`${q} үр дүн`];
  };
  const rendered = [];
  const search = createSearch(fetchResults, (r) => rendered.push(r));

  search("a");
  search("ab"); // хэрэглэгч үргэлжлүүлэн бичлээ
  await sleep(100);

  assert.deepEqual(rendered.at(-1), ["ab үр дүн"], "дэлгэцэнд хуучин хайлтын үр дүн үлдсэн");
});
