// Засвар: HTML string угсрах бол хэрэглэгчийн өгөгдлийг заавал escape хийнэ.
// DOM дээр ажиллаж байгаа бол createElement + textContent ашиглах нь илүү аюулгүй.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

export function commentHTML(comment) {
  return `<li class="comment"><b>${escapeHTML(comment.author)}</b>: ${escapeHTML(comment.text)}</li>`;
}
