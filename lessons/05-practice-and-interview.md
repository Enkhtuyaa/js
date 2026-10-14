# Хичээл 5. Дадлага Хийх Стратеги ба Interview Бэлтгэл

> **Жишээ код:** [`examples/05-interview.js`](examples/05-interview.js) — `node lessons/examples/05-interview.js`

---

## 5.1 Санал болгох дараалал ба хуваарь

```
Хичээл 1: Fundamentals ..................... 1–2 сар
    ↓
Хичээл 2: Async programming ................ 2–3 долоо хоног
    ↓
Хичээл 3: Гүнзгий ойлголтууд ............... 2–3 долоо хоног
    ↓
Хичээл 4: Vanilla JS + DOM ................. 2–3 долоо хоног
    ↓
Хичээл 4.5: Жижиг vanilla төслүүд .......... 1 сар
    ↓
Framework (React гэх мэт) .................. 2–3 сар
    ↓
Бодит full-stack төсөл
```

### Долоо хоногийн жишээ хуваарь (өдөрт 1–2 цаг)

| Өдөр | Үйл ажиллагаа |
|---|---|
| Даваа | Шинэ сэдвийн онол уншина (javascript.info / MDN) |
| Мягмар | Жишээ бүрийг console дээр **гараараа** бичиж, гаралтыг урьдчилан таамаглана |
| Лхагва | Хичээлийн дасгалуудыг хийнэ (хариуг харахгүйгээр!) |
| Пүрэв | CodeWars / LeetCode дээр 2–3 бодлого |
| Баасан | Нэг polyfill эсвэл утилити scratch-ээс (`myReduce`, `debounce`, `myPromiseAll`...) |
| Бямба | Төсөл дээр ажиллана |
| Ням | Давталт: долоо хоногт сурсан зүйлээ өөрийн үгээр **бичиж** тэмдэглэнэ |

---

## 5.2 Ашиглах эх сурвалж

