# Хичээл 1. Core JavaScript

> **Хугацаа:** 1–2 сар (6 дэд хичээл, тус бүр 1–2 долоо хоног)
> **Урьдчилсан мэдлэг:** хувьсагч, `if`, давталт, функц бичиж чаддаг байх
> **Жишээ код:** [`examples/01-core.js`](examples/01-core.js) — `node lessons/examples/01-core.js`

Энэ хичээлийн бүх тайлбар ECMAScript стандарт болон MDN, javascript.info дээр үндэслэсэн. Дэд хичээл бүрийн төгсгөлд **Эх сурвалж** хэсэг байгаа тул эргэлзээтэй зүйл гарвал тэндээс шалгаарай.

---

## 1.1 Variables & Scope

### Зорилго
- `var`, `let`, `const`-ийн ялгааг тайлбарлаж чаддаг болох
- Function scope, block scope, global scope-ийг ялгах

### Онол

**Scope** гэдэг нь хувьсагч "харагдах", хандаж болох кодын хүрээ юм. JavaScript-д үндсэн 3 төрлийн scope бий ([MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)):

1. **Global scope** — бүх кодоос харагдана
2. **Function scope** — функц доторх хувьсагч зөвхөн тэр функц дотроо харагдана
3. **Block scope** — `{ }` хаалтан доторх `let`/`const` зөвхөн тэр блок дотроо харагдана

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | **function** | **block** | **block** |
| Дахин зарлах (re-declare) нэг scope-д | Болно | `SyntaxError` | `SyntaxError` |
| Дахин утга оноох (re-assign) | Болно | Болно | `TypeError` |
| Зарлахаас өмнө хандвал | `undefined` | `ReferenceError` (TDZ) | `ReferenceError` (TDZ) |
| Script-ийн top-level дээр `globalThis`-ийн property болох уу | Тийм | Үгүй | Үгүй |

```javascript
function demo() {
  if (true) {
    var a = 1;   // function scope — if-ээс гадна ч харагдана
    let b = 2;   // block scope — зөвхөн if дотор
    const c = 3; // block scope
  }
  console.log(a);         // 1
  console.log(typeof b);  // "undefined" — b энд огт байхгүй
}
demo();
```

**`const` ≠ өөрчлөгдөхгүй утга.** `const` нь зөвхөн *хувьсагчийг дахин оноохыг* хориглодог. Объект, массивын *агуулгыг* өөрчилж болно ([MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)):

```javascript
const user = { name: "Bat" };
user.name = "Dorj";      // ✅ болно — объектын агуулга өөрчлөгдөж байна
// user = {};            // ❌ TypeError: Assignment to constant variable.
```

### Яагаад global хувьсагчаас зайлсхийх вэ?
- Аль ч код өөрчилж чадах тул bug-ийн эх үүсвэрийг олоход хэцүү
- Өөр script / library-тэй нэр давхцах (name collision) эрсдэлтэй
- `var`-аар top-level дээр зарласан хувьсагч `window` (browser) объектын property болдог — жишээ нь `var name` нь `window.name`-тэй мөргөлдөнө

### Практик зөвлөмж
> **Анхдагчаар `const` ашигла. Дахин оноох шаардлагатай үед л `let`. `var`-ыг шинэ кодонд бүү ашигла.**
> Энэ нь Airbnb, Google зэрэг томоохон style guide-уудын зөвлөмжтэй нийцдэг.

### Дасгал 1.1
Ажиллуулахгүйгээр гаралтыг таамагла, дараа нь console дээр шалга:

```javascript
console.log(a);
var a = 5;

console.log(b);
let b = 10;
```

<details>
<summary>Хариу</summary>

1. `console.log(a)` → **`undefined`**. `var a` hoist хийгдэж `undefined` утгатай болсон, `= 5` оноолт тэр мөрөндөө л биелнэ.
2. `console.log(b)` → **`ReferenceError: Cannot access 'b' before initialization`**. `let b` hoist хийгдсэн ч Temporal Dead Zone-д байна (1.2-ыг үз).
</details>

