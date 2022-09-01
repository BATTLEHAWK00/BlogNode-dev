/* eslint-disable max-classes-per-file */
import EventEmitter from 'events';
import { Timer } from './system-utils';

export type WaitFunction = (items?: string[])=> Promise<void>;

export abstract class SequenceItem<T, K> {
  readonly name: string;
  readonly timeout: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract execute(wait: WaitFunction, args: K): Promise<T>;

  constructor(name: string, timeout = 10000) {
    this.name = name;
    this.timeout = timeout;
  }
}

export class Sequencer<T, K> extends EventEmitter {
  private seqBus = new EventEmitter({ captureRejections: true });
  private finishedItems: Set<string> = new Set();
  private registeredItems: SequenceItem<T, K>[] = [];

  async executeSequence(args: K): Promise<T[]> {
    const allItems = new Set(this.registeredItems.map((item) => item.name));
    const execTimer = new Timer();
    this.emit('start');
    execTimer.start();

    const execPromises = this.registeredItems.map(async (item) => {
      const waitFunc = async (dependencies?: string[]) => {
        if (!dependencies) return Promise.resolve();
        if (!dependencies.every((dep) => allItems.has(dep))) throw new Error(`Dependencies not satisfied: ${dependencies}`);
        const waitPromises = dependencies.map((dep) => new Promise<void>((resolve) => {
          if (this.finishedItems.has(dep)) {
            resolve();
            return;
          }
          this.seqBus.on(dep, () => resolve());
        }));

        await Promise.all(waitPromises);
        return Promise.resolve();
      };

      const itemTimer = new Timer();
      itemTimer.start();
      this.emit('start:item', item.name);
      const timer = setTimeout(() => this.emit('timeout:item', item.name), item.timeout);
      const result = await item.execute(waitFunc, args);
      clearTimeout(timer);
      this.seqBus.emit(item.name);
      this.finishedItems.add(item.name);
      itemTimer.end();
      this.emit('finish:item', item.name, itemTimer.result());
      return result;
    });

    const result = await Promise.all(execPromises);
    execTimer.end();
    this.emit('finish', execTimer.result());
    return result;
  }

  constructor(items?: SequenceItem<T, K>[]) {
    super();
    if (items) this.registeredItems = items;
  }

  registerItem(item: SequenceItem<T, K>): void {
    this.registeredItems.push(item);
    this.emit('register', item.name);
  }
}
