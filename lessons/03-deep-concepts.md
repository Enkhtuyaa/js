# Хичээл 3. Гүнзгий Ойлголтууд

> **Хугацаа:** 2–3 долоо хоног
> **Урьдчилсан мэдлэг:** Хичээл 1 (closure, `this`, prototype)
> **Жишээ код:** [`examples/03-deep.js`](examples/03-deep.js) — `node lessons/examples/03-deep.js`

---

## 3.1 Higher-Order Functions

### Онол

JavaScript-д функц бол **first-class citizen** — түүнийг хувьсагчид хадгалах, аргумент болгон дамжуулах, функцээс буцаах боломжтой ([MDN: First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)).

**Higher-order function (HOF)** гэдэг нь:
- функцийг **аргумент** болгон авдаг, *эсвэл*
- функцийг **буцаадаг** функц

```javascript
// Функц авдаг
[1, 2, 3].map((x) => x * 2);          // [2, 4, 6]

// Функц буцаадаг
const greaterThan = (n) => (x) => x > n;
[5, 10, 15].filter(greaterThan(8));   // [10, 15]
```

### map / filter / reduce

| Method | Юу хийдэг | Буцаах утга | Анхны массивыг өөрчлөх үү |
|---|---|---|---|
| [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) | Элемент бүрийг хувиргана | Ижил урттай шинэ массив | Үгүй |
| [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) | Нөхцөл хангасныг үлдээнэ | Богино/ижил шинэ массив | Үгүй |
| [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) | Бүх элементийг нэг утга болгон "нугална" | Ямар ч төрөл | Үгүй |

```javascript
const orders = [
  { item: "ном", price: 15000, paid: true },
  { item: "үзэг", price: 2000, paid: false },
  { item: "дэвтэр", price: 3000, paid: true },
];

const totalPaid = orders
  .filter((o) => o.paid)
  .map((o) => o.price)
  .reduce((sum, p) => sum + p, 0);   // 18000

// reduce-ээр бүлэглэх
const byStatus = orders.reduce((acc, o) => {
  const key = o.paid ? "paid" : "unpaid";
  (acc[key] ??= []).push(o.item);
  return acc;
}, {});
// { paid: ["ном", "дэвтэр"], unpaid: ["үзэг"] }
```

### Дасгал: `map`, `filter`, `reduce`-ийг scratch-ээс бичих

Roadmap дээрх `myReduce` нь **`initialValue` өгөөгүй тохиолдлыг** зөв шийддэггүй. MDN-ийн тодорхойлолтоор `initialValue` байхгүй бол эхний элемент accumulator болж, давталт 2 дахь элементээс эхэлнэ; хоосон массив + `initialValue`-гүй бол `TypeError` шиднэ:

```javascript
Array.prototype.myReduce = function (callback, ...rest) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const arr = this;
  let i = 0;
  let accumulator;

  if (rest.length > 0) {
    accumulator = rest[0];            // initialValue өгсөн (undefined байсан ч!)
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

[1, 2, 3].myReduce((a, b) => a + b);     // 6  (initialValue-гүй)
[1, 2, 3].myReduce((a, b) => a + b, 10); // 16
// [].myReduce((a, b) => a + b);         // TypeError
```

> 💡 `...rest` ашигласны учир: `reduce(fn, undefined)` гэж *тодорхой* `undefined` дамжуулах нь `initialValue`-гүй байхаас өөр. `initialValue === undefined` гэж шалгавал энэ ялгааг алдана.
> ℹ️ Жинхэнэ `reduce` нь sparse массивын (`[1, , 3]`) хоосон нүдийг алгасдаг — энэ хялбаршуулсан хувилбар үүнийг тооцоогүй.

**Даалгавар:** Яг ийм байдлаар `myMap(callback, thisArg)`, `myFilter(callback, thisArg)`-ийг бич. Шалгах: `[1,2,3].myMap((x, i) => x * i)` → `[0, 2, 6]`.

