"use strict";
// Хичээл 1-ийн жишээнүүд. Ажиллуулах: node lessons/examples/01-core.js
// Гаралтыг өөрөө таамаглаад, дараа нь ажиллуулж шалгаарай.

// ---------- 1.1 Scope ----------
console.log("\n=== 1.1 Scope ===");
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
  }
  console.log("a =", a); // 1
  console.log("typeof b =", typeof b); // "undefined"
}
demo();

const user = { name: "Bat" };
user.name = "Dorj";
console.log("const объект өөрчлөгдсөн:", user.name);
try {
  eval("const z = 1; z = 2;");
} catch (e) {
  console.log("const дахин оноох:", e.constructor.name, "-", e.message);
}

// ---------- 1.2 Hoisting ----------
console.log("\n=== 1.2 Hoisting ===");
try {
  console.log(hoistedVar); // undefined
  var hoistedVar = 5;
  console.log(hoistedLet);
  let hoistedLet = 10;
} catch (e) {
  console.log(e.constructor.name, "-", e.message);
}

console.log("typeof foo:", typeof foo); // "undefined"
console.log("typeof bar:", typeof bar); // "function"
var foo = function () {};
function bar() {}

// ---------- 1.3 Closures ----------
console.log("\n=== 1.3 Closures ===");
function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const increment = counter();
console.log(increment(), increment()); // 1 2
increment.count = 100; // private count-д нөлөөлөхгүй
console.log("increment.count = 100 хийсний дараа:", increment()); // 3

function createBankAccount(initial = 0) {
  let balance = initial;
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
acc.deposit(50);
acc.balance = 1_000_000;
console.log("Үлдэгдэл:", acc.getBalance()); // 150

// ---------- 1.4 this ----------
console.log("\n=== 1.4 this ===");
const obj = {
  value: 42,
  getRegular() {
    return this.value;
  },
  getArrow: () => this?.value,
};
const { getRegular } = obj;
console.log(obj.getRegular()); // 42
console.log(obj.getArrow()); // undefined
console.log(getRegular.call({ value: 7 })); // 7
try {
  getRegular();
} catch (e) {
  console.log("Салгасан method:", e.constructor.name, "-", e.message);
}

// ---------- 1.5 Prototype ----------
console.log("\n=== 1.5 Prototype ===");
const animal = {
  eats: true,
  walk() {
    return `${this.name} алхаж байна`;
  },
};
const rabbit = Object.create(animal);
rabbit.name = "Туулай";
console.log(rabbit.eats, rabbit.walk(), Object.hasOwn(rabbit, "eats"));

class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} дуугарлаа`;
  }
}
class Dog extends Animal {
  speak() {
    return `${super.speak()}: Хав хав!`;
  }
}
const d = new Dog("Хасар");
console.log(d.speak(), typeof Animal, Object.hasOwn(d, "speak"));

// Гинжийг null хүртэл хэвлэх
let p = Object.getPrototypeOf(d);
const chain = ["d"];
while (p) {
  chain.push(`${p.constructor.name}.prototype`);
  p = Object.getPrototypeOf(p);
}
console.log("Гинж:", chain.join(" → "), "→ null");

// ---------- 1.6 Event loop ----------
// Бусад жишээний гаралттай холилдохгүйн тулд дарааллаар нь ажиллуулна.
function example1() {
  return new Promise((done) => {
    console.log("\n=== 1.6 Жишээ 1 ===");
    console.log("1");
    setTimeout(() => {
      console.log("2");
      done();
    }, 0);
    Promise.resolve().then(() => console.log("3"));
    console.log("4");
  });
}

function example2() {
  return new Promise((done) => {
    console.log("\n=== 1.6 Жишээ 2 ===");
    async function a() {
      console.log("A1");
      await null;
      console.log("A2");
    }
    console.log("start");
    setTimeout(() => {
      console.log("timeout");
      done();
    }, 0);
    a();
    Promise.resolve().then(() => console.log("then"));
    console.log("end");
  });
}

function exercise() {
  return new Promise((done) => {
    console.log("\n=== 1.6 Дасгал (хүлээгдэж буй: A H D G F B C E) ===");
    console.log("A");
    setTimeout(() => {
      console.log("B");
      Promise.resolve().then(() => console.log("C"));
    }, 0);
    Promise.resolve()
      .then(() => {
        console.log("D");
        setTimeout(() => {
          console.log("E");
          done();
        }, 0);
      })
      .then(() => console.log("F"));
    queueMicrotask(() => console.log("G"));
    console.log("H");
  });
}

// var vs let давталт
function loops() {
  return new Promise((done) => {
    console.log("\n=== 1.3 var vs let давталт ===");
    for (var i = 0; i < 3; i++) setTimeout(() => console.log("var:", i), 0);
    for (let j = 0; j < 3; j++) setTimeout(() => console.log("let:", j), 0);
    setTimeout(done, 0);
  });
}

loops().then(example1).then(example2).then(exercise);
