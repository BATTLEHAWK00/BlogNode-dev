import EventEmitter2 from 'eventemitter2';
import { IBus } from '@/interfaces/bus';
import { IEvents } from '@/interfaces/events';

class Bus implements IBus {
  private emitter = new EventEmitter2({
    wildcard: true,
    delimiter: '/',
    maxListeners: 50,
  });

  addHook<T extends keyof IEvents>(eventName: T, callback: IEvents[T]): void {
    this.emitter.on(eventName, callback);
  }

  removeHook<T extends keyof IEvents>(
    eventName: T,
    callback: IEvents[T]
  ): void {
    this.emitter.off(eventName, callback);
  }

  emit<T extends keyof IEvents>(eventName: T, ...data: Parameters<IEvents[T]>) {
    this.emitter.emit(eventName, ...data);
  }
}

export default new Bus();
