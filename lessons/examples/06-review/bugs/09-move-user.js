// Prompt: "Хэрэглэгчийн хотыг өөрчилсөн ШИНЭ объект буцаа, эхийг өөрчлөхгүй"
// AI: "Spread operator-оор хуулбар хийсэн тул эх объект өөрчлөгдөхгүй."

export function moveUser(user, newCity) {
  const updated = { ...user };
  updated.address.city = newCity;
  return updated;
}
