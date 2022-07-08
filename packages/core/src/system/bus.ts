import * as EventEmitter from 'events';
import { BlogNodeEvents } from './extendable/events';
import logging from './logging';

const logger = logging.getLogger('Event');

const emitter = new EventEmitter();

export type EventType = keyof BlogNodeEvents;

function on<T extends EventType>(eventName: T, callback: BlogNodeEvents[T], wait = true): void {
  emitter.on(eventName as string, async (ack: ()=> void, ...args: unknown[]) => {
    const res = callback(...args as Parameters<BlogNodeEvents[T]>);
    if (wait) await res;
    ack();
  });
  logger.trace(
    `Event ${eventName} registered. Current listeners: ${
      emitter.listeners(eventName as string).length
    }`,
  );
}
async function broadcast<T extends EventType>(eventName: T, ...args: Parameters<BlogNodeEvents[T]>): Promise<void> {
  const listeners = emitter.listeners(eventName as string);
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
    emitter.emit(eventName as string, ack, ...args);
  });
  try {
    await broadcastAck;
  } catch (e) {
    logger.error(`Error occurred during event: ${eventName}.`);
    throw e;
  }
  logger.debug(`Event ${eventName} complete.`);
}
function once<T extends EventType>(eventName: T, callback: BlogNodeEvents[T], wait = true): void {
  emitter.on(eventName as string, async (ack: ()=> void, ...args: unknown[]) => {
    const res = callback(...args as Parameters<BlogNodeEvents[T]>);
    if (wait) await res;
    ack();
  });
  const listeners = emitter.listeners(eventName as string);
  logger.trace(
    `Once Event ${eventName} registered. Current listeners: ${listeners.length}`,
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  on,
  broadcast,
  once,
};

export default _default;
__blognode.bus = _default;
