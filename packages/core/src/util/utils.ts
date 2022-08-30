import bus, { EventType } from '@src/system/bus';
import { BlogNodeError } from '@src/system/error';
import path from 'path';
import { setTimeout } from 'timers/promises';
import { CacheKey } from './types';

// eslint-disable-next-line @typescript-eslint/no-implied-eval
export const sleep = (time: number): Promise<void> => setTimeout(time);

const NS_PER_MS = BigInt(1e6);

export class Timer {
  private startTime: bigint | null = null;

  private endTime: bigint | null = null;

  private stopped = true;

  public start(): void {
    this.startTime = process.hrtime.bigint();
    this.stopped = false;
  }

  public end(): void {
    this.endTime = process.hrtime.bigint();
    this.stopped = true;
  }

  public isStopped(): boolean {
    return this.stopped;
  }

  public result(): bigint {
    if (!this.startTime || !this.endTime) { throw new BlogNodeError("timer didn't start or stop!"); }
    if (this.endTime < this.startTime) throw new BlogNodeError('Usage incorrect');
    return (this.endTime - this.startTime) / NS_PER_MS;
  }

  public async decorate(decorateFunc: ()=> void | Promise<void | void[]>): Promise<bigint> {
    this.start();
    await decorateFunc();
    this.end();
    return this.result();
  }

  public async measureEvents(startEvent: EventType, endEvent: EventType): Promise<bigint> {
    return new Promise<bigint>((resolve) => {
      bus.once(startEvent, () => this.start());
      bus.once(endEvent, () => {
        this.end();
        resolve(this.result());
      });
    });
  }

  public reset(): void {
    this.startTime = null;
    this.endTime = null;
    this.stopped = false;
  }
}

export function cacheKey<T extends string>(prefix: T): (key: string | number)=> CacheKey<T> {
  return (key) => `${prefix}:${key}`;
}

export const SRC_DIR = path.resolve(__dirname, '../');
