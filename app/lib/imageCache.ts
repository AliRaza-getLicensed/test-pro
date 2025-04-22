// export class ImageCache {
//     private static instance: ImageCache;
//     private cache: Map<string, string>;
//     private storageAvailable: boolean;

//     private constructor() {
//       this.cache = new Map();
//       this.storageAvailable = this.isStorageAvailable();
//     }

//     static getInstance(): ImageCache {
//       if (!ImageCache.instance) {
//         ImageCache.instance = new ImageCache();
//       }
//       return ImageCache.instance;
//     }

//     private isStorageAvailable(): boolean {
//       try {
//         if (typeof window === 'undefined') return false;
//         const test = '__cache_test__';
//         localStorage.setItem(test, test);
//         localStorage.removeItem(test);
//         return true;
//       } catch (e) {
//         return false;
//       }
//     }

//     async getImage(url: string): Promise<string> {
//       // First check memory cache
//       if (this.cache.has(url)) {
//         return this.cache.get(url) as string;
//       }

//       // Then check IndexedDB cache
//       const cachedUrl = await this.getFromIDB(url);
//       if (cachedUrl) {
//         this.cache.set(url, cachedUrl);
//         return cachedUrl;
//       }

//       // Fetch and cache if not found
//       return this.fetchAndCache(url);
//     }

//     private async getFromIDB(url: string): Promise<string | null> {
//       try {
//         const db = await this.openDB();
//         return new Promise((resolve) => {
//           const transaction = db.transaction(['images'], 'readonly');
//           const store = transaction.objectStore('images');
//           const request = store.get(url);

//           request.onsuccess = () => {
//             if (request.result) {
//               resolve(request.result.data);
//             } else {
//               resolve(null);
//             }
//           };

//           request.onerror = () => {
//             resolve(null);
//           };
//         });
//       } catch (e) {
//         console.error('Error accessing IndexedDB:', e);
//         return null;
//       }
//     }

//     private async fetchAndCache(url: string): Promise<string> {
//       try {
//         const response = await fetch(url);
//         const blob = await response.blob();
//         const objectURL = URL.createObjectURL(blob);

//         // Store in memory cache
//         this.cache.set(url, objectURL);

//         // Store in IndexedDB for persistence
//         this.saveToIDB(url, objectURL);

//         return objectURL;
//       } catch (e) {
//         console.error('Error fetching image:', e);
//         return url; // Return original URL as fallback
//       }
//     }

//     private async saveToIDB(url: string, dataUrl: string): Promise<void> {
//       try {
//         const db = await this.openDB();
//         const transaction = db.transaction(['images'], 'readwrite');
//         const store = transaction.objectStore('images');
//         store.put({ url, data: dataUrl, timestamp: Date.now() });
//       } catch (e) {
//         console.error('Error saving to IndexedDB:', e);
//       }
//     }

//     private async openDB(): Promise<IDBDatabase> {
//       return new Promise((resolve, reject) => {
//         if (typeof window === 'undefined') reject('No window object');

//         const request = indexedDB.open('imageCache', 1);

//         request.onupgradeneeded = (event) => {
//           const db = (event.target as IDBOpenDBRequest).result;
//           if (!db.objectStoreNames.contains('images')) {
//             const store = db.createObjectStore('images', { keyPath: 'url' });
//             store.createIndex('timestamp', 'timestamp', { unique: false });
//           }
//         };

//         request.onsuccess = (event) => {
//           resolve((event.target as IDBOpenDBRequest).result);
//         };

//         request.onerror = (event) => {
//           reject('IndexedDB error');
//         };
//       });
//     }

//     // Cleanup old cached images (call periodically)
//     async cleanupCache(maxAgeMs = 7 * 24 * 60 * 60 * 1000): Promise<void> {
//       try {
//         const db = await this.openDB();
//         const transaction = db.transaction(['images'], 'readwrite');
//         const store = transaction.objectStore('images');
//         const index = store.index('timestamp');
//         const now = Date.now();

//         const range = IDBKeyRange.upperBound(now - maxAgeMs);
//         const request = index.openCursor(range);

