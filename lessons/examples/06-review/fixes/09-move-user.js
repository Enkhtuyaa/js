// Засвар: spread нь зөвхөн нэг түвшний (shallow) хуулбар хийнэ.
// Өөрчлөх nested объектыг ч бас шинээр үүсгэнэ.

export function moveUser(user, newCity) {
  return {
    ...user,
    address: { ...user.address, city: newCity },
  };
}
