// Prompt: "Хайлтын input-д зориулж debounce функц бич"
// AI: "Энгийн бөгөөд найдвартай debounce."

export function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), ms);
  };
}
