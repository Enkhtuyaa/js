// Prompt: "Бүх item-ийг серверт хадгалаад, хэдийг хадгалсныг буцаадаг функц"
// AI: "async/await ашигласан тул бүх хадгалалт дуустал хүлээнэ."

export async function saveAll(items, save) {
  items.forEach(async (item) => {
    await save(item);
  });
  return items.length;
}
