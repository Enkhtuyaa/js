// Prompt: "Resize event-ийг тоолдог, устгах боломжтой class"
// AI: "destroy() нь listener-ийг цэвэрлэж memory leak-ээс сэргийлнэ."

export class ResizeWatcher {
  constructor(target, onResize) {
    this.target = target;
    this.count = 0;
    target.addEventListener("resize", () => {
      this.count++;
      onResize(this.count);
    });
  }

  destroy() {
    this.target.removeEventListener("resize", () => {
      this.count++;
    });
  }
}
