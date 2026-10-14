// Prompt: "Promise.all-ийг өөрөө хэрэгжүүл (interview)"
// AI: "Бүх promise resolve болоход үр дүнг буцаана."

export function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    promises.forEach((p) => {
      p.then((value) => {
        results.push(value);
        if (results.length === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
