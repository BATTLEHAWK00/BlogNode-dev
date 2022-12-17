import EventEmitter2 from 'eventemitter2';
import { IBus } from '@/interface/bus';
import { IEvents } from '@/interface/events';
import logging from './logging';
import { BroadcastChannel } from 'worker_threads';

const logger = logging.getLogger('event');
const broadcastChannel = new BroadcastChannel('blognode-bus');

interface Message {
  eventName: string;
  data: unknown[];
}

class Bus implements IBus {
  private emitter = new EventEmitter2({
    wildcard: true,
    delimiter: '/',
    maxListeners: 100,
    verboseMemoryLeak: true,
  });

  addHook<T extends keyof IEvents>(eventName: T, callback: IEvents[T]): void {
    this.emitter.on(eventName, callback, { async: true });
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
    broadcastChannel.postMessage({
      eventName,
      data,
    } as Message);
    return this._emitNoBroadcast(eventName, ...data);
  }

  async _emitNoBroadcast<T extends keyof IEvents>(
    eventName: T,
    ...data: Parameters<IEvents[T]>
  ): Promise<ReturnType<IEvents[T]>[]> {
    const results = await this.emitter.emitAsync(eventName, ...data);
    logger.trace('Event emitted:', eventName, ...data);
    return results;
  }

  constructor() {
    broadcastChannel.onmessage = message => {
      const { data: messageData } = message as MessageEvent<Message>;
      const { eventName, data } = messageData;
      this._emitNoBroadcast(
        eventName as keyof IEvents,
        ...(data as Parameters<IEvents[keyof IEvents]>)
      );
    };
  }
}

export default new Bus();
