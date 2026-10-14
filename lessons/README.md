# JavaScript-ийн Гүнзгий Мэдлэг — Хичээлийн Агуулга

*"JavaScript-ийн Гүнзгий Мэдлэгтэй Болох Зам" roadmap-ийн дагуу бэлтгэсэн хичээлүүд*

Хичээл бүр: **зорилго → онол → ажилладаг жишээ код → түгээмэл алдаа → дасгал (хариутай) → эх сурвалж → өөрийгөө шалгах** гэсэн бүтэцтэй.

## Агуулга

| # | Хичээл | Сэдвүүд | Хугацаа |
|---|---|---|---|
| 1 | [Core JavaScript](01-core-javascript.md) | Scope, hoisting, closure, `this`, prototype, event loop | 1–2 сар |
| 2 | [Асинхрон программчлал](02-async-programming.md) | Callback → Promise → async/await, combinators, Fetch | 2–3 долоо хоног |
| 3 | [Гүнзгий ойлголтууд](03-deep-concepts.md) | Higher-order functions, memory/GC, modules, `call`/`apply`/`bind` | 2–3 долоо хоног |
| 4 | [DOM ба Vanilla JS](04-dom-vanilla-js.md) | DOM, events, delegation, `localStorage`, 4 жижиг төсөл | 2–3 долоо хоног + 1 сар |
| 5 | [Дадлага ба Interview](05-practice-and-interview.md) | Хуваарь, эх сурвалж, debounce/throttle, 18 interview асуулт | — |
| 6 | [AI-ийн кодыг шүүмжлэх](06-reviewing-ai-code.md) | Code review-ийн 7 асуулт, `node:test`, тестээр нотлох 13 алдаатай кодын дасгал | 2–3 долоо хоног |

## Жишээ кодыг ажиллуулах

[Node.js](https://nodejs.org/) 18 буюу түүнээс хойшх хувилбар хэрэгтэй.

```bash
node lessons/examples/01-core.js        # scope, hoisting, closure, this, prototype, event loop
node lessons/examples/02-async.js       # promise, combinators, fetch (интернэт хэрэгтэй)
node lessons/examples/03-deep.js        # myReduce/myMap/myFilter, myCall/myApply/myBind
node lessons/examples/modules/main.mjs  # ESM live binding
node lessons/examples/modules/main.cjs  # CommonJS хуулбар
node lessons/examples/05-interview.js   # debounce / throttle

cd lessons/examples/06-review
npm test                                # Хичээл 6: алдаатай код дээр тест унана
npm run test:fixes                      # засварласан хариу дээр бүгд давна
```

To-Do төсөл: [`examples/todo/index.html`](examples/todo/index.html)-ийг browser дээр нээ (эсвэл VS Code Live Server).

Хичээлд гарсан **бүх гаралт** (жишээ нь event loop-ийн дараалал) эдгээр файлыг ажиллуулж шалгагдсан.

## Эх сурвалжийн тухай

Агуулгыг дараах албан ёсны, олон нийтээр хянагддаг эх сурвалжид үндэслэв:

- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** — Mozilla болон browser үйлдвэрлэгчдийн хамтран засварладаг reference
- **[ECMAScript® Language Specification](https://tc39.es/ecma262/)** — JavaScript хэлний албан ёсны стандарт (TC39)
- **[HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)** — browser-ийн event loop-ийн стандарт (WHATWG)
- **[Node.js Documentation](https://nodejs.org/api/)** — Node.js-ийн module систем, event loop
- **[javascript.info](https://javascript.info/)** — нээлттэй эх, олон нийтээр хянагддаг сурах бичиг
- **[V8 blog](https://v8.dev/blog)**, **[react.dev](https://react.dev/)**, **[Chrome DevTools docs](https://developer.chrome.com/docs/devtools)**

Хичээл бүрийн дэд сэдэв бүрийн төгсгөлд тухайн хуудасны шууд холбоос бий.

### Roadmap-аас зассан / нарийвчилсан зүйлс

Эх roadmap-ийг эх сурвалжтай тулгахад доорх зүйлсийг нарийвчлав:

1. **`myReduce`** — `initialValue` өгөөгүй үед эхний элементээс эхэлдэг, хоосон массив дээр `TypeError` шиддэг болгож засав ([MDN: reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)).
2. **`myBind`** — `new`-тэй дуудах тохиолдлыг нэмэлт дасгал болгов.
3. **`this` энгийн дуудлагад** — non-strict үед `globalThis` (`window`/`global`), strict mode болон ES module/class дотор `undefined`.
4. **Hoisting** — код физикээр "дээш зөөгддөггүй", engine declaration-уудыг урьдчилан бүртгэдэг гэдгийг тодруулав.
5. **Event loop** — нэг task-ийн дараа microtask queue **бүхэлдээ** хоосортол гүйцэтгэгддэг, Node.js-д `process.nextTick` нэмэлт дараалал байдгийг нэмэв.
6. **`class`** — "syntactic sugar" нь ихэнхдээ үнэн боловч TDZ, strict mode, `new` шаардлага, `#private` зэрэг ялгаатайг тэмдэглэв.
7. **`fetch`** — HTTP 404/500 дээр reject болдоггүйг онцлон, `AbortController`-оор цуцлах аргыг нэмэв.
