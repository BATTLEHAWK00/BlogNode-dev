export type Awaitable<T> = Promise<T> | T;
export type CacheKey<T extends string> = `${T}:${string}`;
