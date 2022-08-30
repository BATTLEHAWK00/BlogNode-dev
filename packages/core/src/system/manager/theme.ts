import { existsSync } from 'fs';
import type { ThemeInfo } from '@blognode/types-theme';
import { Timer } from '@src/util/utils';
import { BlogNodeError, BlogNodeFatalError } from '../error';
import logging from '../logging';
import config from '../config';
import bus from '../bus';
import sandbox from '../sandbox';
import renderer from './renderer';

const logger = logging.getLogger('ThemeManager');

let themeInfo: ThemeInfo | null = null;

const themeContext = {
  registerTheme(info: ThemeInfo) {
    themeInfo = info;
  },
};

async function loadTheme(filePath: string): Promise<void> {
  const timer = new Timer();
  logger.info(`Loading theme: ${filePath}...`);
  timer.start();
  const themePath = existsSync(filePath) ? filePath : require.resolve(filePath);

  await sandbox.runModuleInSandbox(themePath, {
    logger: logging.getLogger('Theme'),
    isDev: config.isDev,
    ...themeContext,
  });

  if (!themeInfo) throw new BlogNodeError('Theme loading failed.');

  await themeInfo.prepare({
    isDev: config.isDev,
  });
  await renderer.getRenderer(themeInfo.renderEngine);
  await bus.broadcast('theme/loaded', themeInfo);
  timer.end();
  logger.debug(`Loaded theme: ${themeInfo.themeName} (${timer.result()}ms)`);
  logger.debug('Theme info:', themeInfo);
}

function getThemeInfo(): ThemeInfo {
  if (!themeInfo) throw new BlogNodeFatalError('Access theme info before loading!');
  return themeInfo;
}

export default {
  loadTheme,
  getThemeInfo,
};
