import type { IEvents } from './events';

export interface IBus {
  addHook<T extends keyof IEvents>(eventName: T, callback: IEvents[T]): void;
  removeHook<T extends keyof IEvents>(eventName: T, callback: IEvents[T]): void;
}

export interface IPluginBus {
  addHook(eventName: string, callback: unknown): void;
  removeHook(eventName: string, callback: unknown): void;
  emit(eventName: string, ...data: unknown[]): void;
  emitAsync(eventName: string, ...data: unknown[]): Promise<void>;
}