### Эх сурвалж
- MDN — [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- ECMAScript стандарт — [Array.prototype.reduce алгоритм](https://tc39.es/ecma262/#sec-array.prototype.reduce)

---

## 3.2 Memory Management

### Онол

JavaScript-д санах ойг **автоматаар** хуваарилж, чөлөөлдөг. Амьдралын мөчлөг ([MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management)):

1. **Хуваарилах** — утга, объект үүсгэх үед
2. **Ашиглах** — унших, бичих
3. **Чөлөөлөх** — хэрэггүй болоход Garbage Collector (GC) устгана

### "Хэрэггүй" гэдгийг яаж мэддэг вэ? — Reachability

GC-ийн гол ойлголт бол **хүрч болох байдал (reachability)** ([javascript.info: Garbage collection](https://javascript.info/garbage-collection)):
- **Root**-ууд: global объект, одоо ажиллаж буй функцийн local хувьсагч, call stack гэх мэт
- Root-оос reference-ийн гинжээр хүрч болох бүх утга **"амьд"**
- Хүрч болохгүй болсон утгыг устгана

### Mark-and-Sweep алгоритм

```
1. Mark:  Root-уудаас эхлээд хүрч болох бүх объектыг "тэмдэглэнэ"
2. Sweep: Тэмдэглэгдээгүй бүх объектыг санах ойгоос устгана
```

Mark-and-sweep нь **цикл reference**-ийг асуудалгүй шийддэг (`a.b = b; b.a = a;` — гаднаас хүрэх замгүй бол хоёулаа устна). Орчин үеийн engine-үүд (жишээ нь V8) үүн дээр **generational**, **incremental**, **concurrent** зэрэг сайжруулалт хийсэн ([V8 blog: Trash talk — the Orinoco garbage collector](https://v8.dev/blog/trash-talk)).

### Memory leak — түгээмэл 5 шалтгаан

Leak гэдэг нь *хэрэггүй болсон ч хүрч болохуйц хэвээр* үлдсэн санах ой.

| # | Шалтгаан | Жишээ | Засвар |
|---|---|---|---|
| 1 | Устгаагүй event listener | `window.addEventListener("resize", onResize)` компонент устсан ч үлдэх | `removeEventListener` эсвэл `{ signal }` |
| 2 | Зогсоогоогүй timer | `setInterval(() => update(bigData), 1000)` | `clearInterval(id)` |
| 3 | Closure том объект барих | Handler дотор хэрэггүй том массив барьж байх | Хэрэгтэй утгаа л барих |
| 4 | Санамсаргүй global | Non-strict mode дээр `x = 5` (`let` мартсан) | `"use strict"` / ES module |
| 5 | Detached DOM | DOM-оос устгасан элементийг JS хувьсагч барьж байх | Reference-ийг `null` болгох |
| + | Хязгааргүй cache | `const cache = {}` руу байнга нэмэх | Хэмжээ хязгаарлах, `WeakMap` |

```javascript
// Event listener-ийг AbortController-оор нэг дор цэвэрлэх
const controller = new AbortController();
window.addEventListener("resize", onResize, { signal: controller.signal });
window.addEventListener("scroll", onScroll, { signal: controller.signal });
// ...
controller.abort(); // хоёулаа устна
```

**`WeakMap`** — key нь объект, *weak* reference-ээр хадгалагддаг тул key объектод өөр reference үлдээгүй бол GC устгаж болно ([MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)). DOM элемент эсвэл объекттой холбоотой metadata хадгалахад тохиромжтой.

### Дадлага
Chrome DevTools → **Memory** таб → *Heap snapshot* авч, leak хайх ([Chrome DevTools: Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)). Дасгал: товч дарах бүрт 1MB массив `window.leaks`-д нэмдэг хуудас хийгээд snapshot хооронд харьцуул.

### Эх сурвалж
- MDN — [Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management), [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- javascript.info — [Garbage collection](https://javascript.info/garbage-collection)
- V8 — [Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)

---

## 3.3 Modules

### Онол

Module бол өөрийн scope-той, зөвхөн `export` хийсэн зүйлээ гаргадаг файл. Global scope-ийг бохирдуулахгүй, кодыг хэсэглэж зохион байгуулах боломж олгоно ([MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)).

| | CommonJS (CJS) | ES Modules (ESM) |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Стандарт | Node.js-ийн өөрийн систем | ECMAScript хэлний стандарт (ES2015) |
| Ачаалах | **Синхрон**, runtime үед | **Static** бүтэц, асинхрон ачаалж болно |
| `import`/`require` хаана бичих | Хаана ч (if дотор ч) | Static `import` нь зөвхөн top-level. Нөхцөлтэй бол `import()` |
| Export-ын утга | Утгын **хуулбар** (export хийх үеийн) | **Live binding** (эх модуль өөрчлөхөд шинэчлэгдэнэ) |
| Top-level `await` | Үгүй | Тийм |
| Strict mode | Анхдагчаар үгүй | **Үргэлж** |
| Tree-shaking | Хэцүү | Боломжтой (static шинжилгээ) |
| Browser дээр | Шууд ажиллахгүй (bundler хэрэгтэй) | `<script type="module">` |

```javascript
// ---------- CommonJS: math.cjs ----------
function add(a, b) { return a + b; }
module.exports = { add };

// main.cjs
const { add } = require("./math.cjs");

// ---------- ES Modules: math.mjs ----------
export function add(a, b) { return a + b; }  // named export
export default function mul(a, b) { return a * b; } // default export

// main.mjs
import mul, { add } from "./math.mjs";
const { heavy } = await import("./heavy.mjs"); // dynamic import → Promise
```

**Node.js дээр аль нь болохыг юу шийддэг вэ?** ([Node.js: Modules](https://nodejs.org/api/modules.html), [ECMAScript modules](https://nodejs.org/api/esm.html))
- `.mjs` → ESM, `.cjs` → CJS
- `.js` → ойрын `package.json` дахь `"type": "module"` бол ESM, үгүй бол CJS

**Tree-shaking** — ESM-ийн static бүтцийн ачаар bundler (Vite, Rollup, webpack) ашиглагдаагүй export-уудыг эцсийн bundle-аас хасдаг ([MDN: Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)).

### Дасгал 3.3
1. `lessons/examples/` дотор `counter.mjs` (`export let count = 0; export function inc() { count++; }`) болон `main.mjs` үүсгэ. `main.mjs`-д `count`-ийг хэвлэ → `inc()` → дахин хэвлэ. **Live binding**-ийг харна (`0` → `1`).
2. Ижил зүйлийг CJS-ээр бичиж (`module.exports = { count, inc }`) ялгааг хар (`0` → `0`).

Өөрөө бичиж үзсэнийхээ дараа бэлэн хариутай харьцуул: [`examples/modules/`](examples/modules/) (`node lessons/examples/modules/main.mjs`, `node lessons/examples/modules/main.cjs`).

### Эх сурвалж
- MDN — [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
- Node.js — [CommonJS modules](https://nodejs.org/api/modules.html), [ECMAScript modules](https://nodejs.org/api/esm.html)
- javascript.info — [Modules, introduction](https://javascript.info/modules-intro)

---

## 3.4 `call`, `apply`, `bind`-ийг өөрөө хийж үзэх

### Онол (давталт)

| Method | `this` | Аргумент | Дуудах уу |
|---|---|---|---|
| [`fn.call(ctx, a, b)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) | `ctx` | Нэг нэгээр | **Шууд** дуудна |
| [`fn.apply(ctx, [a, b])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) | `ctx` | **Массиваар** | **Шууд** дуудна |
| [`fn.bind(ctx, a)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) | `ctx` | Урьдчилан (partial) | **Шинэ функц** буцаана |

### `myCall` — гол санаа

`this` нь "цэгийн өмнөх объект" (1.4) гэдэг дүрмийг ашиглана: функцийг түр зуур `context`-ийн method болгоод дуудна.

```javascript
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis;          // null/undefined → global (non-strict зан төлөв)
  context = Object(context);                // primitive (жишээ нь 5)-ийг объект болгоно
  const key = Symbol("fn");                 // давхцахгүй түр key
  context[key] = this;                      // this === дуудагдаж буй функц
  try {
    return context[key](...args);           // method болгож дуудна → this === context
  } finally {
    delete context[key];                    // цэвэрлэх
  }
};

Function.prototype.myApply = function (context, args = []) {
  return this.myCall(context, ...args);
};
```

### `myBind`

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...newArgs) {
    return fn.apply(context, [...boundArgs, ...newArgs]);
  };
};

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const hi = greet.myBind({ name: "Saraa" }, "Сайн уу");
hi("!"); // "Сайн уу, Saraa!"
```

> 🔍 **Гүнзгийрүүлэх асуулт:** Жинхэнэ `bind`-ээр үүсгэсэн функцийг `new`-тэй дуудвал bind хийсэн `this`-ийг **үл тоож** шинэ объект үүсгэдэг. Дээрх `myBind` үүнийг дэмжихгүй. Үүнийг яаж засах вэ? (Санамж: `new.target`)

<details>
<summary>Хариу</summary>

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  function bound(...newArgs) {
    if (new.target) {
      return new fn(...boundArgs, ...newArgs); // new-тэй дуудсан → context-ийг үл тоох
    }
    return fn.apply(context, [...boundArgs, ...newArgs]);
  }
  if (fn.prototype) bound.prototype = Object.create(fn.prototype);
  return bound;
};
```
</details>

### Эх сурвалж
- MDN — [Function.prototype.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- javascript.info — [Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators), [Function binding](https://javascript.info/bind)

---

## ✅ Өөрийгөө шалгах (Хичээл 3)

- [ ] HOF-ийн тодорхойлолтыг хэлж, 2 жишээ өгнө
- [ ] `map`/`filter`/`reduce`-ийг scratch-ээс бичиж, `initialValue`-гүй тохиолдлыг зөв шийднэ
- [ ] Reachability, mark-and-sweep-ийг тайлбарлана
- [ ] 3-аас доошгүй memory leak-ийн шалтгаан, засварыг хэлнэ
- [ ] CJS ба ESM-ийн 4-өөс доошгүй ялгааг хэлнэ
- [ ] `call`, `apply`, `bind`-ийг өөрөө бичиж чадна

⬅️ [Хичээл 2](02-async-programming.md) · ➡️ [Хичээл 4. DOM ба Vanilla JS](04-dom-vanilla-js.md)
