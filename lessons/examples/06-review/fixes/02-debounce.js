// Засвар: аргумент болон this-ийг дамжуулна.
// Arrow function өөрийн this-гүй тул буцаах функцийг энгийн function болгосон.

export function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
