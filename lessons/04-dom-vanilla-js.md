# Хичээл 4. Framework-руу Шилжихээс Өмнө: DOM ба Vanilla JS

> **Хугацаа:** DOM 2–3 долоо хоног + жижиг төслүүд 1 сар
> **Урьдчилсан мэдлэг:** Хичээл 1–3
> **Жишээ төсөл:** [`examples/todo/`](examples/todo/) — `index.html`-ийг browser дээр нээ

---

## 4.1 DOM гэж юу вэ?

**DOM (Document Object Model)** бол HTML баримтыг **объектуудын мод (tree)** хэлбэрээр төлөөлөх, JavaScript-ээс унших/өөрчлөх боломж олгодог API ([MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)).

```
document
 └── html
      ├── head
      │    └── title ── "Миний хуудас"
      └── body
           ├── h1 ── "Сайн уу"
           └── button#myButton ── "Дар"
```

> DOM нь JavaScript хэлний хэсэг **биш** — browser-ийн өгдөг Web API. Тиймээс Node.js дээр `document` байхгүй.

### Script-ийг хаана, яаж холбох вэ?

```html
<!-- ❌ head дотор энгийн script: DOM бэлэн болоогүй байхад ажиллана → querySelector null буцаана -->
<script src="app.js"></script>

<!-- ✅ defer: HTML бүрэн parse хийгдсэний дараа, дарааллаараа ажиллана -->
<script src="app.js" defer></script>

<!-- ✅ type="module" нь анхдагчаар defer шиг ажилладаг -->
<script type="module" src="app.js"></script>
```

> 💡 Энэ repo-гийн `index.html` дээр `<script>` нь `body`-ийн эхэнд, "Hello World" текстээс **өмнө** байна. Тэр script DOM-оос элемент хайвал олохгүй. `defer` нэмж засаарай.

---

## 4.2 Элемент сонгох, өөрчлөх

```javascript
// Сонгох — CSS selector ашиглана
const button = document.querySelector("#myButton");    // эхний тохирох элемент эсвэл null
const items = document.querySelectorAll(".item");      // static NodeList (forEach-тэй)

// Текст
button.textContent = "Дахин дар";

// Class
button.classList.add("active");
button.classList.toggle("hidden");
button.classList.contains("active"); // true

// Attribute ба data-*
button.setAttribute("aria-label", "Илгээх");
button.dataset.id = "42";           // <button data-id="42">

// Шинэ элемент үүсгэх
const li = document.createElement("li");
li.textContent = "Шинэ мөр";
document.querySelector("ul").append(li);

// Устгах
li.remove();
```

### ⚠️ `textContent` vs `innerHTML` — Аюулгүй байдал

```javascript
const userInput = '<img src=x onerror="alert(\'hacked\')">';

el.textContent = userInput; // ✅ Текст хэвээр харагдана — аюулгүй
el.innerHTML = userInput;   // ❌ HTML болж parse хийгдэнэ → XSS халдлага!
```

**Дүрэм:** Хэрэглэгчийн оруулсан өгөгдлийг **хэзээ ч** `innerHTML`-ээр бүү оруул. `textContent` эсвэл `createElement` ашигла ([MDN: Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) — "Differences from innerHTML" хэсэг).

---

## 4.3 Events

```javascript
const button = document.querySelector("#myButton");
button.addEventListener("click", (event) => {
  console.log(event.type);           // "click"
  console.log(event.target);         // яг дарагдсан элемент
  console.log(event.currentTarget);  // listener холбогдсон элемент
  document.querySelector("#output").textContent = "Clicked!";
});
```

([MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener))

### Event-ийн 3 үе шат: capturing → target → bubbling

```
         window
           │  ▲
 capture   │  │  bubble
           ▼  │
          body
           │  ▲
           ▼  │
          ul
           │  ▲
           ▼  │
          li  ← target
```

