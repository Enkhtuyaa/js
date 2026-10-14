// Засвар: мөнгийг бутархай тоогоор (IEEE 754 double) тооцохгүй, бүхэл центээр тооцно.
// 0.1 + 0.2 === 0.30000000000000004

export function cartTotal(items) {
  const cents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0);
  return cents / 100;
}
