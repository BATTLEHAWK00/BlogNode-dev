import Next, { NextConfig } from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
let themeDir:string;

async function registerThemePackage(packageDir?:string) {
  if (!packageDir) {
    const m = await import('@blognode/default-theme');
    themeDir = m.default.themeDir;
  } else themeDir = packageDir;
}

function getRegisteredTheme() {
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
  getRegisteredTheme,
  getNextApp,
};
