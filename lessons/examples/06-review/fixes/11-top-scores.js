// Засвар: sort() анхдагчаар string болгож харьцуулдаг ("100" < "20" < "5").
// Харьцуулах функц өгнө. sort() нь эх массивыг өөрчилдөг тул хуулбар дээр эрэмбэлнэ.

export function topScores(scores, n = 3) {
  return [...scores].sort((a, b) => b - a).slice(0, n);
}
