// Засвар: хариунууд илгээсэн дарааллаараа ирэх баталгаагүй.
// Хамгийн сүүлийн хүсэлтийн хариуг л render хийнэ.
// Бодит fetch-тэй бол AbortController-оор хуучин хүсэлтийг цуцлах нь бүр илүү.

export function createSearch(fetchResults, render) {
  let latest = 0;
  return async function search(query) {
    const id = ++latest;
    const results = await fetchResults(query);
    if (id === latest) render(results);
  };
}
