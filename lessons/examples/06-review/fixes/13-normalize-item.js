// Засвар: || нь 0, "", false зэрэг БҮХ falsy утгыг солино.
// ?? (nullish coalescing) нь зөвхөн null/undefined-ийг солино.

export function normalizeItem(item) {
  return {
    name: item.name,
    qty: item.qty ?? 1,
    discount: item.discount ?? 0.1,
  };
}
