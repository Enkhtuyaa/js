// Засвар: fetch нь 404/500 дээр reject болдоггүй тул res.ok-ийг шалгана.
// Хэрэглэгчийн оролтыг URL-д оруулахдаа encodeURIComponent хийнэ.

export async function getUser(id, fetchImpl = fetch) {
  const res = await fetchImpl(`https://api.example.com/users/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Хэрэглэгч татаж чадсангүй: HTTP ${res.status}`);
  }
  return res.json();
}
