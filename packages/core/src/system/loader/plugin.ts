import { WaitFunction } from '@src/util/sequencer';
import { Timer } from '@src/util/system-utils';
import logging from '../logging';
import { SystemLoader } from '../manager/loader';
import plugin from '../manager/plugin';

const logger = logging.systemLogger;

class PluginLoader extends SystemLoader {
  async load(wait: WaitFunction): Promise<void> {
    await wait(['db']);
    logger.info('Loading plugins...');
    const timer = new Timer();
    await timer.decorate(() => plugin.loadEnabledPlugins());
    logger.debug(`Plugins loaded. (${timer.result()}ms)`);
  }
}
export default new PluginLoader('plugin', 15000);
