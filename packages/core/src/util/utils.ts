import bus from '@src/system/bus';
import { BlogNodeError } from '@src/system/error';
import { EventType } from '@src/system/events';

export const sleep = (time: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, time));

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
}
