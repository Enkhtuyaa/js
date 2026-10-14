// Ажиллуулах: node lessons/examples/modules/main.mjs
import { count, inc } from "./counter.mjs";

console.log("ESM өмнө:", count); // 0
inc();
console.log("ESM дараа:", count); // 1 — эх модулийн өөрчлөлт харагдана
