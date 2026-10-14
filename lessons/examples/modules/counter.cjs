// CommonJS: module.exports нь export хийх үеийн утгыг хуулна
let count = 0;
function inc() {
  count++;
}
module.exports = { count, inc };
