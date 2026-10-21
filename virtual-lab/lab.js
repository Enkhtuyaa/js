// Виртуал химийн лаборатори — энгийн HTML/CSS/JS
// Бүх хүчил, шүлт, давсны концентраци 0.1 моль/л гэж тооцно.

const CONC = 0.1; // моль/л
const MAX_VOLUME = 250; // мл — колбоны багтаамж

const REAGENTS = [
  { id: "hcl", name: "HCl", desc: "Давсны хүчил", color: "#f1f5f9" },
  { id: "naoh", name: "NaOH", desc: "Натрийн гидроксид", color: "#f8fafc" },
  { id: "water", name: "H₂O", desc: "Нэрмэл ус", color: "#dbeafe" },
  { id: "cuso4", name: "CuSO₄", desc: "Зэсийн сульфат", color: "#2b8fd6" },
  { id: "na2co3", name: "Na₂CO₃", desc: "Натрийн карбонат", color: "#f8fafc" },
  { id: "phenol", name: "Фенолфталейн", desc: "Индикатор", color: "#fdf4ff", indicator: true },
  { id: "methyl", name: "Метил улбар шар", desc: "Индикатор", color: "#f97316", indicator: true },
  { id: "universal", name: "Универсал", desc: "Индикатор", color: "#16a34a", indicator: true },
];

const beakers = [1, 2, 3].map((n) => newBeaker(n));
let active = 0;
let amount = 10;

function newBeaker(n) {
  return {
    name: `Колбо ${n}`,
    volume: 0, // мл
    nH: 0, // H⁺ илүүдэл, моль
    nOH: 0, // OH⁻ илүүдэл, моль
    nCu: 0, // Cu²⁺, моль
    nCO3: 0, // CO₃²⁻, моль
    cuOH2: 0, // Cu(OH)₂ тунадас, моль
    cuO: 0, // CuO (хар), моль
    indicator: null,
    temp: 20,
    heating: false,
  };
}

// ---------- Химийн тооцоо ----------

function pH(b) {
  if (b.volume === 0) return null;
  const V = b.volume / 1000;
  if (b.nH > 1e-9) return clamp(-Math.log10(b.nH / V), 0, 14);
  if (b.nOH > 1e-9) return clamp(14 + Math.log10(b.nOH / V), 0, 14);
  if (b.nCO3 > 1e-9) {
    // Сул суурь: [OH⁻] ≈ √(Kb·C), Kb(CO₃²⁻) ≈ 2.1·10⁻⁴
    const oh = Math.sqrt(2.1e-4 * (b.nCO3 / V));
    return 14 + Math.log10(oh);
  }
  if (b.nCu > 1e-9) return 4.5; // Cu²⁺ уусмал бага зэрэг хүчиллэг
  return 7;
}

function react(b) {
  const events = [];

  // 1. Саармагжих урвал: H⁺ + OH⁻ → H₂O
  const n = Math.min(b.nH, b.nOH);
  if (n > 1e-9) {
    b.nH -= n;
    b.nOH -= n;
    b.temp += (n * 57000) / (b.volume * 4.18); // ΔH ≈ −57 кЖ/моль
    events.push("Саармагжих урвал явагдлаа: H⁺ + OH⁻ → H₂O (уусмал бага зэрэг дулаарав)");
  }

  // 2. Карбонат + хүчил: CO₃²⁻ + 2H⁺ → H₂O + CO₂↑
  const c = Math.min(b.nCO3, b.nH / 2);
  if (c > 1e-9) {
    b.nCO3 -= c;
    b.nH -= 2 * c;
    bubbles(b, 25);
    events.push("Хий ялгарлаа! Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑");
  }

  // 3. Зэсийн гидроксидын тунадас: Cu²⁺ + 2OH⁻ → Cu(OH)₂↓
  const p = Math.min(b.nCu, b.nOH / 2);
  if (p > 1e-9) {
    b.nCu -= p;
    b.nOH -= 2 * p;
    b.cuOH2 += p;
    precipitate(b, "#3b82f6", 30);
    events.push("Цэнхэр тунадас үүслээ: CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄");
  }

  // 4. Хүчилд тунадас уусна: Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O
  const d = Math.min(b.cuOH2, b.nH / 2);
  if (d > 1e-9) {
    b.cuOH2 -= d;
    b.nH -= 2 * d;
    b.nCu += d;
    clearPrecipitate(b);
    events.push("Тунадас хүчилд уусав: Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O");
  }

  return events;
}

// ---------- Өнгө ----------

const UNIVERSAL_STOPS = [
  [0, "#e11d48"], [3, "#f97316"], [5, "#facc15"], [7, "#22c55e"],
  [9, "#14b8a6"], [11, "#3b82f6"], [14, "#6d28d9"],
];

