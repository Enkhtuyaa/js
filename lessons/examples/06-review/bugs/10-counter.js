// Prompt: "Тоонуудыг нэмж хадгалдаг Counter class"
// AI: "forEach-д method-ийг шууд дамжуулсан тул код товч."

export class Counter {
  constructor() {
    this.total = 0;
  }

  add(n) {
    this.total += n;
  }

  addAll(numbers) {
    numbers.forEach(this.add);
    return this.total;
  }
}
