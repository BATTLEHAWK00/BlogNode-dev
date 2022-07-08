import { systemService } from '@src/orm/service/systemService';
import { BlogNodeFatalError } from './error';
import logging from './logging';
import moduleLoader from './moduleLoader';

let currentTheme: ThemeProcessor;

const defaultThemePackageName = '@blognode/default-theme';

export interface ThemeInfo{
  themePath: string
  themeName: string
  staticDir?: string
  staticPrefix?: string
  ssrMiddleware: string
  registerRoutes: ()=> void
}

type ThemeRegisterModule = { default: ()=> ThemeInfo };

export class ThemeProcessor {
  private pkgName: string;

  private themeInfo?: ThemeInfo;

  constructor(pkgName: string) {
    this.pkgName = pkgName;
  }

  async register(): Promise<void> {
    try {
      this.themeInfo = (await moduleLoader.loadPackage<ThemeRegisterModule>(this.pkgName)).default();
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

  getThemeInfo(): ThemeInfo {
    if (!this.themeInfo) throw new BlogNodeFatalError('Theme initialization failed!');
    return this.themeInfo;
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
  logging.systemLogger.info(`Registered theme: ${themeProcessor.getThemeInfo().themeName}`);
  logging.systemLogger.debug(`Theme location: ${themeProcessor.getThemeInfo().themePath}`);
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
