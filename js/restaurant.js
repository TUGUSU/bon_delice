export class Restaurant {
  /**
     @param {Object} data – restaurants.json oos avsan raw object
   */
  constructor(data) {
    this.id          = data.id;
    this.name        = data.name;
    this.image       = data.image;
    this.imageAlt    = data.imageAlt;
    this.rating      = data.rating;
    this.reviewCount = data.reviewCount;
    this.tags        = data.tags;          
    this.category    = data.category;       
    this.distance    = data.distance;      
    this.isOpen      = data.isOpen;        
    this.section     = data.section;       // "popular" | "new"
  }

  get starString() {
    const full  = Math.round(this.rating); /**ratingig oiroltsoo too bolgono */
    const empty = 5 - full;
    return "★".repeat(full) + "☆".repeat(empty);
  }

  /** tags iig "#" helbertei bolgono */
  get tagLine() {
    return this.tags.map(t => `#${t}`).join(" ");
  }
  /**
   * ene restaurant ni shvvltvvriig hangasan bol true butsaana
   * @param {Object} filters
   * @param {number}  filters.distance  – max km  (or Infinity for "any")
   * @param {number}  filters.minRating – min rating (or 0 for "any")
   * @param {string}  filters.open      – "any" | "open" | "closed"
   * @param {string}  filters.category  – "" for all, else e.g. "korean"
   * @param {string}  filters.query     – free-text search on name / tags
   */
  matches(filters) {
    if (this.distance > filters.distance) return false;

    if (filters.minRating > 0 && this.rating < filters.minRating) return false;

    if (filters.open === "open"   && !this.isOpen) return false;
    if (filters.open === "closed" &&  this.isOpen) return false;

    if (filters.category && this.category !== filters.category) return false;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      const inName = this.name.toLowerCase().includes(q);
      const inTags = this.tags.some(t => t.toLowerCase().includes(q));
      if (!inName && !inTags) return false;
    }

    return true;
  }
}