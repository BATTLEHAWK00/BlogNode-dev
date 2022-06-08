import system from '@src/orm/service/system';
import { BlogNodeFatalError } from './error';
import logging from './logging';

let currentTheme:ThemeProcessor;

export class ThemeProcessor {
  private themeDir?:string;

  private themeName?:string;

  private staticDir?:string;

  constructor(themeDir?:string) {
    this.themeDir = themeDir;
  }

  async register() {
    if (!this.themeDir) {
      logging.systemLogger.warn('Using fallback theme: default-theme.');
      system.set('themePackage', '@blognode/default-theme');
    }
    const pkgDir = this.themeDir || '@blognode/default-theme';
    try {
      const m = (await import(pkgDir)).default;
      this.themeDir = m.themeDir;
      this.themeName = m.themeName;
      this.staticDir = m.staticDir;
    } catch (e) {
      logging.systemLogger.error(e);
      logging.systemLogger.error('Set to fallback theme: default-theme.');
      logging.systemLogger.error('Please start the server again to make it work.');
      await system.set('themePackage', '@blognode/default-theme');
      throw new BlogNodeFatalError('Error when loading theme package!');
    }
  }

  getThemeDir() {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return this.themeDir;
  }

  getThemeName() {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return this.themeName;
  }

  getStaticDir() {
    if (!this.themeDir) throw new BlogNodeFatalError('Theme registration failed!');
    return <string> this.staticDir;
  }
}

async function register(pathName?:string) {
  const themeProcessor = new ThemeProcessor(pathName);
  await themeProcessor.register();
  logging.systemLogger.info(`Registered theme: ${themeProcessor.getThemeName()}`);
  logging.systemLogger.debug(`Theme location: ${themeProcessor.getThemeDir()}`);
  currentTheme = themeProcessor;
  return themeProcessor;
}

function getCurrentTheme() {
  if (!currentTheme) throw new BlogNodeFatalError("Theme hasn't been registered yet!");
  return currentTheme;
}

export default {
  register,
  getCurrentTheme,
};
