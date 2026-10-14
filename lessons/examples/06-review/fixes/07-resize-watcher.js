// Засвар: removeEventListener-д addEventListener-д өгсөн ЯГ ТЭР функцийг өгөх ёстой.
// Шинэ arrow function бол өөр объект тул юу ч устгахгүй.
// AbortController нь олон listener-ийг нэг дор цэвэрлэх орчин үеийн арга.

export class ResizeWatcher {
  #controller = new AbortController();

  constructor(target, onResize) {
    this.count = 0;
    target.addEventListener(
      "resize",
      () => {
        this.count++;
        onResize(this.count);
      },
      { signal: this.#controller.signal }
    );
  }

  destroy() {
    this.#controller.abort();
  }
}
