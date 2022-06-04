import _, { isNull } from 'lodash';
import LRU from 'lru-cache';

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
    ifUncached:<P extends Asyncable<T>>(getFunc:(key:string)=>P)=>{
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
}

export function cacheOperation<T>(cache:LRU<string, T>) {
  return {
    single: {
      ifUncached<P extends Asyncable<T>>(getFunc:(key:string)=>P) {
        return {
          get(
            key:string, getOptions?:LRU.GetOptions,
            setOptions?:LRU.SetOptions<string, T>,
          ) :Nullable<P> {
            if (!cache.has(key)) return cache.get(key, getOptions) || null;
            const res = getFunc(key);
            if (res instanceof Promise) res.then((data) => cache.set(key, data, setOptions));
            return res;
          },
        };
      },
    },
    multiple: {
      ifUncached<P extends Asyncable<T[]>>(getFunc:(keys:string[])=>P, keyFunc:(data:T)=>string) {
        return {
          get(
            keys:string[], getOptions?:LRU.GetOptions,
            setOptions?:LRU.SetOptions<string, T>,
          ) :P {
            const cacheGroups = _.groupBy(keys, (key) => (cache.has(key) ? 'cachedKeys' : 'nonCachedKeys'));
            const fetchedRes = getFunc(cacheGroups.nonCachedKeys);
            const cachedRes = <T[]>cacheGroups.cachedKeys
              .map((k) => cache.get(k, getOptions) || null)
              .filter((d) => !isNull(d));
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
