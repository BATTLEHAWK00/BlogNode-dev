import { SequenceItem, Sequencer, WaitFunction } from '@src/util/sequencer';
import { fromSrc } from '@src/util/paths';
import cluster from 'cluster';
import { BlogNodeFatalError } from '../error';
import logging from '../logging';
import moduleLoader from '../moduleLoader';

const loaderDir = fromSrc('system/loader');

const logger = logging.getLogger('Loader');

type LoaderModule = {
  default?: SystemLoader
};

export abstract class SystemLoader extends SequenceItem<void, Record<string, unknown>> {
  private primaryOnly: boolean;

  constructor(name: string, primaryOnly = false, timeout?: number) {
    super(name, timeout);
    this.primaryOnly = primaryOnly;
  }

  abstract load(wait: WaitFunction): Promise<void>;

  execute(wait: WaitFunction): Promise<void> {
    if (this.primaryOnly && !cluster.isPrimary) return Promise.resolve();
    return this.load(wait);
  }
}

async function load(): Promise<void> {
  const modules = await moduleLoader.loadDir(loaderDir, true) as LoaderModule[];
  const loaders = modules.filter((m) => m && m instanceof SystemLoader) as SystemLoader[];

  const loadSequencer = new Sequencer<void, void>(loaders);

  const timeoutMap: Map<string, NodeJS.Timeout> = new Map();
  loadSequencer.on('timeout:item', (item) => {
    logger.warn(`Loader ${item} executing for too long.`);
    const timeout = setTimeout(async () => {
      throw new BlogNodeFatalError(`Loader ${item} timed out.`);
    }, 10000);
    timeoutMap.set(item, timeout);
  });
  loadSequencer.on('start:item', (item) => logger.debug(`Loader start: ${item}`));
  loadSequencer.on('finish:item', (item, time) => {
    const timeout = timeoutMap.get(item);
    if (timeout) clearTimeout(timeout);
    logger.debug(`Loader finished: ${item} (${time}ms)`);
  });
  loadSequencer.on('finish', (time) => logger.debug(`All loaders finished. (${time}ms)`));

  await loadSequencer.executeSequence();
}

export default {
  load,
};
