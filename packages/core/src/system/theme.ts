import { systemService } from '@src/orm/service/system';
import { ThemeInfo } from 'index';

import { BlogNodeFatalError } from './error';
import logging from './logging';

let currentTheme: ThemeProcessor;

export class ThemeProcessor {
  private themeDir?: string;

  private themeName?: string;

  private staticDir?: string;

  constructor(themeDir?: string) {
    this.themeDir = themeDir;
  }

  async register(): Promise<void> {
    if (!this.themeDir) {
      logging.systemLogger.warn('Using fallback theme: default-theme.');
      systemService.set('themePackage', '@blognode/default-theme', true);
    }
    const pkgDir = this.themeDir || '@blognode/default-theme';
    try {
      const themeInfo: ThemeInfo = (await import(pkgDir)).default();
      this.themeDir = themeInfo.themePath;
      this.themeName = themeInfo.themeName;
      this.staticDir = themeInfo.staticDir;
    } catch (e) {
      logging.systemLogger.error(e);
      logging.systemLogger.error('Set to fallback theme: default-theme.');
      logging.systemLogger.error('Please start the server again to make it work.');
      await systemService.set('themePackage', '@blognode/default-theme');
      throw new BlogNodeFatalError('Error when loading theme package!');
    }
  }

  getThemeDir(): string {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return this.themeDir;
  }

  getThemeName(): string {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return <string> this.themeName;
  }

  getStaticDir(): string {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return <string> this.staticDir;
  }
}

async function register(pathName?: string): Promise<ThemeProcessor> {
  const themeProcessor = new ThemeProcessor(pathName);
  await themeProcessor.register();
  logging.systemLogger.info(`Registered theme: ${themeProcessor.getThemeName()}`);
  logging.systemLogger.debug(`Theme location: ${themeProcessor.getThemeDir()}`);
  currentTheme = themeProcessor;
  return themeProcessor;
}

function getCurrentTheme(): ThemeProcessor {
  if (!currentTheme) throw new BlogNodeFatalError("Theme hasn't been registered yet!");
  return currentTheme;
}

export default {
  register,
  getCurrentTheme,
};