### Эх сурвалж
- MDN — [`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), [Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- javascript.info — [The old "var"](https://javascript.info/var)

---

## 1.2 Hoisting

### Зорилго
- Hoisting гэж юу болохыг, ямар declaration яаж hoist хийгддэгийг мэдэх
- Temporal Dead Zone (TDZ)-ийг тайлбарлах

### Онол

JS engine код ажиллуулахаасаа өмнө scope бүрийн **declaration-уудыг бүртгэдэг**. Үүний үр дүнд declaration нь "scope-ийн эхэнд шилжсэн" мэт харагддаг — үүнийг **hoisting** гэнэ ([MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)).

> ⚠️ Код физикээр "дээш зөөгддөггүй". Энэ бол зөвхөн ойлгоход хялбар зүйрлэл. Бодит байдал дээр engine эхлээд scope-ийн бүх нэрийг бүртгэж, дараа нь кодыг мөр мөрөөр гүйцэтгэдэг.

| Declaration | Hoist хийгддэг үү | Зарлахаас өмнө хандвал |
|---|---|---|
| `var x` | Тийм, `undefined` утгатай | `undefined` |
| `let x` / `const x` | Тийм, гэхдээ **initialize хийгдэхгүй** | `ReferenceError` |
| `function f() {}` | **Бүрэн** (нэр + бие) | Дуудаж болно ✅ |
| `var f = function() {}` | Зөвхөн `var f` (= `undefined`) | `TypeError: f is not a function` |
| `const f = () => {}` | TDZ | `ReferenceError` |
| `class C {}` | TDZ | `ReferenceError` |

### Temporal Dead Zone (TDZ)

Блок эхэлснээс `let`/`const` мөр хүртэлх хэсгийг **TDZ** гэдэг. Энэ хооронд хувьсагч "байгаа" боловч хандах боломжгүй ([MDN: let → TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)):

```javascript
{
  // --- TDZ эхэлсэн ---
  // console.log(x);   // ReferenceError
  // typeof x;         // ReferenceError (typeof ч хамгаалахгүй!)
  let x = 1;           // --- TDZ дууссан ---
  console.log(x);      // 1
}
```

TDZ нь "*цаг хугацааны*" (temporal) — кодын байрлал биш, **гүйцэтгэх дараалал** чухал:

```javascript
function show() {
  return value; // энэ функц доторх мөр value-аас "дээр" бичигдсэн
}
let value = 42;
console.log(show()); // 42 ✅ — дуудах үед value аль хэдийн initialize болсон
```

### Function declaration vs function expression

```javascript
console.log(sum(2, 3)); // 5 ✅ — declaration бүрэн hoist хийгдсэн
function sum(a, b) {
  return a + b;
}

// console.log(mul(2, 3)); // TypeError: mul is not a function (mul === undefined)
var mul = function (a, b) {
  return a * b;
};
```

### Асуултууд (хариулж чаддаг болох)

1. **Яагаад `let`-ээр тодорхойлсон хувьсагчийг дуудахад "Cannot access before initialization" алдаа гардаг вэ?**
   → Хувьсагч hoist хийгдсэн (engine нэрийг нь мэддэг) боловч initialize хийгдээгүй, TDZ-д байгаа учир. Хэрэв огт hoist хийгддэггүй байсан бол `x is not defined` гэж гарах байсан.
2. **Function declaration болон expression-ийн hoisting дахь ялгаа?**
   → Declaration бол нэр болон биеэрээ бүрэн hoist. Expression бол зөвхөн хувьсагч нь (`var` бол `undefined`, `let`/`const` бол TDZ) hoist хийгдэнэ.

### Дасгал 1.2
```javascript
console.log(typeof foo);
console.log(typeof bar);
var foo = function () {};
function bar() {}
```

<details>
<summary>Хариу</summary>

`"undefined"`, `"function"`. `foo` нь `var` тул `undefined`; `bar` нь function declaration тул бүрэн hoist хийгдсэн.
</details>

### Эх сурвалж
- MDN — [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), [let → Temporal dead zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)
- javascript.info — [Variable scope, closure](https://javascript.info/closure) ("Lexical Environment" хэсэг)

---

## 1.3 Closures ⭐ (Хамгийн чухал сэдвүүдийн нэг)

### Зорилго
- Closure-ийн тодорхойлолт, яаж үүсдэгийг ойлгох
- Private state, factory function, callback дотор closure ашиглах

### Онол

MDN-ийн тодорхойлолт ([Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)):
> *A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).*

Энгийнээр: **функц нь өөрийг үүсгэсэн орчны хувьсагчдыг "санаж" авч явдаг**, тэр орчны функц ажиллаж дууссаны дараа ч гэсэн. JavaScript-д **функц бүр** үүсэх мөчдөө closure үүсгэдэг.

Үүний цаана **lexical scoping** байдаг: функц хувьсагчийг *хаана бичигдсэнээрээ* хайдаг, хаанаас дуудагдсанаар биш.

```javascript
function counter() {
  let count = 0;           // гаднаас харагдахгүй "private" хувьсагч
  return function () {
    count++;
    return count;
  };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2

const another = counter(); // ШИНЭ орчин, ШИНЭ count
console.log(another());   // 1
```

`counter()` дуусахад `count` устах ёстой мэт боловч дотоод функц түүнд reference барьж байгаа тул garbage collector устгахгүй.

### Чухал: closure **утгыг биш, хувьсагчийг** (reference) санадаг

```javascript
let greeting = "Сайн уу";
const say = () => console.log(greeting);
greeting = "Баяртай";
say(); // "Баяртай" — үүсгэх үеийн утга биш, одоогийн утга
```

### Сонгодог interview бодлого: давталт + `setTimeout`

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0);
}
// var: 3, var: 3, var: 3  — бүгд НЭГ л i-г хуваалцаж байна

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 0);
}
// let: 0, let: 1, let: 2  — let нь iteration бүрт ШИНЭ binding үүсгэдэг
```

### Хэрэглээ
1. **Encapsulation / private хувьсагч** (дээрх `counter`)
2. **Function factory:**
   ```javascript
   const makeMultiplier = (x) => (y) => x * y;
   const double = makeMultiplier(2);
   double(5); // 10
   ```
3. **Event handler, callback** — handler дотроос гаднах state-д хандах
4. **Debounce / throttle** (Хичээл 5-ыг үз)
5. **React hooks** — функцэн компонент бүр render болгонд шинэ closure үүсгэдэг. "Stale closure" гэдэг алдаа үүнээс үүдэлтэй ([react.dev: State as a Snapshot](https://react.dev/learn/state-as-a-snapshot))

### Дасгал 1.3
1. `counter` функцийг санахгүйгээр scratch-ээс бич. `count`-ийг гаднаас өөрчилж болохгүйг (`increment.count = 100` хийгээд дахин дуудах) харуул.
2. `createBankAccount(initial)` бич: `deposit(n)`, `withdraw(n)`, `getBalance()` method-той объект буцаадаг, үлдэгдэл хасах руу орохыг хориглодог.

<details>
<summary>Хариу (2)</summary>

```javascript
function createBankAccount(initial = 0) {
  let balance = initial; // private
  return {
    deposit(n) {
      balance += n;
      return balance;
    },
    withdraw(n) {
      if (n > balance) throw new Error("Үлдэгдэл хүрэлцэхгүй");
      balance -= n;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const acc = createBankAccount(100);
acc.deposit(50);          // 150
acc.balance = 1_000_000;  // шинэ property нэмэгдэнэ, private balance-д нөлөөлөхгүй
acc.getBalance();         // 150
```
</details>

### Эх сурвалж
- MDN — [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- javascript.info — [Variable scope, closure](https://javascript.info/closure)

---

## 1.4 `this` Keyword

### Зорилго
- `this`-ийн утгыг дуудлагын хэлбэрээс тодорхойлж чаддаг болох
- Arrow function болон энгийн function-ийн ялгааг мэдэх

### Онол

Энгийн (arrow биш) функцийн хувьд `this`-ийн утга нь **функцийг хэрхэн дуудсанаас** хамаардаг, хаана бичигдсэнээс биш ([MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)).

| Дуудлагын хэлбэр | `this`-ийн утга |
|---|---|
| Method: `obj.method()` | `obj` (цэгийн өмнөх объект) |
| Энгийн дуудлага: `fn()` | **strict mode**: `undefined`; **non-strict**: `globalThis` (`window` / Node-д `global`) |
| Arrow function | Өөрийн `this` **байхгүй** — гаднах (lexical) scope-ийнхийг авна |
| `fn.call(ctx, a, b)` / `fn.apply(ctx, [a, b])` | `ctx` |
| `fn.bind(ctx)` | Үргэлж `ctx` (дахин `bind`/`call` хийсэн ч өөрчлөгдөхгүй) |
| `new Fn()` | Шинээр үүссэн объект |
| DOM event handler (`addEventListener`, энгийн function) | `event.currentTarget` (listener холбогдсон элемент) |

> ES module болон `class` биеийн код **автоматаар strict mode**-д ажилладаг ([MDN: Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)).

### Хамгийн түгээмэл алдаа: "this алдагдах"

```javascript
"use strict";
const user = {
  name: "Bat",
  hello() {
    return `Сайн уу, ${this.name}`;
  },
};

user.hello();            // "Сайн уу, Bat"

const fn = user.hello;   // method-ийг объектоос салгав
// fn();                 // TypeError: Cannot read properties of undefined (reading 'name')

setTimeout(user.hello, 0);              // this алдагдана (callback болгож дамжуулсан)
setTimeout(() => user.hello(), 0);      // ✅ засвар 1: wrapper
setTimeout(user.hello.bind(user), 0);   // ✅ засвар 2: bind
```

### Arrow vs энгийн function

```javascript
const team = {
  name: "Dev",
  members: ["Bat", "Saraa"],

  regular() {
    return this.members.map(function (m) {
      return `${m} - ${this?.name}`; // энгийн callback → this === undefined (strict)
    });
  },

  arrow() {
    return this.members.map((m) => `${m} - ${this.name}`); // arrow → гаднах this === team
  },

  badArrowMethod: () => typeof this, // arrow-ыг method болгож болохгүй! this нь team биш
};
```

**Дүрэм:** method-ийг энгийн (shorthand) функцээр, method доторх callback-ийг arrow-оор бич.

### Дасгал 1.4
```javascript
const obj = {
  value: 42,
  getRegular() { return this.value; },
  getArrow: () => this?.value,
};
const { getRegular } = obj;

console.log(obj.getRegular());
console.log(obj.getArrow());
console.log(getRegular.call({ value: 7 }));
```

<details>
<summary>Хариу</summary>

`42`, `undefined` (arrow-ийн `this` нь `obj` биш, гаднах scope-ийнх), `7`.
</details>

### Эх сурвалж
- MDN — [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- javascript.info — [Object methods, "this"](https://javascript.info/object-methods), [Function binding](https://javascript.info/bind)

---

## 1.5 Prototype & Prototypal Inheritance

### Зорилго
- Prototype chain хэрхэн ажилладгийг ойлгох
- `class` нь доогуураа prototype ашигладгийг харуулах

### Онол

JavaScript-ийн объект бүр `[[Prototype]]` гэсэн далд холбоостой — энэ нь өөр объект эсвэл `null`. Объектоос property хайхад ([MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)):

1. Эхлээд объект **өөр дээрээ** хайна
2. Олдохгүй бол `[[Prototype]]` дээр хайна
3. ...гэх мэтээр `null` хүртэл гинжээр явна → олдохгүй бол `undefined`

```javascript
const animal = {
  eats: true,
  walk() { return `${this.name} алхаж байна`; },
};

const rabbit = Object.create(animal); // rabbit.[[Prototype]] = animal
rabbit.name = "Туулай";

rabbit.eats;                                  // true — prototype-оос
rabbit.walk();                                // "Туулай алхаж байна" — this === rabbit
Object.getPrototypeOf(rabbit) === animal;     // true
Object.hasOwn(rabbit, "eats");                // false — өөрийнх биш
Object.hasOwn(rabbit, "name");                // true
```

Гинж: `rabbit → animal → Object.prototype → null`

**Бичих үйлдэл гинжээр дамждаггүй:** `rabbit.eats = false` гэвэл `animal`-ийг өөрчлөхгүй, `rabbit` дээр шинэ own property үүснэ.

### `__proto__` талаар
`obj.__proto__` нь хуучны (legacy) accessor. Стандарт арга нь `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf(obj, proto)` / `Object.create(proto)` ([MDN: `__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)).

### `class` = prototype-ийн дээрх syntax

```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} дуугарлаа`; }
}
class Dog extends Animal {
  speak() { return `${super.speak()}: Хав хав!`; }
}

const d = new Dog("Хасар");
typeof Animal;                                            // "function"
Object.getPrototypeOf(d) === Dog.prototype;               // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
Object.hasOwn(d, "speak");                                // false — method нь prototype дээр
```

> "Syntactic sugar" гэдэг нь *ихэнхдээ* үнэн, гэхдээ бүрэн биш: `class` нь TDZ-тэй, үргэлж strict mode, `new`-гүй дуудвал `TypeError`, `#private` field дэмждэг гэх мэт ялгаатай ([MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)).

### Дасгал 1.5
1. `class`-гүйгээр, зөвхөн `Object.create` ашиглан `vehicle → car → myCar` гурван түвшний гинж үүсгэ. `myCar` дээр `Object.getPrototypeOf`-ийг давтан дуудаж гинжийг `null` хүртэл хэвлэ.
2. Constructor function (`function Person(name) {...}` + `Person.prototype.greet = ...`) ашиглан бичээд, дараа нь ижил зүйлийг `class`-аар дахин бич.

### Эх сурвалж
- MDN — [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain), [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create), [Object.getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf), [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- javascript.info — [Prototypal inheritance](https://javascript.info/prototype-inheritance)

---

## 1.6 Event Loop, Call Stack, Task Queue ⭐ (Хамгийн гүнзгий сэдэв)

### Зорилго
- Single-threaded JS асинхрон кодыг хэрхэн гүйцэтгэдгийг тайлбарлах
- Task (macrotask) ба microtask-ийн дарааллыг зөв таамаглах

### Онол

JS кодыг нэг thread дээр, **нэг удаад нэг ажил** гүйцэтгэдэг. Ажил бүр "run-to-completion" — эхэлсэн бол дуустал өөр код тасалдуулахгүй ([MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)).

**Бүрэлдэхүүн хэсгүүд:**

1. **Call Stack** — одоо гүйцэтгэж буй функцүүдийн stack (LIFO)
2. **Web APIs / host API** — browser (эсвэл Node.js) өгдөг: `setTimeout`, DOM event, `fetch`. Эдгээр нь **JS хэлний** хэсэг биш, host орчны хэсэг
3. **Task queue (macrotask)** — `setTimeout`/`setInterval` callback, DOM event, I/O
4. **Microtask queue** — `Promise.then/catch/finally` callback, `await`-ийн дараах үргэлжлэл, `queueMicrotask()`
5. **Event Loop** — дараах алгоритмыг давтана

**Event loop-ийн нэг эргэлт** (HTML стандартыг хялбарчилсан нь, [HTML Standard: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)):

```
1. Task queue-ээс НЭГ task аваад гүйцэтгэ (script өөрөө ч бас task)
2. Call stack хоосон болмогц microtask queue-г БҮРЭН хоосолтол гүйцэтгэ
   (microtask дотроос нэмэгдсэн шинэ microtask ч мөн энэ үед гүйцэтгэгдэнэ)
3. Шаардлагатай бол дэлгэцийг дахин зурна (rendering)
4. 1-рүү буцна
```

> MDN: *"Microtasks have higher priority and the microtask queue is drained first before the task queue is pulled."*

### Жишээ 1

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 1, 4, 3, 2
```

Алхам алхмаар:
| Алхам | Call stack | Microtask | Task | Гаралт |
|---|---|---|---|---|
| `log("1")` | script | | | `1` |
| `setTimeout` | script | | `()=>log(2)` | |
| `.then` | script | `()=>log(3)` | `()=>log(2)` | |
| `log("4")` | script | `()=>log(3)` | `()=>log(2)` | `4` |
| script дууссан → microtask | | | `()=>log(2)` | `3` |
| дараагийн task | | | | `2` |

### Жишээ 2 — `async/await` орсон

```javascript
async function a() {
  console.log("A1");
  await null;            // үлдсэн хэсэг нь microtask болж хойшилно
  console.log("A2");
}
console.log("start");
setTimeout(() => console.log("timeout"), 0);
a();
Promise.resolve().then(() => console.log("then"));
console.log("end");
// start, A1, end, A2, then, timeout
```

`async` функц `await` хүртэл **синхроноор** ажилладаг гэдгийг анхаар (`A1` нь `end`-ээс өмнө).

### Түгээмэл буруу ойлголтууд
- ❌ "`setTimeout(fn, 0)` шууд ажиллана" → ✅ Хамгийн багадаа одоогийн script + бүх microtask дууссаны *дараа*. Мөн browser-ууд давхарласан timer-ийг 4ms-ээс багагүй болгодог
- ❌ "Promise нь тусдаа thread дээр ажилладаг" → ✅ Promise callback мөн л нэг thread дээр, microtask болж ажиллана
- ⚠️ Microtask-ийг төгсгөлгүй нэмэх нь (рекурсив `.then`) render-ийг бүрэн гацаана — task queue хэзээ ч эргэлт авахгүй

### Node.js-ийн тухай тэмдэглэл
Node.js-ийн event loop нь libuv дээр суурилсан, хэд хэдэн phase-тай (timers, poll, check...). Мөн `process.nextTick` нь Promise microtask-аас ч өмнө ажилладаг ([Node.js: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)). Гэхдээ "sync код → microtask → macrotask" гэсэн үндсэн дүрэм хоёр орчинд адил.

### Дасгал 1.6
Гаралтыг таамагла, дараа нь [JS Visualizer 9000](https://www.jsv9000.app/) эсвэл console дээр шалга:

```javascript
console.log("A");
setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);
Promise.resolve()
  .then(() => {
    console.log("D");
    setTimeout(() => console.log("E"), 0);
  })
  .then(() => console.log("F"));
queueMicrotask(() => console.log("G"));
console.log("H");
```

<details>
<summary>Хариу</summary>

**`A H D G F B C E`**

- Sync: `A`, `H`
- Microtask-ууд (бүртгэгдсэн дарааллаар): `D` (дотроо `E` timer нэмнэ, `F`-ийг microtask болгоно), `G`, дараа нь `F`
- Task 1 (`B`-ийн timer): `B` → түүний дараах microtask `C`
- Task 2 (`E`-ийн timer): `E`
</details>

### Эх сурвалж
- MDN — [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), [Using microtasks (Microtask guide)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide), [queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
- WHATWG — [HTML Standard: Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- javascript.info — [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- Node.js — [The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

---

## ✅ Өөрийгөө шалгах (Хичээл 1)

- [ ] `var`/`let`/`const`-ийн 4 ялгааг хэлж чадна
- [ ] TDZ гэж юу болохыг жишээгээр тайлбарлаж чадна
- [ ] Closure-ийг ашиглан private state үүсгэж чадна
- [ ] `for (var ...)` + `setTimeout` бодлогын хариу, *шалтгааныг* тайлбарлаж чадна
- [ ] `this`-ийн 6 тохиолдлыг жишээгээр харуулж чадна
- [ ] Prototype chain-ийг зурж тайлбарлаж чадна
- [ ] Sync / microtask / macrotask холилдсон кодын гаралтыг зөв таамаглана

➡️ Дараагийн хичээл: [Хичээл 2. Асинхрон программчлал](02-async-programming.md)
