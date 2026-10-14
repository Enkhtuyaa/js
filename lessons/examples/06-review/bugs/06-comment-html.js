// Prompt: "Сэтгэгдлийг жагсаалтад харуулах HTML үүсгэдэг функц"
// AI: "Template literal ашигласан цэвэр шийдэл. Үр дүнг list.innerHTML-д оноогоорой."

export function commentHTML(comment) {
  return `<li class="comment"><b>${comment.author}</b>: ${comment.text}</li>`;
}