//         request.onsuccess = (event) => {
//           const cursor = (event.target as IDBRequest).result;
//           if (cursor) {
//             store.delete(cursor.primaryKey);
//             cursor.continue();
//           }
//         };
//       } catch (e) {
//         console.error('Error cleaning cache:', e);
//       }
//     }
//   }
export class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, string>;
  private storageAvailable: boolean;
  private loadingPromises: Map<string, Promise<string>>;
  private lastFetchTime: Map<string, number>;

  private constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.lastFetchTime = new Map();
    this.storageAvailable = this.isStorageAvailable();
  }

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  private isStorageAvailable(): boolean {
    try {
      if (typeof window === "undefined") return false;
      const test = "__cache_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false; // SecurityError when offline
    }
  }

  // Force refresh an image from the network
  async forceRefresh(url: string): Promise<string> {
    // Clear the cache for this URL
    this.cache.delete(url);
    this.loadingPromises.delete(url);
    // Remove from IndexedDB too
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      store.delete(url);
    } catch (e) {
      console.error("Error removing from IndexedDB:", e);
    }

    // Fetch fresh image
    return this.fetchAndCache(url);
  }

  // Check if image needs refresh based on time
  async getImage(
    url: string,
    maxAgeMs = 7 * 24 * 60 * 60 * 1000
  ): Promise<string> {
    // If already loading this URL, return the existing promise to prevent duplicate requests
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url) as Promise<string>;
    }

    // Create a new loading promise
    const loadPromise = this._getImage(url, maxAgeMs);
    this.loadingPromises.set(url, loadPromise);

    // Once loaded, clear the promise from the map
    loadPromise.finally(() => {
      this.loadingPromises.delete(url);
    });

    return loadPromise;
  }

  private async _getImage(url: string, maxAgeMs: number): Promise<string> {
    // First check memory cache
    if (this.cache.has(url)) {
      return this.cache.get(url) as string;
    }

    // Then check IndexedDB cache
    const cacheData = await this.getFromIDB(url);

    if (cacheData) {
      const { data: cachedUrl, timestamp } = cacheData;
      const now = Date.now();

      // Check if cache is still valid based on time
      if (now - timestamp < maxAgeMs) {
        this.cache.set(url, cachedUrl);
        this.lastFetchTime.set(url, timestamp);
        return cachedUrl;
      }
      // Otherwise cache is stale, but we'll use it while fetching fresh data
      this.cache.set(url, cachedUrl);

      // Fetch updated version in background
      this.fetchAndCache(url).catch((err) =>
        console.error("Background refresh failed:", err)
      );

      return cachedUrl;
    }

    // Fetch and cache if not found
    return this.fetchAndCache(url);
  }

  private async getFromIDB(
    url: string
  ): Promise<{ data: string; timestamp: number } | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const request = store.get(url);

        request.onsuccess = () => {
          if (request.result) {
            resolve({
              data: request.result.data,
              timestamp: request.result.timestamp,
            });
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          resolve(null);
        };
      });
    } catch (e) {
      console.error("Error accessing IndexedDB:", e);
      return null;
    }
  }

  private async fetchAndCache(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      const now = Date.now();

      // Store in memory cache
      this.cache.set(url, objectURL);
      this.lastFetchTime.set(url, now);

      // Store in IndexedDB for persistence
      this.saveToIDB(url, objectURL, now);

      return objectURL;
    } catch (e) {
      console.error("Error fetching image:", e);
      return url; // Return original URL as fallback
    }
  }

  private async saveToIDB(
    url: string,
    dataUrl: string,
    timestamp: number
  ): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      store.put({ url, data: dataUrl, timestamp });
    } catch (e) {
      console.error("Error saving to IndexedDB:", e);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") reject("No window object");

      const request = indexedDB.open("imageCache", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "url" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject("IndexedDB error");
      };
    });
  }

  // Get last fetch time for a URL
  getLastFetchTime(url: string): number | null {
    return this.lastFetchTime.get(url) || null;
  }

  // Get cache stats
  getCacheStats(): {
    memoryItems: number;
    fetchTimes: { [url: string]: string };
  } {
    const fetchTimes: { [url: string]: string } = {};
    this.lastFetchTime.forEach((time, url) => {
      fetchTimes[url] = new Date(time).toLocaleString();
    });

    return {
      memoryItems: this.cache.size,
      fetchTimes,
    };
  }

  // Cleanup old cached images (call periodically)
  async cleanupCache(maxAgeMs = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const index = store.index("timestamp");
      const now = Date.now();

      const range = IDBKeyRange.upperBound(now - maxAgeMs);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
    } catch (e) {
      console.error("Error cleaning cache:", e);
    }
  }
}
