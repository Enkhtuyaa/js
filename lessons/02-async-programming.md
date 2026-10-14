# Хичээл 2. Асинхрон Программчлал

> **Хугацаа:** 2–3 долоо хоног
> **Урьдчилсан мэдлэг:** [Хичээл 1.6 — Event Loop](01-core-javascript.md#16-event-loop-call-stack-task-queue--хамгийн-гүнзгий-сэдэв)
> **Жишээ код:** [`examples/02-async.js`](examples/02-async.js) — `node lessons/examples/02-async.js`

---

## 2.1 Эволюц: Callback → Promise → Async/Await

### Зорилго
- Callback, Promise, async/await гурвын ялгааг ойлгох
- Алдааг (error) зөв барьж сурах

### 2.1.1 Callback

**Callback** гэдэг нь өөр функцэд аргумент болгон дамжуулж, хожим дуудагдах функц ([MDN: Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)). Асинхрон ажлын үр дүнг хүлээн авах хамгийн эртний арга.

Node.js-д тогтсон хэв маяг бол **error-first callback**: эхний аргумент нь алдаа (`null` бол алдаагүй).

```javascript
function getUser(id, callback) {
  setTimeout(() => {
    if (id <= 0) return callback(new Error("Буруу id"));
    callback(null, { id, name: "Bat" });
  }, 100);
}

getUser(1, (err, user) => {
  if (err) return console.error(err.message);
  console.log(user.name);
});
```

**Callback hell ("pyramid of doom"):**
```javascript
getUser(id, (err, user) => {
  if (err) return handle(err);
  getPosts(user, (err, posts) => {
    if (err) return handle(err);
    getComments(posts, (err, comments) => {
      if (err) return handle(err);
      // ... гүнзгийрсээр
    });
  });
});
```

Асуудлууд: уншихад хэцүү, түвшин бүрт алдааг давтан шалгах, callback-ийг 2 удаа эсвэл огт дуудахгүй байх эрсдэл ("inversion of control").

### 2.1.2 Promise

**Promise** бол *ирээдүйд бэлэн болох утгыг* төлөөлөх объект ([MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)). 3 төлөвтэй:

```
            ┌──► fulfilled (утгатай)
pending ────┤
            └──► rejected  (алдаатай)
```

Нэг удаа *settled* (fulfilled эсвэл rejected) болсон Promise дахин төлөвөө өөрчлөхгүй.

**Promise үүсгэх:**
```javascript
function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Буруу id"));
      else resolve({ id, name: "Bat" });
    }, 100);
  });
}
```

**Chaining:** `.then()` бүр **шинэ Promise** буцаадаг. `.then` дотроос утга буцаавал дараагийн `.then` түүнийг авна; Promise буцаавал түүнийг хүлээнэ.

```javascript
getUser(1)
  .then((user) => getPosts(user))       // Promise буцааж байна → хүлээнэ
  .then((posts) => getComments(posts))
  .then((comments) => console.log(comments))
  .catch((err) => console.error(err))   // дээрх АЛЬ Ч алхмын алдааг барина
  .finally(() => console.log("Дууслаа")); // амжилттай/алдаатай аль ч үед
```

> ⚠️ **Хамгийн түгээмэл алдаа:** `.then` дотор `return` мартах.
> ```javascript
> .then((user) => { getPosts(user); })        // ❌ undefined буцаана, хүлээхгүй
> .then((user) => getPosts(user))              // ✅
> .then((user) => { return getPosts(user); })  // ✅
> ```

### 2.1.3 Async/Await

`async` функц **үргэлж Promise буцаадаг**. `await` нь Promise settle болтол *тухайн функцийн* гүйцэтгэлийг түр зогсоодог (thread-ийг блоклодоггүй — үлдсэн хэсэг нь microtask болдог) ([MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)).

```javascript
async function fetchData(id) {
  try {
    const user = await getUser(id);
    const posts = await getPosts(user);
    const comments = await getComments(posts);
    return comments;            // → fulfilled утга
  } catch (err) {
    console.error(err.message); // rejected Promise-ийг энд барина
    throw err;                  // дуудсан тал руу дамжуулах бол дахин throw
  } finally {
    console.log("Цэвэрлэгээ");
  }
}
```

### ⚡ Sequential vs Parallel — гүйцэтгэлийн маш чухал ялгаа

```javascript
// ❌ Дараалсан: ~200ms (бие биеэсээ хамааралгүй байхад ч хүлээнэ)
const a = await fetchA(); // 100ms
const b = await fetchB(); // 100ms

// ✅ Зэрэгцээ: ~100ms
const [a2, b2] = await Promise.all([fetchA(), fetchB()]);
```

**Дүрэм:** Дараагийн алхам өмнөхийн үр дүнгээс *хамаарч* байвал дараалуул; хамааралгүй бол `Promise.all`.

> `forEach` дотор `await` ажиллахгүй (forEach нь Promise-ийг хүлээдэггүй). Дараалуулах бол `for...of`, зэрэгцүүлэх бол `Promise.all(arr.map(...))` ашигла.

### Дасгал 2.1
1. `sleep(ms)` функц бич: `ms` миллисекундын дараа resolve болдог Promise буцаадаг. `await sleep(500)` ажиллаж байгааг шалга.
2. Callback-д суурилсан `getUser(id, cb)`-ийг Promise буцаадаг болгох `promisify(fn)` ерөнхий функц бич.
3. Дараах кодын гаралтыг таамагла:
   ```javascript
   async function f() { return 1; }
   console.log(f());
   f().then(console.log);
   ```

<details>
<summary>Хариу</summary>

```javascript
// 1
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2 — Node.js-д бэлэн util.promisify байдаг, гэхдээ өөрөө бичиж ойлгох нь чухал
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
const getUserAsync = promisify(getUser);
```

3. `Promise { 1 }` (async функц Promise буцаадаг), дараа нь `1`.
</details>

### Эх сурвалж
- MDN — [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- javascript.info — [Async/await](https://javascript.info/async-await)

---

## 2.2 Promise Combinators

| Method | Хэзээ fulfilled болох | Хэзээ rejected болох | Үр дүн |
|---|---|---|---|
| [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) | **Бүгд** fulfilled | **Аль нэг нь** rejected болмогц (fail-fast) | Утгуудын массив (оролтын дарааллаар) |
| [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) | **Бүгд** settled болоход | Хэзээ ч reject болохгүй | `{status, value}` / `{status, reason}` массив |
| [`Promise.race`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) | Хамгийн түрүүнд settled нь fulfilled бол | Хамгийн түрүүнд settled нь rejected бол | Тэр нэг утга / алдаа |
| [`Promise.any`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any) | Хамгийн түрүүнд **fulfilled** болсон | **Бүгд** rejected бол | Тэр утга / [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) |

```javascript
const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (msg, ms) => new Promise((_, j) => setTimeout(() => j(new Error(msg)), ms));

await Promise.all([ok("a", 100), ok("b", 50)]);       // ["a", "b"] — дараалал хадгалагдана
await Promise.all([ok("a", 100), fail("x", 50)]);     // ❌ Error: x (50ms дээр)
await Promise.allSettled([ok("a", 100), fail("x", 50)]);
// [{status:"fulfilled", value:"a"}, {status:"rejected", reason:Error: x}]
await Promise.race([ok("a", 100), fail("x", 50)]);    // ❌ Error: x (түрүүлсэн нь алдаа)
await Promise.any([ok("a", 100), fail("x", 50)]);     // "a" (алдааг алгасна)
```

> ⚠️ `Promise.all` reject болсон ч **бусад Promise-ууд цуцлагдахгүй**, зүгээр л үр дүнг нь тоохгүй. Бодит хүсэлтийг цуцлах бол `AbortController` (2.3) хэрэгтэй.

### Практик хэрэглээ
- `all` — dashboard-ийн хэд хэдэн API-г зэрэг татах (бүгд хэрэгтэй)
- `allSettled` — олон файл upload хийгээд аль нь амжилтгүй болсныг тайлагнах
- `race` — timeout хэрэгжүүлэх
- `any` — хэд хэдэн mirror/CDN-ээс хамгийн хурдан амжилттайгаас нь авах

### Дасгал 2.2
1. `withTimeout(promise, ms)` бич: `ms`-ээс удаан бол `Error("Timeout")`-оор reject болдог (`Promise.race` ашигла).
2. **Interview бодлого:** `Promise.all`-ийг өөрөө `myPromiseAll(iterable)` болгон бич. Шаардлага: үр дүнгийн дараалал оролтынхтой адил, хоосон массивт шууд `[]`, аль нэг нь reject болмогц reject.

<details>
<summary>Хариу</summary>

```javascript
// 1
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// 2
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);

    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {   // Promise биш утгыг ч дэмжинэ
        results[i] = value;                      // push биш — дарааллыг хадгална
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
```
</details>

### Эх сурвалж
- MDN — [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled), [race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race), [any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
- javascript.info — [Promise API](https://javascript.info/promise-api)

---

## 2.3 Fetch API-аар бодит сервертэй ажиллах

### Онол

`fetch(url, options)` нь `Response` объектоор resolve болох Promise буцаадаг ([MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)). Browser болон Node.js 18+ хоёуланд байдаг.

> ⚠️ **Маш чухал:** `fetch` нь HTTP **404, 500** зэрэг алдаатай хариунд **reject болдоггүй**! Зөвхөн сүлжээний алдаа (сервер олдохгүй, CORS, интернэт тасрах) үед reject болно. Тиймээс [`response.ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok) (status 200–299)-г **заавал** шалга.

```javascript
async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error(`HTTP алдаа: ${response.status}`);
  }
  return response.json(); // body-г уншина — энэ нь ч бас Promise
}
```

### POST хүсэлт

```javascript
async function createPost(post) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post), // объектыг string болгоно
  });
  if (!response.ok) throw new Error(`HTTP алдаа: ${response.status}`);
  return response.json();
}
```

### Хүсэлтийг цуцлах / timeout — `AbortController`

```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch(url, { signal: controller.signal });
  // ...
} catch (err) {
  if (err.name === "AbortError") console.log("Цуцлагдлаа");
  else throw err;
} finally {
  clearTimeout(timer);
}