Ихэнх event анхдагчаар **bubbling** үе дээр (доороос дээш) барьдаг. `addEventListener(type, fn, { capture: true })` бол capturing үе дээр ([javascript.info: Bubbling and capturing](https://javascript.info/bubbling-and-capturing)).

- `event.preventDefault()` — browser-ийн анхдагч үйлдлийг зогсооно (form submit → хуудас дахин ачаалах, link-ээр шилжих)
- `event.stopPropagation()` — цааш bubble хийхийг зогсооно (шаардлагагүй бол бүү ашигла)

### Event Delegation ⭐

100 `<li>` бүрт listener холбохын оронд **эцэг элементэд нэг** listener холбоод `event.target`-ээр ялгана ([javascript.info: Event delegation](https://javascript.info/event-delegation)):

```javascript
document.querySelector("#list").addEventListener("click", (event) => {
  const btn = event.target.closest("button.delete");
  if (!btn) return;                        // өөр газар дарсан
  btn.closest("li").remove();
});
```

Давуу тал: санах ой бага, **хожим нэмэгдсэн** элементүүд ч автоматаар ажиллана.

### Form

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault();                   // хуудас дахин ачаалахаас сэргийлнэ
  const data = new FormData(form);
  console.log(data.get("title"));
});
```

---

## 4.4 Өгөгдөл хадгалах: `localStorage`

```javascript
localStorage.setItem("todos", JSON.stringify(todos)); // зөвхөн string хадгална
const saved = JSON.parse(localStorage.getItem("todos") ?? "[]");
```

Browser дотор, тухайн origin-д хадгалагдана; хуудас хаасан ч үлдэнэ. Нууц мэдээлэл (token, нууц үг) **бүү** хадгал ([MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).

---

## 4.5 Жижиг төслүүд (framework ашиглалгүй)

Төсөл бүрийг **GitHub-д тусдаа commit-оор** хийж, README бичээрэй.

### Төсөл 1: To-Do List ⭐ (жишээ шийдэл: [`examples/todo/`](examples/todo/))
**Шаардлага:**
- [ ] Ажил нэмэх (хоосон бол нэмэхгүй)
- [ ] Дууссан гэж тэмдэглэх / буцаах
- [ ] Устгах
- [ ] Шүүлтүүр: Бүгд / Идэвхтэй / Дууссан
- [ ] `localStorage`-д хадгалах (refresh хийхэд алдагдахгүй)
- [ ] Event delegation ашиглах
- [ ] Үлдсэн ажлын тоог харуулах

> 💡 Эхлээд өөрөө хийгээд, дараа нь жишээ шийдэлтэй харьцуул.

### Төсөл 2: Calculator
- [ ] `+ − × ÷`, бутархай тоо, `C` (цэвэрлэх), `⌫` (сүүлийн оронг устгах)
- [ ] Гарын товчлуураар (`keydown` event) ажилладаг
- [ ] 0-д хуваахад алдаа харуулах
- [ ] ⚠️ `eval()` **ашиглахгүй** — өөрөө тооцоолох логик бич
- [ ] Санамж: `0.1 + 0.2 !== 0.3` (IEEE 754) — үр дүнг дугуйлах

### Төсөл 3: Weather App
- [ ] Хотын нэр оруулахад цаг агаар харуулах ([Open-Meteo](https://open-meteo.com/) — API key шаардахгүй, үнэгүй)
- [ ] Ачаалж байх үед "Loading..." харуулах
- [ ] Алдаа (сүлжээ, хот олдоогүй)-г хэрэглэгчид ойлгомжтой харуулах
- [ ] `response.ok` шалгах (Хичээл 2.3)
- [ ] Хайлтын input-д **debounce** хийх (Хичээл 5.3)

### Төсөл 4: Quiz App
- [ ] Асуултуудыг массив/JSON-оос унших
- [ ] Нэг удаад нэг асуулт, хариулт сонгоход зөв/буруу харуулах
- [ ] Оноо, явцын мөр (progress bar)
- [ ] Асуулт бүрт 15 секундын timer (`setInterval` + `clearInterval` — leak бүү үлдээ!)
- [ ] Хамгийн өндөр оноог `localStorage`-д хадгалах

---

## 4.6 Энэ нь React-ийг ойлгоход яаж тусалдаг вэ?

To-Do төслийг хийж байхдаа доорх асуудалтай заавал тулгарна:

> *"Өгөгдөл (state) өөрчлөгдөх бүрт DOM-ийн аль хэсгийг гараар шинэчлэх вэ?"*

Жишээ шийдэлд бид энгийн аргыг хэрэглэсэн: **state өөрчлөгдөх бүрт `render()` функцийг дуудаж, жагсаалтыг бүхэлд нь дахин зурна.**

```javascript
function setState(update) {
  state = { ...state, ...update };
  save();
  render();          // UI = f(state)
}
```

Энэ бол React-ийн гол санаа: **UI = f(state)**. React ч мөн state өөрчлөгдөхөд компонентыг дахин "render" хийдэг. Гэхдээ бодит DOM-ийг бүхэлд нь дахин үүсгэх нь удаан тул React эхлээд шинэ UI-г санах ойд тооцоолж, өмнөхтэйгөө **харьцуулаад (reconciliation)** зөвхөн өөрчлөгдсөн DOM node-уудыг шинэчилдэг ([react.dev: Render and Commit](https://react.dev/learn/render-and-commit)).

Vanilla JS-ээр энэ асуудлыг өөрөө мэдэрсэн хүн framework *яагаад* хэрэгтэйг, юуг шийдэж байгааг гүнзгий ойлгодог.

---

### Эх сурвалж
- MDN — [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [Introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events), [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- javascript.info — [Bubbling and capturing](https://javascript.info/bubbling-and-capturing), [Event delegation](https://javascript.info/event-delegation)
- react.dev — [Render and Commit](https://react.dev/learn/render-and-commit)

## ✅ Өөрийгөө шалгах (Хичээл 4)

- [ ] `defer` яагаад хэрэгтэйг тайлбарлана
- [ ] `textContent` ба `innerHTML`-ийн аюулгүй байдлын ялгааг мэднэ
- [ ] `event.target` ба `event.currentTarget`-ийн ялгааг мэднэ
- [ ] Bubbling, event delegation-ийг жишээгээр харуулна
- [ ] 4 төслийн дор хаяж 3-ыг framework-гүй дуусгасан

⬅️ [Хичээл 3](03-deep-concepts.md) · ➡️ [Хичээл 5. Дадлага ба Interview](05-practice-and-interview.md)
