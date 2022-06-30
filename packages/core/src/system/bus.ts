import * as EventEmitter from 'events';
import { BlogNodeEvents, EventName } from './events';

import logging from './logging';

const logger = logging.getLogger('Event');

type InfiniteArgsFunc = ((...args: unknown[])=> void) | ((...args: unknown[])=> Promise<void>);

const emitter = new EventEmitter();

function on<T extends EventName>(eventName: T, callback: BlogNodeEvents[T] | InfiniteArgsFunc, wait = true): void {
  emitter.on(eventName, async (ack: ()=> void, ...args: unknown[]) => {
    const res = (callback as InfiniteArgsFunc)(...args);
    if (wait) await res;
    ack();
  });
  logger.trace(
    `Event ${eventName} registered. Current listeners: ${
      emitter.listeners(eventName).length
    }`,
  );
}

async function broadcast<T extends EventName>(eventName: T, ...args: unknown[]): Promise<void> {
  const listeners: unknown[] = emitter.listeners(eventName);
  logger.debug(
    `Broadcast Event ${eventName} Emitted. Current listeners: ${listeners.length}`,
  );
  if (!listeners.length) return;
  const broadcastAck = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      logger.error(`Time out when processing event: ${eventName}.`);
      reject();
    }, 30000);
    let ackNum = 0;
    const ack = () => {
      ackNum++;
      if (ackNum === listeners.length) {
        clearTimeout(timeout);
        resolve();
      }
    };
    emitter.emit(eventName, ack, ...args);
  });
  try {
    await broadcastAck;
  } catch (e) {
    logger.error(`Error occurred during event: ${eventName}.`);
    throw e;
  }
  logger.debug(`Event ${eventName} complete.`);
}

function once<T extends EventName>(eventName: T, callback: BlogNodeEvents[T], wait = true): void {
  emitter.on(eventName, async (ack: ()=> void, ...args: unknown[]) => {
    const res = (callback as InfiniteArgsFunc)(...args);
    if (wait) await res;
    ack();
  });
  const listeners: unknown[] = emitter.listeners(eventName);
  logger.trace(
    `Once Event ${eventName} registered. Current listeners: ${listeners.length}`,
  );
}

export default {
  on,
  broadcast,
  once,
};
