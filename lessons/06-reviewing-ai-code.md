# Хичээл 6. AI-ийн Кодыг Шүүмжилж Сурах

> **Хугацаа:** 2–3 долоо хоног (өдөрт 1–2 дасгал)
> **Урьдчилсан мэдлэг:** Хичээл 1–4
> **Дасгалын код:** [`examples/06-review/`](examples/06-review/)

---

## 6.1 Яагаад энэ хичээл хэрэгтэй вэ?

AI код маш хурдан бичдэг. Гэхдээ заримдаа **алдаатай кодыг маш итгэлтэй** бичдэг. AI-тай ажиллах инженерийн хамгийн чухал үүрэг бол **AI-ийн гаргасан зүйл зөв эсэхийг шийдэх** юм.

Бодит жишээ: энэ сургалтын эх roadmap дээрх `myReduce` нь `initialValue` өгөөгүй үед `NaN` буцаадаг байсан. Код нь цэвэрхэн, ойлгомжтой харагдаж байсан тул алдааг нь анзаарахад хэцүү. Үүнийг `reduce` хэрхэн ажилладгийг MDN-ээс шалгаж байж л олсон (Дасгал 1).

Энэ хичээлийн 13 дасгал бүр нь:
- AI-д өгсөн **даалгавар** (prompt)
- AI-ийн бичсэн мэт **итгэлтэй, цэвэрхэн харагдах**, гэхдээ далд алдаатай код
- Алдааг **баталдаг автомат тест**

> Дасгалуудын алдаа бүр бодит төсөлд түгээмэл гардаг, өмнөх хичээлүүдэд үзсэн сэдвүүдтэй холбоотой. AI-аас өөр, хүний бичсэн кодонд ч мөн адил гардаг.

---

## 6.2 Code review хийх 7 асуулт

Ямар ч код (AI-ийн, хамт олны, өөрийн) уншихдаа эдгээрийг асуу:

| # | Асуулт | Жишээ |
|---|---|---|
| 1 | **Даалгаврыг бүрэн биелүүлсэн үү?** Prompt-ын үг бүрийг кодтой тулга | "Эхийг өөрчлөхгүй" гэсэн ч өөрчилж байна уу? |
| 2 | **Хязгаарын (edge) тохиолдол?** | Хоосон массив, `0`, `""`, `null`, сөрөг тоо, маш том оролт |
| 3 | **Асинхрон дараалал?** | Юу юуг хүлээж байна? Хариу буруу дарааллаар ирвэл? |
| 4 | **`this` ба scope?** | Method-ийг callback болгож дамжуулж байна уу? |
| 5 | **Хэрэглэгчийн оролт?** | HTML, URL, SQL руу escape хийлгүй орж байна уу? |
| 6 | **Нөөц цэвэрлэгдэж байна уу?** | Listener, timer, хүсэлт устгагдаж байна уу? |
| 7 | **Нотолж чадах уу?** | Тест бичсэн үү? MDN эсвэл стандарттай тулгасан уу? |

> 💡 AI-ийн тайлбарт ("бүрэн ажилладаг", "найдвартай", "production-ready") **бүү итгэ.** Код өөрөө юу хийж байгааг л үнэл.

---

## 6.3 Тестээр нотлох: `node:test`

