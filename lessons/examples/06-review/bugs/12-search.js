// Prompt: "Хэрэглэгч бичих бүрт серверээс хайж, үр дүнг харуулдаг функц"
// AI: "async/await-ээр үр дүн ирмэгц render хийнэ."

export function createSearch(fetchResults, render) {
  return async function search(query) {
    const results = await fetchResults(query);
    render(results);
  };
}
