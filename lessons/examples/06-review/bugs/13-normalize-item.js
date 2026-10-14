// Prompt: "Захиалгын мөрийг цэгцэл: qty өгөөгүй бол 1, discount өгөөгүй бол 0.1 (10% хөнгөлөлт)"
// AI: "|| ашиглан анхдагч утга оноосон."

export function normalizeItem(item) {
  return {
    name: item.name,
    qty: item.qty || 1,
    discount: item.discount || 0.1,
  };
}
