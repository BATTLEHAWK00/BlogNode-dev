import bus from '@src/system/bus';
import { EventType } from '@src/system/events';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export class Timer {
  private startTime: Date | null = null;

  private endTime: Date | null = null;

  private stopped:boolean = true;

  public start() {
    this.startTime = new Date();
    this.stopped = false;
  }

  public end() {
    this.endTime = new Date();
    this.stopped = true;
  }

  public isStopped() {
    return this.stopped;
  }

  public result() {
    if (!this.startTime || !this.endTime) { throw new Error("timer didn't start or stop!"); }
    if (this.endTime < this.startTime) throw new Error('Usage incorrect');
    return this.endTime.valueOf() - this.startTime.valueOf();
  }

  public async decorate(decorateFunc: () => void | Promise<void | void[]>) {
    this.start();
    await decorateFunc();
    this.end();
    return this.result();
  }

  public async measureEvents(startEvent:EventType, endEvent:EventType) {
    return new Promise<number>((resolve) => {
      bus.once(startEvent, () => this.start());
      bus.once(endEvent, () => {
        this.end();
        resolve(this.result());
      });
    });
  }
}