Node.js 18+-д тест бичих хэрэгсэл [`node:test`](https://nodejs.org/api/test.html) болон [`node:assert`](https://nodejs.org/api/assert.html) суурилагдсан байдаг. Юу ч суулгах шаардлагагүй.

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";

test("тоогоор эрэмбэлнэ", () => {
  assert.deepEqual(topScores([5, 100, 20, 9]), [100, 20, 9]);
});

test("алдаа шиднэ", () => {
  assert.throws(() => reduce([], (a, b) => a + b), TypeError);
});

test("async функц reject болно", async () => {
  await assert.rejects(getUser(999, fakeFetch), /404/);
});
```

**Сайн тестийн дүрэм:** тест нь алдаатай код дээр **унах**, зөв код дээр **давах** ёстой. Алдаатай код дээр давдаг тест юу ч нотлохгүй.

---

## 6.4 Дасгалыг хэрхэн хийх вэ

```bash
cd lessons/examples/06-review

node --test test/01-reduce.test.js   # нэг дасгалын тест
npm test                              # бүх тест (bugs/ доторх кодыг шалгана)
npm run test:fixes                    # засварласан хариуг шалгах
```

**Алхам бүр:**

1. `bugs/NN-*.js`-ийг нээж, **тест ажиллуулахгүйгээр** уншина
2. 7 асуултаар шалгаж, **сэжигтэй мөр бүрийг цаасан дээр бич**. Хэдэн алдаа байгааг доорх тайлбарт хэлсэн
3. Олсон алдаа бүрт **өөрийн тест бич**: алдаатай код дээр унах ёстой
4. Дараа нь бэлэн тестийг ажиллуул: `node --test test/NN-*.test.js`. Чиний олоогүй алдаа байна уу?
5. `bugs/` доторх кодыг **өөрөө засаж**, бүх тест давтал ажилла
6. Эцэст нь `fixes/` доторх хариутай харьцуул. Өөр шийдэл байж болно, тест давж байвал зөв

> ⚠️ Хариуг эхлээд бүү хар. Алдаа олох чадвар нь алдаа хайж *зовж* байж л хөгждөг.

---

## 6.5 Дасгалууд

### Дасгал 1. `reduce` — [`bugs/01-reduce.js`](examples/06-review/bugs/01-reduce.js)
**Ангилал:** Зөв ажиллагаа · **Хичээл:** 3.1 · **Алдааны тоо:** 1 (2 тохиолдолд илэрнэ)

> **Prompt:** "Array.prototype.reduce-ийг өөрөө бичээд өг"

```javascript
export function reduce(arr, callback, initialValue) {
  let acc = initialValue;
  for (let i = 0; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }
  return acc;
}
```

<details><summary>Сэжүүр</summary>

`reduce([1, 2, 3], (a, b) => a + b)` гэж **initialValue-гүй** дуудвал эхний алхамд `acc` ямар утгатай вэ?
</details>

<details><summary>Хариу</summary>

- `initialValue`-гүй үед `acc = undefined` → `undefined + 1 = NaN`. Стандартаар эхний элемент accumulator болж, давталт 2 дахь элементээс эхлэх ёстой.
- Хоосон массив + `initialValue`-гүй үед `TypeError` шидэх ёстой, гэтэл `undefined` буцаана.
- Засвар: `arguments.length >= 3`-аар шалгах. `initialValue === undefined` гэж шалгавал `reduce(fn, undefined)` гэж тодорхой өгсөн тохиолдлыг ялгахгүй.

Эх сурвалж: [MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</details>

---

### Дасгал 2. `debounce` — [`bugs/02-debounce.js`](examples/06-review/bugs/02-debounce.js)
**Ангилал:** Closure, `this` · **Хичээл:** 1.4, 5.3 · **Алдааны тоо:** 2

> **Prompt:** "Хайлтын input-д зориулж debounce функц бич"

```javascript
export function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), ms);
  };
}
```

<details><summary>Сэжүүр</summary>

`search("abc")` гэж дуудахад `"abc"` хаашаа явж байна вэ? `obj.save = debounce(function () { this... })` бол `this` юу болох вэ?
</details>

<details><summary>Хариу</summary>

1. **Аргумент алга болно.** `fn()` нь юу ч дамжуулахгүй тул хайлтын функц `undefined` хүлээж авна.
2. **`this` алга болно.** Буцаах функц нь arrow тул өөрийн `this` байхгүй, мөн `fn()` нь энгийн дуудлага.
- Засвар: `return function (...args) { ... fn.apply(this, args) }`

Эх сурвалж: [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)
</details>

---

### Дасгал 3. Бүгдийг хадгалах — [`bugs/03-save-all.js`](examples/06-review/bugs/03-save-all.js)
**Ангилал:** Async · **Хичээл:** 2.1 · **Алдааны тоо:** 1 (+ алдаа барих асуудал)

> **Prompt:** "Бүх item-ийг серверт хадгалаад, хэдийг хадгалсныг буцаадаг функц"

```javascript
export async function saveAll(items, save) {
  items.forEach(async (item) => {
    await save(item);
  });
  return items.length;
}
```

<details><summary>Сэжүүр</summary>

`forEach` нь callback-ийн буцаасан Promise-ийг юу хийдэг вэ?
</details>

<details><summary>Хариу</summary>

- `forEach` нь Promise-ийг **хүлээдэггүй**. `saveAll` нь хадгалалт эхлэнгүүт `3` буцаана, нэг ч item хадгалагдаагүй байхад. MDN: *"forEach() expects a synchronous function — it does not wait for promises."*
- Нэмэлт асуудал: `save` алдаа шидвэл `saveAll` reject болохгүй, "unhandled rejection" болж алдаа чимээгүй алга болно.
- Засвар: `await Promise.all(items.map(save))` (зэрэг) эсвэл `for (const item of items) await save(item)` (дараалан).

Эх сурвалж: [MDN: Array.prototype.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
</details>

---

### Дасгал 4. `Promise.all` — [`bugs/04-promise-all.js`](examples/06-review/bugs/04-promise-all.js)
**Ангилал:** Async · **Хичээл:** 2.2 · **Алдааны тоо:** 3

> **Prompt:** "Promise.all-ийг өөрөө хэрэгжүүл (interview)"

```javascript
export function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    promises.forEach((p) => {
      p.then((value) => {
        results.push(value);
        if (results.length === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
```

<details><summary>Сэжүүр</summary>

Удаан promise эхэнд, хурдан нь сүүлд байвал? `promiseAll([])`? `promiseAll([1, 2])`?
</details>

<details><summary>Хариу</summary>

1. **Дараалал алдагдана.** `push` нь *дуусах* дарааллаар нэмнэ. Оролтын дарааллыг хадгалахын тулд `results[i] = value` гэж бичих ёстой.
2. **Хоосон массив дээр гацна.** `forEach` огт ажиллахгүй тул `resolve` хэзээ ч дуудагдахгүй.
3. **Promise биш утга.** `1.then` байхгүй → `TypeError`. `Promise.resolve(item)`-ээр боох хэрэгтэй.

Эх сурвалж: [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
</details>

---

### Дасгал 5. Хэрэглэгч татах — [`bugs/05-get-user.js`](examples/06-review/bugs/05-get-user.js)
**Ангилал:** Fetch, аюулгүй байдал · **Хичээл:** 2.3 · **Алдааны тоо:** 2

> **Prompt:** "id-аар хэрэглэгчийн мэдээлэл татдаг функц"

```javascript
export async function getUser(id, fetchImpl = fetch) {
  const res = await fetchImpl(`https://api.example.com/users/${id}`);
  return res.json();
}
```

<details><summary>Сэжүүр</summary>

Сервер 404 буцаавал юу болох вэ? `id` нь хэрэглэгчийн оруулсан `"../admin"` бол URL ямар болох вэ?
</details>

<details><summary>Хариу</summary>

1. **`res.ok` шалгаагүй.** `fetch` нь 404/500 дээр reject болдоггүй. Алдааны body `{ message: "Not found" }`-ийг хэрэглэгч гэж буцаана.
2. **URL-д escape хийгээгүй.** `"../admin"` нь `/users/../admin` болж өөр endpoint руу хүрэх боломжтой (path injection). `encodeURIComponent(id)` хэрэглэ.

Эх сурвалж: [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), [MDN: encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
</details>

---

### Дасгал 6. Сэтгэгдэл харуулах — [`bugs/06-comment-html.js`](examples/06-review/bugs/06-comment-html.js)
**Ангилал:** Аюулгүй байдал (XSS) · **Хичээл:** 4.2 · **Алдааны тоо:** 1 (2 газар)

> **Prompt:** "Сэтгэгдлийг жагсаалтад харуулах HTML үүсгэдэг функц"

```javascript
export function commentHTML(comment) {
  return `<li class="comment"><b>${comment.author}</b>: ${comment.text}</li>`;
}
// AI: "Үр дүнг list.innerHTML-д оноогоорой."
```

<details><summary>Хариу</summary>

- Хэрэглэгч `<img src=x onerror="alert(document.cookie)">` гэж бичвэл энэ нь бусад хэрэглэгчийн browser дээр **код болж ажиллана** (stored XSS). `author`, `text` хоёулаа аюултай.
- Засвар: `& < > " '` тэмдэгтүүдийг escape хийх. DOM-той ажиллаж байгаа бол `createElement` + `textContent` ашиглах нь хамгийн аюулгүй.

Эх сурвалж: [MDN: Cross-site scripting (XSS)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS), [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
</details>

---

### Дасгал 7. Resize watcher — [`bugs/07-resize-watcher.js`](examples/06-review/bugs/07-resize-watcher.js)
**Ангилал:** Санах ой · **Хичээл:** 3.2 · **Алдааны тоо:** 1

> **Prompt:** "Resize event-ийг тоолдог, устгах боломжтой class"

```javascript
export class ResizeWatcher {
  constructor(target, onResize) {
    this.target = target;
    this.count = 0;
    target.addEventListener("resize", () => {
      this.count++;
      onResize(this.count);
    });
  }

  destroy() {
    this.target.removeEventListener("resize", () => {
      this.count++;
    });
  }
}
```

<details><summary>Хариу</summary>

- `removeEventListener` нь **яг тэр функцийн reference**-ийг шаарддаг. `destroy` дотор **шинэ** arrow function үүсгэсэн тул юу ч устгахгүй. Listener үлдэж, `this`-ээр дамжуулан объектыг санах ойд барьж байна (memory leak).
- Засвар: handler-ийг хадгалах (`this.handler = () => ...`), эсвэл `AbortController`-ийн `{ signal }` ашиглаад `abort()` хийх.

Эх сурвалж: [MDN: removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener), [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
</details>

---

### Дасгал 8. Сагсны дүн — [`bugs/08-cart-total.js`](examples/06-review/bugs/08-cart-total.js)
**Ангилал:** Өгөгдөл · **Алдааны тоо:** 1

> **Prompt:** "Сагсны нийт үнийг (доллараар) тооцоол"

```javascript
export function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
```

<details><summary>Хариу</summary>

- JavaScript-ийн `Number` нь IEEE 754 double. `0.1 + 0.2 === 0.30000000000000004`. Мөнгөн дүнд энэ нь буруу үнэ, нийлэхгүй тайлан болно.
- Засвар: бүхэл **цент**-ээр тооцох (`Math.round(price * 100)`). Бодит системд үнийг анхнаасаа бүхэл тоогоор хадгална.

Эх сурвалж: [MDN: Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) ("Number encoding" хэсэг)
</details>

---

### Дасгал 9. Хот солих — [`bugs/09-move-user.js`](examples/06-review/bugs/09-move-user.js)
**Ангилал:** Өгөгдөл · **Алдааны тоо:** 1

> **Prompt:** "Хэрэглэгчийн хотыг өөрчилсөн ШИНЭ объект буцаа, эхийг өөрчлөхгүй"

```javascript
export function moveUser(user, newCity) {
  const updated = { ...user };
  updated.address.city = newCity;
  return updated;
}
```

<details><summary>Хариу</summary>

- Spread (`{ ...user }`) нь **shallow copy**: `updated.address` ба `user.address` нь **нэг объект**. Эх хэрэглэгчийн хот ч өөрчлөгдөнө. React-д энэ нь "state өөрчлөгдсөн ч дахин render болохгүй" bug-ийн түгээмэл шалтгаан.
- Засвар: `{ ...user, address: { ...user.address, city: newCity } }`, эсвэл бүрэн хуулбар хэрэгтэй бол `structuredClone(user)`.

Эх сурвалж: [MDN: Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy), [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
</details>

---

### Дасгал 10. Counter — [`bugs/10-counter.js`](examples/06-review/bugs/10-counter.js)
**Ангилал:** `this` · **Хичээл:** 1.4 · **Алдааны тоо:** 1

> **Prompt:** "Тоонуудыг нэмж хадгалдаг Counter class"

```javascript
export class Counter {
  constructor() { this.total = 0; }
  add(n) { this.total += n; }
  addAll(numbers) {
    numbers.forEach(this.add);
    return this.total;
  }
}
```

<details><summary>Хариу</summary>

- `this.add`-ийг callback болгож дамжуулахад "цэгийн өмнөх объект" алга болно. Class бие strict mode тул `this === undefined` → `TypeError: Cannot read properties of undefined`.
- Засвар: `numbers.forEach((n) => this.add(n))` эсвэл `numbers.forEach(this.add, this)`.

Эх сурвалж: [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
</details>

---

### Дасгал 11. Шилдэг оноо — [`bugs/11-top-scores.js`](examples/06-review/bugs/11-top-scores.js)
**Ангилал:** Өгөгдөл · **Алдааны тоо:** 2

> **Prompt:** "Хамгийн өндөр n оноог буурахаар буцаа"

```javascript
export function topScores(scores, n = 3) {
  return scores.sort().reverse().slice(0, n);
}
```

<details><summary>Хариу</summary>

1. `sort()` анхдагчаар элементүүдийг **string болгож** харьцуулна: `[5, 100, 20, 9].sort()` → `[100, 20, 5, 9]`. Буцаах хариу `[9, 5, 20]` болно.
2. `sort()` нь **эх массивыг өөрчилнө** (in place). Дуудсан талын өгөгдөл санамсаргүй эвдэрнэ.
- Засвар: `[...scores].sort((a, b) => b - a)` эсвэл `scores.toSorted((a, b) => b - a)`.

Эх сурвалж: [MDN: Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), [toSorted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
</details>

---

### Дасгал 12. Шууд хайлт — [`bugs/12-search.js`](examples/06-review/bugs/12-search.js)
**Ангилал:** Async, race condition · **Хичээл:** 1.6, 2.3 · **Алдааны тоо:** 1

> **Prompt:** "Хэрэглэгч бичих бүрт серверээс хайж, үр дүнг харуулдаг функц"

```javascript
export function createSearch(fetchResults, render) {
  return async function search(query) {
    const results = await fetchResults(query);
    render(results);
  };
}
```

<details><summary>Сэжүүр</summary>

Хэрэглэгч "a" гэж бичээд, дараа нь "ab" гэж бичлээ. "a"-ийн хариу 50ms, "ab"-ийнх 10ms-д ирвэл дэлгэцэнд эцэст нь юу харагдах вэ?
</details>

<details><summary>Хариу</summary>

- Сүлжээний хариу илгээсэн **дарааллаараа ирэх баталгаагүй**. Хуучин, удаан хариу сүүлд ирж шинэ үр дүнг дарна. Хэрэглэгч "ab" гэж бичсэн ч "a"-ийн үр дүнг харна. Энэ алдаа хурдан интернэттэй хөгжүүлэгчийн компьютер дээр бараг гардаггүй тул олоход хэцүү.
- Засвар: хүсэлт бүрт дугаар өгч, зөвхөн хамгийн сүүлийнхийг render хийх. Бодит `fetch`-тэй бол `AbortController`-оор хуучин хүсэлтийг цуцлах.

Эх сурвалж: [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
</details>

---

### Дасгал 13. Анхдагч утга — [`bugs/13-normalize-item.js`](examples/06-review/bugs/13-normalize-item.js)
**Ангилал:** Өгөгдөл · **Алдааны тоо:** 1 (2 газар)

> **Prompt:** "Захиалгын мөрийг цэгцэл: qty өгөөгүй бол 1, discount өгөөгүй бол 0.1 (10% хөнгөлөлт)"

```javascript
export function normalizeItem(item) {
  return {
    name: item.name,
    qty: item.qty || 1,
    discount: item.discount || 0.1,
  };
}
```

<details><summary>Хариу</summary>

- `||` нь **бүх falsy** утгыг (`0`, `""`, `false`, `NaN`) солино. Худалдагч "хөнгөлөлтгүй" (`discount: 0`) гэж тохируулсан ч 10% хөнгөлөлт өгнө: мөнгөний алдагдал. `qty: 0` ч `1` болно.
- "Өгөөгүй" гэдэг нь `null`/`undefined` гэсэн үг. Засвар: `??` (nullish coalescing).

Эх сурвалж: [MDN: Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing), [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
</details>

---

## 6.6 AI-тай ажиллах дүрэм

1. **Эхлээд өөрөө бод.** Юу хийхийг, ямар edge case байгааг AI-аас асуухаас өмнө тодорхойл. Тэгэхгүй бол AI-ийн шийдлийг үнэлэх шалгуургүй болно.
2. **Prompt-доо шаардлагаа тодорхой бич.** "Эхийг өөрчлөхгүй", "хоосон массивыг шийд", "хэрэглэгчийн оролт аюултай байж болно" гэх мэт.
3. **Тестийг өөрөө бич** (эсвэл AI-ийн бичсэн тестийг шүүмжил). Кодыг бичсэн "хүн" өөрийн тестийг бичвэл ижил сохор цэгтэй байдаг.
4. **Ойлгоогүй кодоо бүү commit хий.** Мөр бүрийг тайлбарлаж чадахгүй бол AI-аас тайлбарлуул, дараа нь MDN-ээр шалга.
5. **Итгэлтэй өнгө ≠ зөв хариу.** AI-ийн тайлбар биш, тест болон эх сурвалж л нотолгоо болно.

---

## 6.7 Нэмэлт даалгавар

1. **Өөрөө алдаа нуу.** Өмнөх хичээлүүдийн жишээ кодонд (`examples/01-core.js` гэх мэт) нэг далд алдаа оруулаад найздаа өг. Тэр олж чадах уу?
2. **Бодит AI-тай турш.** Дээрх 13 prompt-ыг AI-д өгөөд хариуг нь 7 асуултаар шалга. Ямар алдаа давтагдаж байна? Prompt-оо сайжруулбал алдаа багасах уу?
3. **Нээлттэй эх код унш.** `npm install lodash` хийгээд `node_modules/lodash/debounce.js`-ийг нээж, Дасгал 2-ын засвартай харьцуул. Lodash юуг нэмж шийдсэн бэ? (`leading`, `trailing`, `maxWait`, `cancel`, `flush`)

---

## ✅ Өөрийгөө шалгах (Хичээл 6)

- [ ] 13 дасгалын дор хаяж 10-ын алдааг тест ажиллуулахаас **өмнө** олсон
- [ ] Code review-ийн 7 асуултыг цээжээр хэлж чадна
- [ ] Алдаатай код дээр унаж, зөв код дээр давдаг тест бичиж чадна
- [ ] `npm test` бүгд давтал `bugs/` доторх кодыг өөрөө зассан
- [ ] AI-ийн хариуг MDN эсвэл стандартаар шалгадаг дадалтай болсон

⬅️ [Хичээл 5](05-practice-and-interview.md) · 🏠 [Агуулга](README.md)
