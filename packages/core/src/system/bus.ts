import EventEmitter from 'events';
import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('eventBus');

type InfiniteArgsFunction =
  | ((...args: any[]) => void)
  | ((...args: any[]) => Promise<void>);

const emitter = new EventEmitter();

function on(eventName: EventType, callback: InfiniteArgsFunction) {
  const eventNameStr: string = EventType[eventName];
  emitter.on(eventNameStr, async (ack: any, ...args: any[]) => {
    await callback(args);
    ack();
  });
  logger.debug(
    `Event ${eventNameStr} registered. Current listeners: ${
      emitter.listeners(eventNameStr).length
    }`,
  );
}

async function broadcast(eventName: EventType, ...args: any[]) {
  const eventNameStr: string = EventType[eventName];
  const listeners: any[] = emitter.listeners(eventNameStr);
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
    emitter.emit(eventNameStr, ack, args);
  });
  await broadcastAck;
  logger.debug(`Event ${eventNameStr} complete.`);
}

function once(eventName: EventType, callback: InfiniteArgsFunction) {
  const eventNameStr: string = EventType[eventName];
  emitter.on(eventNameStr, async (ack: any, ...args: any[]) => {
    await callback(args);
    ack();
  });
  const listeners: any[] = emitter.listeners(eventNameStr);
  logger.debug(
    `Once Event ${eventNameStr} registered. Current listeners: ${listeners.length}`,
  );
}

export default {
  on,
  broadcast,
  once,
};
