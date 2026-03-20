import { getRestaurants } from "./store.js";
import { renderList } from "./renderer.js"; /**render hiisnii dara DOM deer haruulah */

/* DOM references */
const popularList  = document.querySelector("#popular .list");
const newList      = document.querySelector("#new .list");
const filterForm   = document.querySelector("#screen-b .filter form");
const searchInput  = document.querySelector("#q-search");
const searchForm   = document.querySelector(".search");

/** Filter form-ийн одоогийн утгуудыг уншаад нэг object болгоно.
 * @returns {Object}
 */
function readFilterFormValues() {
  const data = new FormData(filterForm);
  return {
    distance:  parseFloat(data.get("distance")) || Infinity,
    minRating: parseFloat(data.get("minrating")) || 0,
    open:      data.get("open") || "any",
    category:  "",      // category нь chip click эсвэл URL-аас ирнэ
    query:     "",      // query iin utga search input ees irne
  };
}

/**
 * URL дээрх query string-ээс filter state unshina
 * category, open, minrating, distance hesgvvdig support hiine
 * @returns {Object}
 */
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    distance:  parseFloat(params.get("distance")) || Infinity,
    minRating: parseFloat(params.get("minrating")) || 0,
    open:      params.get("open")     || "any",
    category:  params.get("category") || "",
    query:     params.get("q")        || "",
  };
}

/**
 * Filter object dotr baiga utgudigform deer butsaaj haruulah
 *Энэ функц нь URL-аас уншсан filter state-ийг UI form дээр sync hiisneer application state болон visual state zorohgvi
 * @param {Object} filters
 */
function syncFormToFilters(filters) {
  if (filters.distance  !== Infinity) filterForm.distance.value  = filters.distance;
  if (filters.minRating !== 0)        filterForm.minrating.value = filters.minRating;
  if (filters.open      !== "any")    filterForm.open.value      = filters.open;
  if (filters.query)                  searchInput.value          = filters.query;
}

/* Core render*/

/**
 * Эхлээд бүх restaurant өгөгдлийг store-оос avna, Store нь cache ашигладаг тул анхны fetch-ийн дараа санах ойгоос өгнө
 * @param {Object} filters
 */
async function applyFilters(filters) {
  const all      = await getRestaurants();
  const filtered = all.filter(r => r.matches(filters));

  const popular = filtered.filter(r => r.section === "popular");
  const newest  = filtered.filter(r => r.section === "new");

  renderList(popularList, popular);
  renderList(newList,     newest);
}

/* init() нь application bootstrap function бөгөөд app эхлэх үеийн бүх initialization logic iig hariulna*/

async function init() {
  /* restaurant өгөгдлийг урьдчилан ачаалж cachelj hadgalah*/
  await getRestaurants();

  /* Initialization үед URL parameter-уудыг уншаад UI form-той sync хийн, эхний render-ийг тэр state-ээр hiine */
  const urlFilters = readURLParams();
  syncFormToFilters(urlFilters);
  await applyFilters(urlFilters);

  /* Filter form submit хийгдэхэд ажиллана */
  filterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const filters = {
      ...readFilterFormValues(),
      query: searchInput.value.trim(),
    };
    await applyFilters(filters);
  });

  /* Reset дарахад бүх filter-ийг анхны төлөвт нь буцаана */
  filterForm.addEventListener("reset", async () => {
    /* thick waiting */
    await new Promise(r => setTimeout(r, 0));
    searchInput.value = "";
    await applyFilters({ distance: Infinity, minRating: 0, open: "any", category: "", query: "" });
  });

  /* Search form submit хийхэд restaurant section-ийг update хийнэ */
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const filters = {
      ...readFilterFormValues(),
      query: searchInput.value.trim(),
    };
    await applyFilters(filters);

    /* after Search auto scroll  */
    document.querySelector("#screen-b").scrollIntoView({ behavior: "smooth" });
  });

  /* Category chip list дээр event delegation ашигласан. Ингэснээр бүх chip link-ийг нэг listener-eer udirdna */
  document.querySelector("#screen-b .chips").addEventListener("click", async (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    e.preventDefault();

    /* Chip link-ийн href-ээс # тэмдгийг авч хаяж category key vvsgeh */
    const anchor   = link.getAttribute("href").replace("#", "");
    const filters  = {
      ...readFilterFormValues(),
      query:    searchInput.value.trim(),
      category: anchor,
    };
    await applyFilters(filters);
  });
}

/* Dom bvren acaalagdsanii daraa */
document.addEventListener("DOMContentLoaded", init);