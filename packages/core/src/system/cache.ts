import _, { isNull } from 'lodash';
import LRU from 'lru-cache';

import logging from './logging';

const logger = logging.getLogger('LocalCache');

const cacheList: LRU<string, any>[] = [];

const cacheOptions: LRU.Options<string, any> = {
  max: 5000,
  sizeCalculation: () => 1,
};

function getCache<T>(
  maxSize: number = 500,
  defaultTTL: number = 15 * 60 * 1000,
): LRU<string, T> {
  const cache = new LRU<string, T>({
    ...cacheOptions,
    maxSize,
    ttl: defaultTTL,
  });
  cacheList.push(cache);
  return cache;
}

type Nullable<K> = K | null;
type Asyncable<K> = Promise<Nullable<K>> | Nullable<K>;

export interface CacheOperation<T>{
  single:{
    ifUncached:<P extends Asyncable<T>>(getFunc:()=>P)=>{
      get:(key:string, getOptions?:LRU.GetOptions,
        setOptions?:LRU.SetOptions<string, T>)=>Nullable<P>
    }
  }
  multiple:{
    ifUncached:<P extends Asyncable<T[]>>(getFunc:(keys:string[])=>P, keyFunc:(data:T)=>string)=>{
      get:(keys:string[], getOptions?:LRU.GetOptions,
        setOptions?:LRU.SetOptions<string, T>)=>P
    }
  }
  evict:(key:string)=>void
}

export function cacheOperation<T>(cache:LRU<string, T>):CacheOperation<T> {
  return {
    evict(key) {
      cache.delete(key);
    },
    single: {
      ifUncached<P extends Asyncable<T>>(getFunc:()=>P) {
        return {
          get(key, getOptions, setOptions) {
            if (cache.has(key)) {
              logger.trace(`Cache hit: ${key}`);
              return cache.get(key, getOptions) || null;
            }
            logger.trace(`Cache miss: ${key}`);
            const res = getFunc();
            if (res instanceof Promise) res.then((data) => cache.set(key, data, setOptions));
            return res;
          },
        };
      },
    },
    multiple: {
      ifUncached<P extends Asyncable<T[]>>(getFunc:(keys:string[])=>P, keyFunc:(data:T)=>string) {
        return {
          get(keys, getOptions, setOptions) :P {
            const cacheGroups = _.groupBy(keys, (key) => (cache.has(key) ? 'cachedKeys' : 'nonCachedKeys'));
            const fetchedRes = getFunc(cacheGroups.nonCachedKeys);
            const cachedRes = <T[]>cacheGroups.cachedKeys
              .map((k) => cache.get(k, getOptions) || null)
              .filter((d) => !isNull(d));
            if (cacheGroups.cachedKeys) logger.trace(`Cache hit: ${cacheGroups.cachedKeys}`);
            if (cacheGroups.nonCachedKeys) logger.trace(`Cache miss: ${cacheGroups.nonCachedKeys}`);
            if (fetchedRes instanceof Promise<T[]>) {
              return <P>(async () => {
                const data = <T[]>(await fetchedRes);
                data.forEach((d) => cache.set(keyFunc(d), d, setOptions));
                return [...cachedRes, ...data];
              })();
            }
            return <P>[...cachedRes, ...<T[]>fetchedRes];
          },
        };
      },
    },
  };
}

export default {
  getCache,
};
