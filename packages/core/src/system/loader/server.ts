import bus from '@src/system/bus';
import config from '@src/system/config';
import logging from '@src/system/logging';

import { SystemLoader } from '@src/system/manager/loader';
import { WaitFunction } from '@src/util/sequencer';
import server from '../server';

const logger = logging.systemLogger;

class HttpServerLoader extends SystemLoader {
  async load(wait: WaitFunction): Promise<void> {
    const { address, port } = config.httpConfig;
    await wait(['db', 'theme']);
    logger.info('Starting server...');
    await server.init();
    await server.listen(port, address);
    bus.on('theme/loaded', () => server.restart(), true);
    bus.once('system/beforeStop', async () => {
      logger.debug('Closing server...');
      await server.close();
    });
  }
}

export default new HttpServerLoader('http');
