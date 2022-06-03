import LRU from "lru-cache";

const cacheList: LRU<string, any>[] = [];

const cacheOptions: LRU.Options<string, any> = {
  max: 5000,
  sizeCalculation: () => 1,
};

function getCache<T>(
  maxSize: number = 500,
  defaultTTL: number = 15 * 60 * 1000
): LRU<string, T> {
  const cache = new LRU<string, T>({
    ...cacheOptions,
    maxSize,
    ttl: defaultTTL,
  });
  cacheList.push(cache);
  return cache;
}

export default {
  getCache,
};
