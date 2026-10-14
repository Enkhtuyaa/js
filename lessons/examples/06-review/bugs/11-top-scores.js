// Prompt: "Хамгийн өндөр n оноог буурахаар буцаа"
// AI: "Built-in sort ашигласан хамгийн хялбар шийдэл."

export function topScores(scores, n = 3) {
  return scores.sort().reverse().slice(0, n);
}
