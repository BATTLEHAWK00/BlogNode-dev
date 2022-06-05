import fs from 'fs';
import path from 'path';

import logging from './logging';

const logger = logging.getLogger('ModuleLoader');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = process.env.NODE_ENV === 'development';

function splitModuleName(filename:string) {
  return filename.split('.', 1)[0];
}

function getModuleRegex() {
  return /\.ts$/;
  // return isDev ? /\.ts$/ : /\.js$/;
}

function scanDir(dirname: string, regex: RegExp) {
  return fs.readdirSync(dirname).filter((filename) => regex.test(filename));
}

async function loadModule(dirname: string, filename: string) {
  const moduleName = splitModuleName(filename);
  const res = await import(path.resolve(dirname, moduleName));
  logger.debug(`loaded module: ${moduleName}`);
  return res;
}

async function loadFiles(
  dirname: string,
  filenames: string[],
  concurrent: boolean = false,
) {
  if (concurrent) {
    await Promise.all(filenames.map((file) => loadModule(dirname, file)));
    return;
  }
  let file: string | undefined = filenames.pop();
  while (file) {
    // eslint-disable-next-line no-await-in-loop
    await loadModule(dirname, file);
    file = filenames.pop();
  }
}

async function loadDir(dirname: string, concurrent: boolean = false) {
  const files = scanDir(dirname, getModuleRegex());
  await loadFiles(dirname, files, concurrent);
}

export default {
  getModuleRegex,
  splitModuleName,
  loadFiles,
  scanDir,
  loadModule,
  loadDir,
};
