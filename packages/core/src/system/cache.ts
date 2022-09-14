/* eslint-disable max-classes-per-file */
import LRUCache from 'lru-cache';
import crypto from 'crypto';
import mongoose, { Model } from 'mongoose';
import { Cache } from '@src/interface/entities/cache';
import cluster from 'cluster';
import { BlogNodeError } from './error';
import bus from './bus';
import task from './task';
import logging from './logging';

const logger = logging.getLogger('Cache');
const funcCache: LRUCache<string, unknown> = new LRUCache<string, unknown>({ max: 500 });
const funcHasher = () => crypto.createHash('md5');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ICacheFunction = (...args: any)=> Promise<any> | any;

export function wrapCache<T extends ICacheFunction>(func: T, key?: string, ttl?: number): (...args: Parameters<T>)=> Promise<Awaited<ReturnType<T>>> {
  const funcHash = funcHasher().update(func.toString()).digest('hex');
  return async (...args: unknown[]) => {
    const argsHash = key || funcHasher().update(JSON.stringify(args)).digest('hex');
    const funcKey = `${funcHash}:${argsHash}`;
    if (funcCache.has(funcKey)) return funcCache.get(funcKey);
    const result = await func(...args);
    funcCache.set(funcKey, { ttl });
    return result;
  };
}

abstract class SharedCache<T> {
  readonly name: string;
  readonly ttl?: number;

  constructor(name: string, ttl?: number) {
    this.name = name;
    this.ttl = ttl;
  }

  abstract has(key: string): Promise<boolean>;
  abstract get(key: string): Promise<T | null>;
  abstract set(key: string, value: T | null, ttl?: number): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract size(): Promise<number>;
}

const getCacheKey = (prefix: string, key: string) => `${prefix}:${key}`;

class MongoSharedCache<T> extends SharedCache<T> {
  static dbModel: Model<Cache>;

  private checkModel() {
    if (!MongoSharedCache.dbModel) throw new BlogNodeError('Use of db before initializing.');
  }

  async has(key: string) {
    this.checkModel();
    return !!MongoSharedCache.dbModel.exists({ _id: getCacheKey(this.name, key) });
  }

  async get(key: string) {
    this.checkModel();
    const res = await MongoSharedCache.dbModel.findOne({ _id: getCacheKey(this.name, key) });
    return res?.value as T;
  }

  async set(key: string, value: T, ttl?: number) {
    this.checkModel();
    const namespace = this.name;
    await MongoSharedCache.dbModel.updateOne(
      { _id: getCacheKey(namespace, key) },
      {
        $set: {
          updateTime: Date.now(), namespace, value, ttl: ttl || this.ttl,
        },
      },
      { upsert: true },
    );
  }

  async del(key: string) {
    this.checkModel();
    await MongoSharedCache.dbModel.deleteOne({ _id: getCacheKey(this.name, key) });
  }

  async size() {
    this.checkModel();
    return MongoSharedCache.dbModel.count({ namespace: this.name });
  }
}

async function revalidateMongoSharedCache() {
  const items = await MongoSharedCache.dbModel.find();
  const itemsRemoved = items.filter((item) => item.ttl && Date.now() - item.updateTime >= item.ttl);
  await Promise.all(itemsRemoved.map((item) => item.remove()));
  if (itemsRemoved.length) logger.debug(`Deleted ${itemsRemoved.length} items.`);
}

async function clearMongoSharedCache() {
  return MongoSharedCache.dbModel.deleteMany();
}
setInterval(revalidateMongoSharedCache, 30000);

bus.once('database/connected', async () => {
  MongoSharedCache.dbModel = mongoose.model<Cache>('cache', new mongoose.Schema<Cache>({
    _id: { type: String },
    value: { type: mongoose.SchemaTypes.Mixed },
    namespace: { type: String },
    updateTime: { type: Number },
    ttl: { type: Number },
  }));
  await clearMongoSharedCache();
});

export function createSharedCache<T>(name: string, ttl?: number): SharedCache<T> {
  return new MongoSharedCache<T>(name, ttl);
}

export function wrapSharedCache<T extends ICacheFunction>(
  func: T,
  key?: string,
  ttl?: number,
): (...args: Parameters<T>)=> Promise<Awaited<ReturnType<T>>> {
  const funcHash = funcHasher().update(func.toString()).digest('hex');
  const cache = createSharedCache(`func:${key || funcHash}`);
  const wrappedFunc = async (...args: unknown[]) => {
    const argsHash = key || funcHasher().update(JSON.stringify(args)).digest('hex');
    const funcKey = `${funcHash}:${argsHash}`;
    if (await cache.has(funcKey)) return funcCache.get(funcKey);
    const result = await func(...args);
    await cache.set(funcKey, { ttl });
    return result;
  };
  return wrappedFunc;
}
