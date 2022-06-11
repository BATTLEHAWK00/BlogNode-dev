import fs from 'fs';
import path from 'path';

import logging from './logging';

const logger = logging.getLogger('ModuleLoader');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = process.env.NODE_ENV === 'development';

function splitModuleName(filename: string): string {
  return filename.split('.', 1)[0];
}

function getModuleRegex(): RegExp {
  // return /\.ts$/;
  return isDev ? /\.ts$/ : /\.js$/;
}

function scanDir(dirname: string, regex: RegExp): string[] {
  return fs.readdirSync(dirname).filter((filename) => regex.test(filename));
}

async function loadModule(dirname: string, filename: string): Promise<unknown> {
  const moduleName = splitModuleName(filename);
  logger.trace(`loading module: ${moduleName}...`);
  const res = await import(path.resolve(dirname, moduleName));
  logger.debug(`loaded module: ${moduleName}`);
  return res;
}

async function loadFiles(dirname: string, filenames: string[], concurrent = false): Promise<unknown[]> {
  const modules = [];
  if (concurrent) {
    return Promise.all(filenames.map((file) => loadModule(dirname, file)));
  }
  let file: string | undefined = filenames.pop();
  while (file) {
    // eslint-disable-next-line no-await-in-loop
    modules.push(await loadModule(dirname, file));
    file = filenames.pop();
  }
  return modules;
}

async function loadDir(dirname: string, concurrent = false): Promise<unknown[]> {
  const files = scanDir(dirname, getModuleRegex());
  return loadFiles(dirname, files, concurrent);
}

export default {
  getModuleRegex,
  splitModuleName,
  loadFiles,
  scanDir,
  loadModule,
  loadDir,
};
