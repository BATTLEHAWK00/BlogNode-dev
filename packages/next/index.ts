import Next, { NextConfig } from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
let themeDir:string;
let themeName:string;

async function registerThemePackage(packageDir?:string) {
  const pkgDir = packageDir||'@blognode/default-theme'
    const m =  (await import('@blognode/default-theme')).default;
    themeDir = m.themeDir;
    themeName = m.themeName;
}

function getRegisteredThemeDir() {
  return themeDir;
}

function getRegisteredThemeName() {
  return themeDir;
}

const defaultNextConfig:NextConfig = {
  distDir: isDev ? '.next/development' : '.next',
  pageExtensions: ['tsx'],
  cleanDistDir: true,
};

function getNextApp() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const themeNextConfig = require(path.resolve(themeDir, 'next.config.js').toString());
  return Next({ dev: isDev, dir: themeDir, conf: { ...defaultNextConfig, ...themeNextConfig } });
}

export default {
  registerThemePackage,
  getRegisteredThemeDir,
  getRegisteredThemeName,
  getNextApp,
};
