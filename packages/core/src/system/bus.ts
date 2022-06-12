import EventEmitter from 'events';

import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('Event');

type InfiniteArgsFunction =
  | ((...args: unknown[])=> void)
  | ((...args: unknown[])=> Promise<void>);

const emitter = new EventEmitter();

function on(eventName: EventType, callback: InfiniteArgsFunction, wait = true): void {
  const eventNameStr: string = EventType[eventName];
  emitter.on(eventNameStr, async (ack: ()=> void, args: unknown, ...remainingArgs: unknown[]) => {
    const res = callback(args, ...remainingArgs);
    if (wait) await res;
    ack();
  });
  logger.trace(
    `Event ${eventNameStr} registered. Current listeners: ${
      emitter.listeners(eventNameStr).length
    }`,
  );
}

async function broadcast<T>(eventName: EventType, args?: T, ...remainingArgs: unknown[]): Promise<void> {
  const eventNameStr: string = EventType[eventName];
  const listeners: unknown[] = emitter.listeners(eventNameStr);
  logger.debug(
    `Broadcast Event ${eventNameStr} Emitted. Current listeners: ${listeners.length}`,
  );
  if (!listeners.length) return;
  const broadcastAck = new Promise<void>((resolve) => {
    let ackNum = 0;
    const ack = () => {
      ackNum++;
      if (ackNum === listeners.length) resolve();
    };
    emitter.emit(eventNameStr, ack, args, ...remainingArgs);
  });
  try {
    await broadcastAck;
  } catch (e) {
    logger.error(`Error occurred during event: ${eventName}.`);
    throw e;
  }
  logger.debug(`Event ${eventNameStr} complete.`);
}
function once(eventName: EventType, callback: InfiniteArgsFunction, wait = true): void {
  const eventNameStr: string = EventType[eventName];
  emitter.on(eventNameStr, async (ack: ()=> void, args: unknown, ...remainingArgs: unknown[]) => {
    const res = callback(args, ...remainingArgs);
    if (wait) await res;
    ack();
  });
  const listeners: unknown[] = emitter.listeners(eventNameStr);
  logger.trace(
    `Once Event ${eventNameStr} registered. Current listeners: ${listeners.length}`,
  );
}

export default {
  on,
  broadcast,
  once,
};
