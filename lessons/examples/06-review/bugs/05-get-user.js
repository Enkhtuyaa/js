// Prompt: "id-аар хэрэглэгчийн мэдээлэл татдаг функц"
// AI: "fetch ашигласан, алдааг дуудсан тал try/catch-аар барина."

export async function getUser(id, fetchImpl = fetch) {
  const res = await fetchImpl(`https://api.example.com/users/${id}`);
  return res.json();
}
