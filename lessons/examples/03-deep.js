"use strict";
// Хичээл 3-ийн жишээнүүд. Ажиллуулах: node lessons/examples/03-deep.js
// Модулийн жишээ: node lessons/examples/modules/main.mjs  ба  node lessons/examples/modules/main.cjs

// ---------- 3.1 Higher-order functions ----------
console.log("=== 3.1 ===");
const orders = [
  { item: "ном", price: 15000, paid: true },
  { item: "үзэг", price: 2000, paid: false },
  { item: "дэвтэр", price: 3000, paid: true },
];
const totalPaid = orders
  .filter((o) => o.paid)
  .map((o) => o.price)
  .reduce((sum, p) => sum + p, 0);
console.log("Төлсөн дүн:", totalPaid); // 18000

const byStatus = orders.reduce((acc, o) => {
  const key = o.paid ? "paid" : "unpaid";
  (acc[key] ??= []).push(o.item);
  return acc;
}, {});
console.log("Бүлэглэсэн:", byStatus);

Array.prototype.myReduce = function (callback, ...rest) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const arr = this;
  let i = 0;
  let accumulator;
  if (rest.length > 0) {
    accumulator = rest[0];
  } else {
    if (arr.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = arr[0];
    i = 1;
  }
  for (; i < arr.length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }
  return accumulator;
};

Array.prototype.myMap = function (callback, thisArg) {
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    result[i] = callback.call(thisArg, this[i], i, this);
  }
  return result;
};

Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) result.push(this[i]);
  }
  return result;
};

console.log("myReduce:", [1, 2, 3].myReduce((a, b) => a + b), [1, 2, 3].myReduce((a, b) => a + b, 10));
try {
  [].myReduce((a, b) => a + b);
} catch (e) {
  console.log("myReduce хоосон:", e.message, "| жинхэнэ:", (() => { try { [].reduce((a, b) => a + b); } catch (e2) { return e2.message; } })());
}
console.log("myMap:", [1, 2, 3].myMap((x, i) => x * i)); // [0, 2, 6]
console.log("myFilter:", [5, 10, 15].myFilter((x) => x > 8)); // [10, 15]

// ---------- 3.2 WeakMap ----------
console.log("\n=== 3.2 ===");
const meta = new WeakMap();
let el = { id: "button" };
meta.set(el, { clicks: 3 });
console.log("WeakMap:", meta.get(el));
el = null; // одоо объект хүрэх замгүй → GC устгаж болно (WeakMap барихгүй)

// ---------- 3.4 call / apply / bind ----------
console.log("\n=== 3.4 ===");
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis;
  context = Object(context);
  const key = Symbol("fn");
  context[key] = this;
  try {
    return context[key](...args);
  } finally {
    delete context[key];
  }
};
Function.prototype.myApply = function (context, args = []) {
  return this.myCall(context, ...args);
};
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  function bound(...newArgs) {
    if (new.target) {
      return new fn(...boundArgs, ...newArgs);
    }
    return fn.apply(context, [...boundArgs, ...newArgs]);
  }
  if (fn.prototype) bound.prototype = Object.create(fn.prototype);
  return bound;
};

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const saraa = { name: "Saraa" };
console.log(greet.myCall(saraa, "Сайн уу", "!"));
console.log(greet.myApply(saraa, ["Сайн байна уу", "?"]));
console.log(greet.myBind(saraa, "Баяртай")("."));
console.log("Түр key үлдсэн үү:", Object.getOwnPropertySymbols(saraa).length); // 0

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ ignored: true }, 1);
const pt = new BoundPoint(2);
console.log("new + myBind:", pt, pt instanceof Point); // Point { x: 1, y: 2 } true
