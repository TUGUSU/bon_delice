import { Restaurant } from "./restaurant.js";

/** @type {Restaurant[] | null} sanah oin hvsnegt (populated on first fetch) */
let _table = null;

/**
 * daraagiin udaa cachelsen huvilbaraas avj svljeenii roundtrip hiihgvi
 * @returns {Promise<Restaurant[]>}
 */
export async function getRestaurants() {
  if (_table !== null) return _table;

  const response = await fetch("data/restaurants.json");
  if (!response.ok) {
    throw new Error(`Failed to load restaurant data: ${response.status}`);
  }

  const json = await response.json();
  _table = json.restaurants.map(raw => new Restaurant(raw));
  return _table;
}

/**
 * restaurant iin table iin shvvsen massive ig butsaana
 * @param {Object} filters – filter object avj bvh restaurant deer hailt hiih tohiromjtoi vr dvng ansync baidlaar butsaana
 * @returns {Promise<Restaurant[]>}
 */
export async function queryRestaurants(filters) { /** gadnaas filter avch butsaah */
  const all = await getRestaurants(); /**cache */
  return all.filter(r => r.matches(filters)); /**bvh restaurant aas filtert tohirhiig shvvh */
}