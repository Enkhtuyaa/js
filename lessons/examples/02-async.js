// Хичээл 2-ийн жишээнүүд. Ажиллуулах: node lessons/examples/02-async.js
// Node.js 18+ шаардлагатай (fetch, AbortSignal.timeout).

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (msg, ms) =>
  new Promise((_, j) => setTimeout(() => j(new Error(msg)), ms));

// ---------- 2.1 Callback → Promise ----------
function getUserCb(id, callback) {
  setTimeout(() => {
    if (id <= 0) return callback(new Error("Буруу id"));
    callback(null, { id, name: "Bat" });
  }, 50);
}

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
const getUser = promisify(getUserCb);

// ---------- 2.2 Combinators ----------
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);

    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}

// ---------- 2.3 Fetch ----------
async function fetchWithRetry(url, retries = 3, delay = 500) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(delay * 2 ** attempt);
    }
  }
}

const settle = (p) => p.then((v) => v, (e) => `❌ ${e.message}`);

async function main() {
  console.log("=== 2.1 ===");
  console.log("promisify:", await getUser(1));
  try {
    await getUser(0);
  } catch (e) {
    console.log("catch:", e.message);
  }

  async function f() {
    return 1;
  }
  console.log("async функц буцаадаг:", f() instanceof Promise);

  let t = Date.now();
  await ok("a", 100);
  await ok("b", 100);
  console.log(`Дараалсан: ~${Date.now() - t}ms`);
  t = Date.now();
  await Promise.all([ok("a", 100), ok("b", 100)]);
  console.log(`Зэрэгцээ:  ~${Date.now() - t}ms`);

  console.log("\n=== 2.2 ===");
  console.log("all:", await settle(Promise.all([ok("a", 100), ok("b", 50)])));
  console.log("all (алдаатай):", await settle(Promise.all([ok("a", 100), fail("x", 50)])));
  const settled = await Promise.allSettled([ok("a", 100), fail("x", 50)]);
  console.log("allSettled:", settled.map((r) => (r.status === "fulfilled" ? r : { ...r, reason: r.reason.message })));
  console.log("race:", await settle(Promise.race([ok("a", 100), fail("x", 50)])));
  console.log("any:", await settle(Promise.any([ok("a", 100), fail("x", 50)])));
  console.log("any (бүгд алдаа):", await Promise.any([fail("x", 10), fail("y", 20)]).catch((e) => e.constructor.name));
  console.log("withTimeout:", await settle(withTimeout(ok("хурдан", 50), 200)), "/", await settle(withTimeout(ok("удаан", 300), 100)));
  console.log("myPromiseAll:", await myPromiseAll([ok(1, 60), 2, ok(3, 10)]), await myPromiseAll([]));
  console.log("myPromiseAll (алдаа):", await settle(myPromiseAll([ok(1, 60), fail("z", 10)])));

  console.log("\n=== 2.3 Fetch (интернэт шаардлагатай) ===");
  try {
    const users = await fetchWithRetry("https://jsonplaceholder.typicode.com/users", 1);
    console.log(users.slice(0, 3).map(({ name, email }) => ({ name, email })));
    const res = await fetch("https://jsonplaceholder.typicode.com/users/999999");
    console.log("Байхгүй хэрэглэгч → ok:", res.ok, "status:", res.status, "(reject болоогүй!)");
  } catch (e) {
    console.log("Сүлжээнд холбогдож чадсангүй:", e.message);
  }
}

main();
