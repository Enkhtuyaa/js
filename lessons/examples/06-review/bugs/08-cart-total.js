// Prompt: "Сагсны нийт үнийг (доллараар) тооцоол"
// AI: "reduce ашигласан богино, зөв шийдэл."

export function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
