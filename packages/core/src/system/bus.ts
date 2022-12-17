import EventEmitter2 from 'eventemitter2';
import { IBus } from '@/interface/bus';
import { IEvents } from '@/interface/events';
import logging from './logging';

const logger = logging.getLogger('event');

class Bus implements IBus {
  private emitter = new EventEmitter2({
    wildcard: true,
    delimiter: '/',
    maxListeners: 100,
    verboseMemoryLeak: true,
  });

  addHook<T extends keyof IEvents>(eventName: T, callback: IEvents[T]): void {
    this.emitter.on(eventName, callback);
    logger.trace('Hook added:', eventName);
  }

  removeHook<T extends keyof IEvents>(
    eventName: T,
    callback: IEvents[T]
  ): void {
    this.emitter.off(eventName, callback);
    logger.trace('Hook removed:', eventName);
  }

  async emit<T extends keyof IEvents>(
    eventName: T,
    ...data: Parameters<IEvents[T]>
  ): Promise<ReturnType<IEvents[T]>[]> {
    const results = await this.emitter.emitAsync(eventName, ...data);
    logger.trace('Event emitted:', eventName, ...data);
    return results;
  }
}

export default new Bus();