| Эх сурвалж | Юунд тохиромжтой | Яагаад найдвартай вэ |
|---|---|---|
| [javascript.info](https://javascript.info/) | Үндсэн сурах бичиг — эхнээс нь дараалан унш | Нээлттэй эх (open source), олон жил олон нийтээр хянагдсан |
| [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Reference — тодорхой API яг яаж ажилладгийг шалгах | Mozilla болон browser үйлдвэрлэгчид (Google, Microsoft г.м.) хамтран засварладаг |
| [ECMAScript стандарт](https://tc39.es/ecma262/) | Хэлний албан ёсны тодорхойлолт — "яг ямар дүрэмтэй вэ" гэдгийн эцсийн хариу | TC39 хорооны стандарт |
| [HTML Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) | Browser-ийн event loop-ийн албан ёсны тодорхойлолт | WHATWG стандарт |
| [Node.js Docs](https://nodejs.org/en/learn) | Node.js-ийн event loop, module систем | Албан ёсны баримт бичиг |
| [JS Visualizer 9000](https://www.jsv9000.app/) | Event loop-ийг visual байдлаар харах | Сургалтын хэрэгсэл |
| [CodeWars](https://www.codewars.com/) / [LeetCode](https://leetcode.com/) | Logic, algorithm дадлага | — |
| [Frontend Mentor](https://www.frontendmentor.io/) | Бодит дизайнаар төсөл хийх | — |

> 💡 **Эх сурвалжийг шүүх дүрэм:** Blog, видео, AI-ийн хариултаас уншсан зүйлээ **MDN эсвэл стандартаар баталгаажуул**. Хэрэв зөрвөл MDN/стандарт зөв.

---

## 5.3 Debounce ба Throttle ⭐ (closure-ийн практик жишээ)

Хоёулаа **олон дахин** гарах event-ийг (input, scroll, resize) хянадаг HOF + closure.

| | Debounce | Throttle |
|---|---|---|
| Утга | Event **зогссоноос** хойш `ms` хүлээгээд **нэг удаа** | `ms` тутамд **хамгийн ихдээ нэг удаа** |
| Зүйрлэл | Лифтний хаалга: хүн орох бүрт хүлээх хугацаа дахин эхэлнэ | Автобусны хуваарь: хэчнээн хүн хүлээж байсан ч 10 минут тутамд нэг |
| Хэрэглээ | Хайлтын input (бичиж дуусахад API дуудах), auto-save, resize дуусахад | Scroll, mousemove, infinite scroll, тоглоомын товч |

([MDN: Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce), [Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle))

```
Event:     x x x x x       x x x x x x x x
Debounce:            ●                     ●      (зогссоны дараа)
Throttle:  ●     ●     ●   ●     ●     ●          (тогтмол давтамжтай)
```

### Debounce

```javascript
function debounce(fn, ms) {
  let timer;                              // closure — дуудлага хооронд хадгалагдана
  return function (...args) {
    clearTimeout(timer);                  // өмнөхийг цуцална
    timer = setTimeout(() => fn.apply(this, args), ms);  // this, args-ийг дамжуулна
  };
}

const search = debounce((q) => console.log("API хайлт:", q), 300);
input.addEventListener("input", (e) => search(e.target.value));
```

### Throttle (эхний дуудлагыг шууд гүйцэтгэдэг хувилбар)

```javascript
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

window.addEventListener("scroll", throttle(() => console.log(scrollY), 200));
```

> 🔍 **Гүнзгийрүүлэх:** Энэ throttle нь хугацааны цонхны *сүүлийн* дуудлагыг алгасдаг ("leading only"). Сүүлийн утгыг ч мөн гүйцэтгэдэг ("trailing") хувилбарыг бич. Lodash-ийн `_.throttle`-ийн `{ leading, trailing }` сонголттой харьцуул.

---

## 5.4 Өдөр тутмын дадал

1. **Тогтмол байдал > эрчим.** Өдөрт 1–2 цаг тогтмол нь 1 сар эрчимтэй хичээгээд орхихоос үр дүнтэй.
2. **Таамагла → шалга.** Код ажиллуулахаасаа өмнө гаралтыг *цаасан дээр* бич. Буруу таамагласан бүрт *яагаад* гэдгийг олтол бүү орхи.
3. **15 минутын дүрэм.** Bug гарахад AI/Google-ээс шууд асуухын өмнө 10–15 минут өөрөө debug хий: `console.log`, DevTools-ийн breakpoint, `debugger;` statement.
4. **Долоо хоногт нэг polyfill.** `myMap`, `myBind`, `myPromiseAll`, `debounce`, `deepClone`, `EventEmitter`...
5. **Заах.** Сурсан зүйлээ найздаа тайлбарлах эсвэл блог бичих — тайлбарлаж чадахгүй бол ойлгоогүй байна.

---

## 5.5 Interview-д бэлдэх асуултууд

Хариулт бүрийг **өөрийн үгээр, жишээ кодтой** хэлж чаддаг болтол дадлага хий. Хаалтан доторх холбоос нь тухайн сэдвийн хичээл.

### Үндсэн ойлголт
1. `var`, `let`, `const`-ийн ялгаа? ([1.1](01-core-javascript.md#11-variables--scope))
2. Hoisting гэж юу вэ? TDZ? ([1.2](01-core-javascript.md#12-hoisting))
3. `==` ба `===`-ийн ялгаа? ([MDN: Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness))
4. Primitive ба reference төрлийн ялгаа? Объектыг хуулах (shallow vs deep copy, `structuredClone`)?

### Closure ба `this`
5. Closure гэж юу вэ? Практик 2 жишээ? ([1.3](01-core-javascript.md#13-closures--хамгийн-чухал-сэдвүүдийн-нэг))
6. `for (var i...)` + `setTimeout` яагаад `3 3 3` гэж хэвлэдэг вэ? 2 янзаар засна уу.
7. `this`-ийн утгыг юу тодорхойлдог вэ? Arrow function-д яагаад өөр вэ? ([1.4](01-core-javascript.md#14-this-keyword))
8. `call`, `apply`, `bind`-ийн ялгаа? `bind`-ийг өөрөө бичнэ үү. ([3.4](03-deep-concepts.md#34-call-apply-bind-ийг-өөрөө-хийж-үзэх))

### Prototype
9. Prototype chain гэж юу вэ? `class` доогуураа яаж ажилладаг вэ? ([1.5](01-core-javascript.md#15-prototype--prototypal-inheritance))
10. `Object.create(null)` юугаараа онцлог вэ?

### Async
11. Event loop-ийг тайлбарлана уу. Microtask ба macrotask? ([1.6](01-core-javascript.md#16-event-loop-call-stack-task-queue--хамгийн-гүнзгий-сэдэв))
12. Гаралтыг таамагла (1.6-ийн дасгал шиг бодлого) — **хамгийн их асуудаг**
13. `Promise.all` ба `Promise.allSettled`-ийн ялгаа? `Promise.all`-ийг өөрөө бич. ([2.2](02-async-programming.md#22-promise-combinators))
14. `fetch` 404 дээр reject болох уу? ([2.3](02-async-programming.md#23-fetch-api-аар-бодит-сервертэй-ажиллах))

### Практик код бичих
15. `debounce` бич. `throttle` бич. Ялгаа? (5.3)
16. `Array.prototype.reduce`-ийг өөрөө бич. ([3.1](03-deep-concepts.md#31-higher-order-functions))
17. Event delegation гэж юу вэ? ([4.3](04-dom-vanilla-js.md#43-events))
18. Memory leak-ийн шалтгаанууд? ([3.2](03-deep-concepts.md#32-memory-management))

---

## Дүгнэлт

Гүнзгий мэдлэг гэдэг нь framework мэдэх тоо биш, харин **доод давхаргыг ойлгож, шинэ зүйл гарч ирэхэд хурдан дасан зохицох чадвар**. Энэ хичээлүүдэд байгаа бүх ойлголт (closure, event loop, prototype, `this`) нь React, Vue, Node.js — бүгдийн цаана ажиллаж байдаг. Fundamentals-д зарцуулсан цаг эхэндээ удаан мэт санагдаж болох ч урт хугацаанд итгэлтэй, бат суурьтай инженер болгоно.

⬅️ [Хичээл 4](04-dom-vanilla-js.md) · ➡️ [Хичээл 6. AI-ийн кодыг шүүмжлэх](06-reviewing-ai-code.md) · 🏠 [Агуулга](README.md)
