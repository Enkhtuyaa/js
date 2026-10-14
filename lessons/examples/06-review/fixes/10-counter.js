// Засвар: this.add-ийг callback болгож дамжуулахад this алдагдана
// (class бие strict mode тул this === undefined болно). Arrow-оор боох эсвэл bind.

export class Counter {
  constructor() {
    this.total = 0;
  }

  add(n) {
    this.total += n;
  }

  addAll(numbers) {
    numbers.forEach((n) => this.add(n));
    return this.total;
  }
}
