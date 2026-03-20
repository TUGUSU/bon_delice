/** neg restaurantii <div class="item"> card hiine 
 * @param {import("./restaurant.js").Restaurant} restaurant
 * @returns {HTMLElement}
 */
export function buildItemNode(restaurant) { // neg restaurant object oos neg res card DOM elementvvsgene
  const item = document.createElement("div");
  item.className = "item";
  item.id = restaurant.category; // omnoh anchor behavior iig hadgalah category id vvsgeh

  /* restaurant card iin thumbnail zurag vvsgeh*/
  const img = document.createElement("img");
  img.className = "thumb";
  img.src       = restaurant.image;
  img.alt       = restaurant.imageAlt;
  img.width     = 160;
  img.height    = 110;

  /* meta block ni restaurant card iin texten medeelliig aguulj baigaa container  */
  const meta = document.createElement("div");
  meta.className = "meta";

  const h4 = document.createElement("h4");
  h4.textContent = restaurant.name;

  const rate = document.createElement("p");
  rate.className = "rate";
  rate.innerHTML =
    `<span class="n">${restaurant.rating.toFixed(1)}</span> ` +
    `<span class="stars">${restaurant.starString}</span> ` +
    `<span class="c">(${restaurant.reviewCount})</span>`;

  const tag = document.createElement("p");
  tag.className = "tag";
  tag.textContent = restaurant.tagLine;

  const badge = document.createElement("p");
  badge.className = "tag";
  badge.innerHTML =
    `зай: ${restaurant.distance} км | ` +
    `<span style="color:${restaurant.isOpen ? "var(--brand)" : "var(--muted)"}">` +
    `${restaurant.isOpen ? "нээлттэй" : "хаалттай"}</span>`;

  meta.append(h4, rate, tag, badge);
  item.append(img, meta);
  return item;
}

/**
 * restaurant iin jagsaaltiig ogogdson container element bolgon haruulah
 * ehleed containeriig tseverlesnii daraa restaurant bvrt neg node vvvsgeh
 * listing hooson vyd hooson vyiin message iig haruulah
 * @param {HTMLElement}  container
 * @param {import("./restaurant.js").Restaurant[]} restaurants
 */
export function renderList(container, restaurants) {
  container.innerHTML = "";

  if (restaurants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Ресторан олдсонгүй.";
    container.appendChild(empty);
    return;
  }

  restaurants.forEach(r => container.appendChild(buildItemNode(r)));
}
