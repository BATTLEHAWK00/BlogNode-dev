import vm from 'vm';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { ThemeInfo } from '@blognode/types-theme';
import M from 'module';
import LRUCache from 'lru-cache';
import { BlogNodeError } from '../error';
import routerRegistry, { BlogNodeRoute } from '../routerRegistry';
import logging from '../logging';
import config from '../config';

const logger = logging.getLogger('ThemeManager');

const themeInfoCache: LRUCache<string, ThemeInfo> = new LRUCache({ maxSize: 5 });

let themeInfo: ThemeInfo | null = null;

const themeContext = {
  registerTheme(info: ThemeInfo) {
    themeInfo = info;
  },
};

async function loadTheme(filePath: string): Promise<void> {
  const themePath = existsSync(filePath) ? filePath : require.resolve(filePath);
  const code = await fs.readFile(themePath, { encoding: 'utf-8' });
  const script = new vm.Script(code, { displayErrors: true, filename: themePath });

  const vmCtx = vm.createContext({
    require: M.createRequire(themePath),
    module: {},
    exports: {},
    __filename: themePath,
    __dirname: path.dirname(themePath),
    logger: logging.getLogger('Theme'),
    ...themeContext,
    isDev: config.isDev,
  });

  script.runInContext(vmCtx);

  if (!themeInfo) throw new BlogNodeError('Theme loading failed.');

  await themeInfo.prepare({
    isDev: config.isDev,
  });
}

function getThemeInfo(): ThemeInfo | null {
  return themeInfo;
}

export default {
  loadTheme,
  getThemeInfo,
};
