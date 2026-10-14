// To-Do — Хичээл 4-ийн жишээ шийдэл (framework-гүй).
// Гол санаа: UI = f(state). State өөрчлөгдөх бүрт render() дуудна.

const STORAGE_KEY = "lesson4-todos";

const form = document.querySelector("#new-todo");
const list = document.querySelector("#list");
const count = document.querySelector("#count");
const filters = document.querySelector(".filters");

let state = {
  todos: load(),
  filter: "all", // "all" | "active" | "done"
};

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return []; // гэмтсэн өгөгдөл эсвэл localStorage хаалттай
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  } catch {
    // private mode гэх мэт — хадгалж чадахгүй ч апп ажилласаар байна
  }
}

function setState(update) {
  state = { ...state, ...update };
  save();
  render();
}

function visibleTodos() {
  if (state.filter === "active") return state.todos.filter((t) => !t.done);
  if (state.filter === "done") return state.todos.filter((t) => t.done);
  return state.todos;
}

function render() {
  list.replaceChildren(
    ...visibleTodos().map((todo) => {
      const li = document.createElement("li");
      li.dataset.id = todo.id;
      li.classList.toggle("done", todo.done);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.className = "toggle";

      const title = document.createElement("span");
      title.textContent = todo.title; // innerHTML биш — XSS-ээс хамгаална

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "✕";
      del.setAttribute("aria-label", `"${todo.title}" устгах`);

      li.append(checkbox, title, del);
      return li;
    })
  );

  const remaining = state.todos.filter((t) => !t.done).length;
  count.textContent = `${remaining} ажил үлдсэн`;

  for (const btn of filters.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.filter === state.filter);
  }
}

// ---------- Events ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.elements.title;
  const title = input.value.trim();
  if (!title) return;

  setState({
    todos: [...state.todos, { id: crypto.randomUUID(), title, done: false }],
  });
  input.value = "";
  input.focus();
});

// Event delegation: бүх мөрөнд нэг listener
list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (event.target.matches(".delete")) {
    setState({ todos: state.todos.filter((t) => t.id !== id) });
  } else if (event.target.matches(".toggle")) {
    setState({
      todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }
});

filters.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter]");
  if (btn) setState({ filter: btn.dataset.filter });
});

render();
