// Prompt: "Array.prototype.reduce-ийг өөрөө бичээд өг"
// AI: "Энэ бол reduce-ийн бүрэн ажилладаг хувилбар."

export function reduce(arr, callback, initialValue) {
  let acc = initialValue;
  for (let i = 0; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }
  return acc;
}
