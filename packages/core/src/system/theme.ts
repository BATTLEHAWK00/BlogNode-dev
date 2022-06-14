import { systemService } from '@src/orm/service/system';
import { BlogNodeFatalError } from './error';
import logging from './logging';

let currentTheme: ThemeProcessor;

const defaultThemePackageName = '@blognode/default-theme';

export interface ThemeInfo{
  themePath: string,
  themeName: string,
  staticDir?: string,
}

export class ThemeProcessor {
  private themeDir?: string;

  private pkgName: string;

  private themeName?: string;

  private staticDir?: string;

  constructor(pkgName: string) {
    this.pkgName = pkgName;
  }

  async register(): Promise<void> {
    try {
      const themeInfo: ThemeInfo = (await import(this.pkgName)).default();
      this.themeDir = themeInfo.themePath;
      this.themeName = themeInfo.themeName;
      this.staticDir = themeInfo.staticDir;
    } catch (e) {
      if (this.pkgName === defaultThemePackageName) {
        logging.systemLogger.error('Loading of default theme failed.');
        logging.systemLogger.error(`Please check the installation of ${defaultThemePackageName} package or report a issue.`);
      } else {
        await systemService.set('themePackage', '@blognode/default-theme');
        logging.systemLogger.error('Set to fallback theme: default-theme.');
        logging.systemLogger.error('Please start the server again to make it work.');
      }
      throw new BlogNodeFatalError('Error occurred when loading theme package!', e instanceof Error ? { cause: e } : undefined);
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

async function register(pkgName?: string): Promise<ThemeProcessor> {
  let realPkgName: string;
  if (!pkgName) {
    logging.systemLogger.warn('Using fallback theme: default-theme.');
    realPkgName = defaultThemePackageName;
    await systemService.set('themePackage', defaultThemePackageName, true);
  } else realPkgName = pkgName;
  const themeProcessor = new ThemeProcessor(realPkgName);
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