// Орчин үеийн богино хэлбэр:
await fetch(url, { signal: AbortSignal.timeout(5000) }); // TimeoutError
```
([MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController))

### Дасгал 2.3
1. `https://jsonplaceholder.typicode.com/users` (үнэгүй, туршилтын API)-ээс хэрэглэгчдийг татаж, зөвхөн `name`, `email`-ийг хэвлэ.
2. `https://jsonplaceholder.typicode.com/users/1` болон `.../users/1/posts`-ийг **зэрэг** татаж `{ user, posts }` буцаа.
3. `fetchWithRetry(url, retries = 3)` бич: амжилтгүй бол 500ms, 1000ms, 2000ms хүлээгээд дахин оролддог (exponential backoff).
4. Буруу URL (`.../users/999999`) дээр `response.ok`, `response.status`-ийг хэвлэж, `fetch` reject болохгүйг өөрийн нүдээр хар.

<details>
<summary>Хариу (3)</summary>

```javascript
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 3, delay = 500) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(delay * 2 ** attempt); // 500, 1000, 2000
    }
  }
}
```
</details>

### Эх сурвалж
- MDN — [Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- javascript.info — [Fetch](https://javascript.info/fetch)

---

## ✅ Өөрийгөө шалгах (Хичээл 2)

- [ ] Promise-ийн 3 төлөв, chaining хэрхэн ажилладгийг тайлбарлаж чадна
- [ ] `async` функц юу буцаадгийг мэднэ
- [ ] `try/catch`-аар async алдааг барьж чадна
- [ ] Sequential vs parallel `await`-ийн ялгааг жишээгээр харуулна
- [ ] 4 combinator-ийн ялгааг хүснэгтгүйгээр хэлж чадна
- [ ] `fetch` яагаад 404 дээр reject болдоггүйг мэднэ
- [ ] `Promise.all`-ийг өөрөө бичиж чадна

⬅️ [Хичээл 1](01-core-javascript.md) · ➡️ [Хичээл 3. Гүнзгий ойлголтууд](03-deep-concepts.md)
