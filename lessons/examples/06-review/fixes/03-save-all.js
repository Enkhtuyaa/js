// Засвар: forEach нь callback-ийн Promise-ийг хүлээдэггүй.
// Зэрэг хадгалах бол Promise.all, дараалуулах бол for...of.
// Бонус: save алдаа шидвэл saveAll ч reject болно (forEach дээр unhandled rejection болдог).

export async function saveAll(items, save) {
  await Promise.all(items.map((item) => save(item)));
  return items.length;
}