function interpolate(stops, x) {
  for (let i = 1; i < stops.length; i++) {
    if (x <= stops[i][0]) {
      const [x0, c0] = stops[i - 1];
      const [x1, c1] = stops[i];
      return mix(c0, c1, (x - x0) / (x1 - x0));
    }
  }
  return stops[stops.length - 1][1];
}

function liquidColor(b) {
  const ph = pH(b);
  let color = "rgba(186, 218, 245, 0.55)"; // цэвэр ус
  if (b.nCu > 1e-9) color = "rgba(43, 143, 214, 0.75)";

  switch (b.indicator) {
    case "phenol":
      if (ph >= 8.2) color = ph > 10 ? "rgba(219, 39, 119, 0.85)" : "rgba(244, 114, 182, 0.7)";
      break;
    case "methyl":
      color = ph < 3.1 ? "rgba(220, 38, 38, 0.8)" : ph < 4.4 ? "rgba(249, 115, 22, 0.8)" : "rgba(250, 204, 21, 0.8)";
      break;
    case "universal":
      color = interpolate(UNIVERSAL_STOPS, ph) + "cc";
      break;
  }
  if (b.cuO > 1e-9) color = "rgba(40, 40, 40, 0.8)";
  else if (b.cuOH2 > 1e-9 && !b.indicator) color = "rgba(96, 165, 250, 0.8)";
  return color;
}

// ---------- Үйлдлүүд ----------

function pour(reagentId, index = active) {
  const b = beakers[index];
  const r = REAGENTS.find((x) => x.id === reagentId);
  const add = r.indicator ? 2 : amount; // индикаторыг дусал болгон нэмнэ
  if (b.volume + add > MAX_VOLUME) {
    log(`${b.name} дүүрсэн байна! Эхлээд асгана уу.`);
    return;
  }
  const mol = (add / 1000) * CONC;
  b.volume += add;

  switch (r.id) {
    case "hcl": b.nH += mol; break;
    case "naoh": b.nOH += mol; break;
    case "cuso4": b.nCu += mol; break;
    case "na2co3": b.nCO3 += mol; break;
    case "phenol":
    case "methyl":
    case "universal": b.indicator = r.id; break;
  }

  // Шинэ шингэн нэмэгдэхэд температур холилдоно
  b.temp = (b.temp * (b.volume - add) + 20 * add) / b.volume;

  animatePour(index, r.color);
  log(`${b.name}: ${add} мл ${r.name} нэмэв.`);
  setTimeout(() => {
    reaction(index);
  }, 450);
}

function reaction(index) {
  const b = beakers[index];
  const before = pH(b);
  react(b).forEach((e) => log(`${b.name}: ${e}`));
  const after = pH(b);
  if (b.indicator && before !== null && medium(before) !== medium(after)) {
    log(`${b.name}: Индикаторын өнгө өөрчлөгдлөө — орчин ${medium(after)} боллоо.`);
  }
  render();
}

function heatTick() {
  beakers.forEach((b, i) => {
    if (b.heating && b.volume > 0) {
      b.temp = Math.min(100, b.temp + 2);
      if (b.temp >= 100) {
        // Буцалж ууршина — концентраци ихсэнэ
        b.volume = Math.max(0, b.volume - 0.5);
        bubbles(b, 3, i);
        if (b.volume === 0) {
          log(`${b.name}: Шингэн бүрэн уурших дээ тулав.`);
          b.heating = false;
          clearPrecipitate(b);
          Object.assign(b, newBeaker(i + 1), { el: b.el });
        }
      }
      // Cu(OH)₂ → CuO + H₂O (халаахад хар өнгөтэй болно)
      if (b.temp > 80 && b.cuOH2 > 1e-9) {
        b.cuO += b.cuOH2;
        b.cuOH2 = 0;
        clearPrecipitate(b);
        precipitate(b, "#111827", 30, i);
        log(`${b.name}: Халаахад тунадас харласан: Cu(OH)₂ → CuO + H₂O`);
      }
    } else if (b.temp > 20) {
      b.temp = Math.max(20, b.temp - 0.3); // аажмаар хөрнө
    }
  });
  render();
}
setInterval(heatTick, 500);

// ---------- Дүрслэл ----------

const $ = (s) => document.querySelector(s);

