import NextApp, { NextConfig } from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const defaultNextConfig:NextConfig = {
  distDir: isDev ? '.next/development' : '.next',
  pageExtensions: ['tsx'],
  cleanDistDir: true,
};

class ThemeProcessor {
  private themeDir?:string;

  private themeName?:string;

  constructor(themeDir?:string) {
    this.themeDir = themeDir;
  }

  async register() {
    const pkgDir = this.themeDir || '@blognode/default-theme';
    const m = (await import(pkgDir)).default;
    this.themeDir = m.themeDir;
    this.themeName = m.themeName;
    if (!this.themeDir) throw new Error('Theme registration failed!');
  }

  getThemeDir() {
    return this.themeDir;
  }

  getThemeName() {
    return this.themeName;
  }

  async getNextApp() {
    if (!this.themeDir) throw new Error('Theme registration failed!');
    const themeNextConfig = await import(path.resolve(this.themeDir, 'next.config.js').toString());
    return NextApp({
      dev: isDev,
      dir: this.themeDir,
      conf: { ...defaultNextConfig, ...themeNextConfig },
    });
  }
}

function getThemeRegisterer(themeDir?:string) {
  return new ThemeProcessor(themeDir);
}

export default {
  getThemeRegisterer,
};
