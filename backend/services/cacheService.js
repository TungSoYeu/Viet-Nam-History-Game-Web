const cache = new Map();

/**
 * Get data from cache
 * @param {string} key
 * @returns {any} data or null if not found/expired
 */
exports.getCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

/**
 * Set data in cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlMinutes 
 */
exports.setCache = (key, value, ttlMinutes = 15) => {
  const expiry = Date.now() + ttlMinutes * 60 * 1000;
  cache.set(key, { value, expiry });
};

/**
 * Clear specific key from cache
 * @param {string} key 
 */
exports.clearCache = (key) => {
  cache.delete(key);
};

/**
 * Clear entire cache
 */
exports.clearAllCache = () => {
  cache.clear();
};