function buildUI() {
  const shelf = $("#reagents");
  REAGENTS.forEach((r) => {
    const el = document.createElement("button");
    el.className = "reagent";
    el.draggable = true;
    el.innerHTML = `<span class="bottle" style="background:${r.color}"></span>
      <span>${r.name}<small>${r.desc}${r.indicator ? " (2 мл)" : r.id === "water" ? "" : ` · ${CONC} M`}</small></span>`;
    el.addEventListener("click", () => pour(r.id));
    el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", r.id));
    shelf.appendChild(el);
  });

  const bench = $("#beakers");
  beakers.forEach((b, i) => {
    const st = document.createElement("div");
    st.className = "station";
    st.innerHTML = `
      <div class="beaker"><div class="liquid"><div class="surface"></div></div><div class="marks"></div></div>
      <div class="burner"><div class="flame"></div></div>
      <div class="station-label">${b.name}</div>`;
    const beaker = st.querySelector(".beaker");
    beaker.addEventListener("click", () => { active = i; render(); });
    beaker.addEventListener("dragover", (e) => { e.preventDefault(); beaker.classList.add("drop"); });
    beaker.addEventListener("dragleave", () => beaker.classList.remove("drop"));
    beaker.addEventListener("drop", (e) => {
      e.preventDefault();
      beaker.classList.remove("drop");
      active = i;
      pour(e.dataTransfer.getData("text/plain"), i);
    });
    bench.appendChild(st);
    b.el = st;
  });

  $("#amount").addEventListener("input", (e) => {
    amount = Number(e.target.value);
    $("#amountLabel").textContent = `${amount} мл`;
  });
  $("#heatBtn").addEventListener("click", () => {
    const b = beakers[active];
    if (b.volume === 0) return log(`${b.name} хоосон байна.`);
    b.heating = !b.heating;
    log(`${b.name}: ${b.heating ? "Халааж эхлэв." : "Халаалтыг унтраав."}`);
    render();
  });
  $("#stirBtn").addEventListener("click", () => {
    const b = beakers[active];
    const liquid = b.el.querySelector(".liquid");
    liquid.animate(
      [{ transform: "skewX(0)" }, { transform: "skewX(6deg)" }, { transform: "skewX(-6deg)" }, { transform: "skewX(0)" }],
      { duration: 600 }
    );
    log(`${b.name}: Хутгав.`);
  });
  $("#emptyBtn").addEventListener("click", () => {
    const b = beakers[active];
    clearPrecipitate(b);
    Object.assign(b, newBeaker(active + 1), { el: b.el });
    log(`${b.name}: Асгаж, угаав.`);
    render();
  });
  $("#resetBtn").addEventListener("click", () => {
    beakers.forEach((b, i) => {
      clearPrecipitate(b);
      Object.assign(b, newBeaker(i + 1), { el: b.el });
    });
    $("#log").innerHTML = "";
    active = 0;
    render();
  });
}

function render() {
  beakers.forEach((b, i) => {
    const liquid = b.el.querySelector(".liquid");
    liquid.style.height = `${(b.volume / MAX_VOLUME) * 100}%`;
    liquid.style.backgroundColor = liquidColor(b);
    b.el.classList.toggle("active", i === active);
    b.el.classList.toggle("hot", b.heating);
  });

  const b = beakers[active];
  const ph = pH(b);
  $("#ph").textContent = ph === null ? "–" : ph.toFixed(2);
  $("#vol").textContent = b.volume.toFixed(0);
  $("#temp").textContent = b.temp.toFixed(1);
  $("#medium").textContent = ph === null ? "–" : medium(ph);
  const marker = $("#phMarker");
  marker.style.display = ph === null ? "none" : "block";
  if (ph !== null) marker.style.left = `calc(${(ph / 14) * 100}% - 2px)`;
  $("#heatBtn").classList.toggle("on", b.heating);
}

function animatePour(index, color) {
  const s = document.createElement("div");
  s.className = "stream";
  s.style.background = color;
  beakers[index].el.appendChild(s);
  setTimeout(() => s.remove(), 800);
}

function bubbles(b, count, index = beakers.indexOf(b)) {
  const beaker = beakers[index].el?.querySelector(".beaker");
  if (!beaker) return;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "bubble";
      el.style.left = `${10 + Math.random() * 80}%`;
      beaker.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }, Math.random() * 1200);
  }
}

function precipitate(b, color, count, index = beakers.indexOf(b)) {
  const beaker = beakers[index].el?.querySelector(".beaker");
  if (!beaker) return;
  const top = 150 - (b.volume / MAX_VOLUME) * 150;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "precip";
    el.style.background = color;
    el.style.left = `${5 + Math.random() * 90}%`;
    el.style.top = `${top + 4}px`;
    el.style.setProperty("--drop", `${150 - top - 10 - Math.random() * 8}px`);
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    beaker.appendChild(el);
  }
}

function clearPrecipitate(b) {
  b.el?.querySelectorAll(".precip").forEach((el) => el.remove());
}

function log(text) {
  const li = document.createElement("li");
  li.textContent = text;
  $("#log").prepend(li);
}

// ---------- Туслах функцууд ----------

function medium(ph) {
  if (ph < 6.5) return "хүчиллэг";
  if (ph > 7.5) return "шүлтлэг";
  return "саармаг";
}

function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

function mix(c0, c1, t) {
  const a = hex(c0), b = hex(c1);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

function hex(c) {
  return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
}

buildUI();
render();
log("Тавтай морил! Урвалж дээр дарж идэвхтэй колбо руу хийнэ үү, эсвэл чирж оруулна уу.");
