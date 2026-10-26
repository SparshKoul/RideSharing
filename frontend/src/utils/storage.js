/**
 * Safe LocalStorage helpers with JSON serialization and memory fallback
 */
const memoryStorage = {};

export function getStoredItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`[RideFlow Storage] Error reading ${key}:`, error);
    return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
  }
}

export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[RideFlow Storage] Error writing ${key}:`, error);
    memoryStorage[key] = value;
  }
}

export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    delete memoryStorage[key];
  }
}
