import { SequenceItem, Sequencer, WaitFunction } from '@src/util/sequencer';
import { fromSrc } from '@src/util/system';
import logging from '../logging';
import moduleLoader from '../moduleLoader';

const loaderDir = fromSrc('system/loader');

const logger = logging.getLogger('Loader');

type LoaderModule = {
  default?: SystemLoader
};

export abstract class SystemLoader extends SequenceItem<void, Record<string, unknown>> {
  abstract load(wait: WaitFunction): Promise<void>;

  execute(wait: WaitFunction): Promise<void> {
    return this.load(wait);
  }
}

async function load(): Promise<void> {
  const modules = await moduleLoader.loadDir(loaderDir, true) as LoaderModule[];
  const loaders = modules
    .filter((m) => m.default && m.default instanceof SystemLoader)
    .map((m) => m.default) as SystemLoader[];
  const loadSequencer = new Sequencer(loaders);

  loadSequencer.on('timeout:item', (item) => logger.warn(`Loader ${item} executing for too long.`));
  loadSequencer.on('start:item', (item) => logger.debug(`Loader start: ${item}`));
  loadSequencer.on('finish:item', (item, time) => logger.debug(`Loader finished: ${item} (${time}ms)`));
  loadSequencer.on('finish', (time) => logger.debug(`All loaders finished. (${time}ms)`));

  await loadSequencer.executeSequence();
}

export default {
  load,
};
