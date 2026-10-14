// Тестүүд анхдагчаар bugs/ доторх кодыг шалгана.
// Засварласан хариуг шалгах: npm run test:fixes  (эсвэл TARGET=fixes node --test)
export const target = process.env.TARGET === "fixes" ? "fixes" : "bugs";
export const load = (file) => import(`../${target}/${file}`);
