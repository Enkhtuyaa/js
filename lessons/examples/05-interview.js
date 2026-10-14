// Хичээл 5: debounce / throttle. Ажиллуулах: node lessons/examples/05-interview.js

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

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

// "Гүнзгийрүүлэх" дасгалын хариу: leading + trailing throttle
function throttleTrailing(fn, ms) {
  let last = 0;
  let timer = null;
  let pendingArgs = null;
  let pendingThis = null;

  return function (...args) {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      last = now;
      fn.apply(this, args);
    } else {
      pendingArgs = args; // хамгийн сүүлийн дуудлагыг санана
      pendingThis = this;
      timer ??= setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(pendingThis, pendingArgs);
      }, remaining);
    }
  };
}

// 0ms-ээс 50ms зайтай 10 удаа (0..450ms) "event" үүсгэнэ
function simulate(label, wrapped) {
  return new Promise((done) => {
    const start = Date.now();
    const calls = [];
    const handler = wrapped((i) => calls.push(`${i}@${Math.round((Date.now() - start) / 50) * 50}ms`));
    for (let i = 0; i < 10; i++) setTimeout(() => handler(i), i * 50);
    setTimeout(() => {
      console.log(label.padEnd(23), calls.join(", "));
      done();
    }, 1000);
  });
}

(async () => {
  console.log("10 event, 50ms зайтай (0–450ms):");
  await simulate("debounce(200):", (f) => debounce(f, 200));
  await simulate("throttle(200):", (f) => throttle(f, 200));
  await simulate("throttleTrailing(200):", (f) => throttleTrailing(f, 200));
})();
