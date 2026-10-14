// Засвар: initialValue өгсөн эсэхийг arguments.length-ээр шалгана.
// (initialValue === undefined гэж шалгавал reduce(fn, undefined)-ийг ялгахгүй.)

export function reduce(arr, callback, initialValue) {
  let i = 0;
  let acc;
  if (arguments.length >= 3) {
    acc = initialValue;
  } else {
    if (arr.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = arr[0];
    i = 1;
  }
  for (; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }
  return acc;
}
