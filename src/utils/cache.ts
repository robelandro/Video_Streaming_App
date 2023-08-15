interface JsonCacheType {
	push(key: string, value: string): void;
	get(key: string): string | null;
	delete(key: string): void;
  }

// this is a cache class for caching data
class JsonCache implements JsonCacheType {
	cache: { [key: string]: string };
	maximumSize: number;
  
	/**
	 * Create a new cache
	 * @param maximumSize The maximum size of the cache
	 */
	constructor(maximumSize: number = 100) {
	  this.cache = {};
	  this.maximumSize = maximumSize;
	}
  
	/**
	 * Push a new item to the cache
	 * @param key 
	 * @param value 
	 */
	push(key: string, value: string): void {
	  // Check if the cache has reached the maximum size
	  if (Object.keys(this.cache).length >= this.maximumSize) {
		// If the cache is full, delete the oldest item
		const oldestKey = Object.keys(this.cache)[0];
		delete this.cache[oldestKey];
	  }
  
	  // Add the new item to the cache
	  this.cache[key] = value;
	}
  
	/**
	 * Get an item from the cache
	 * @param key 
	 * @returns 
	 */
	get(key: string): string | null {
	  return this.cache[key] || null;
	}
  
	/**
	 * Delete an item from the cache
	 * @param key 
	 */
	delete(key: string): void {
	  delete this.cache[key];
	}
  }

// Create a new cache
const cache = new JsonCache();

export default cache;
