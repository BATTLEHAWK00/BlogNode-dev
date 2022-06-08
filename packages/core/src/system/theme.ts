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
    if (!this.themeDir) logging.systemLogger.info('Using fallback theme: default-theme.');
    const pkgDir = this.themeDir || '@blognode/default-theme';
    const m = (await import(pkgDir)).default;
    this.themeDir = m.themeDir;
    this.themeName = m.themeName;
    this.staticDir = m.staticDir;
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
