// Ажиллуулах: node lessons/examples/modules/main.cjs
const { count, inc } = require("./counter.cjs");

console.log("CJS өмнө:", count); // 0
inc();
console.log("CJS дараа:", count); // 0 — хуулбар учир өөрчлөгдөхгүй
