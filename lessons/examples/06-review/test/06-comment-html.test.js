import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./load.js";

const { commentHTML } = await load("06-comment-html.js");

test("энгийн текстийг харуулна", () => {
  assert.equal(
    commentHTML({ author: "Bat", text: "Сайн байна уу" }),
    '<li class="comment"><b>Bat</b>: Сайн байна уу</li>'
  );
});

test("хэрэглэгчийн HTML-ийг escape хийнэ (XSS)", () => {
  const html = commentHTML({ author: "x", text: '<img src=x onerror="alert(1)">' });
  assert.ok(!html.includes("<img"), "img tag шууд орсон байна → XSS");
  assert.ok(html.includes("&lt;img"));
});

test("author-ийг ч escape хийнэ", () => {
  const html = commentHTML({ author: "<script>", text: "hi" });
  assert.ok(!html.includes("<script>"));
});
