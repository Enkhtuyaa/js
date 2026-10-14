// Засвар: index-ээр хадгалж дарааллыг хамгаална, хоосон массивыг шууд resolve,
// Promise биш утгыг Promise.resolve-оор боож дэмжинэ.

export function promiseAll(iterable) {
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
