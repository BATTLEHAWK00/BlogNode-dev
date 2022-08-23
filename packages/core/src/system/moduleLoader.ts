import fs from 'fs/promises';
import fss from 'fs';
import path = require('path');
import vm = require('vm');

import logging from './logging';
import contextmanager from './contextmanager';

const logger = logging.getLogger('ModuleLoader');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = process.env.NODE_ENV === 'development';

const moduleExt = isDev ? '.ts' : '.js';

function splitModuleName(filename: string): string {
  return path.basename(filename);
}

function getModuleRegex(): RegExp {
  // return /\.ts$/;
  return isDev ? /\.ts$/ : /\.js$/;
}

function scanDir(dirname: string, regex: RegExp): string[] {
  return fss.readdirSync(dirname)
    .filter((filename: string) => regex.test(filename))
    .map((filename) => path.resolve(dirname, filename));
}

async function loadInContext(filePath: fss.PathLike, context: unknown): void {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' });
  vm.runInContext(content, contextmanager.getContext());
}

async function loadModule<T>(filePath: string): Promise<T> {
  const realPath = path.extname(filePath) ? filePath : filePath + moduleExt;
  const moduleName = splitModuleName(realPath);
  logger.trace(`loading module: ${moduleName}...`);
  const res = (await import(`file://${realPath}`)).default;
  logger.debug(`loaded module: ${moduleName}`);
  return res;
}

async function loadPackage<T>(pkgName: string): Promise<T> {
  const moduleName = splitModuleName(pkgName);
  logger.trace(`loading package: ${moduleName}...`);
  const res = (await import(pkgName)).default;
  logger.debug(`loaded package: ${moduleName}`);
  return res;
}

async function loadFiles(filePaths: string[], concurrent = false): Promise<unknown[]> {
  const modules = [];
  if (concurrent) return Promise.all(filePaths.map(async (file) => loadModule(file)));
  let file: string | undefined = filePaths.pop();
  while (file) {
    // eslint-disable-next-line no-await-in-loop
    modules.push(await loadModule(file));
    file = filePaths.pop();
  }
  return modules;
}

async function loadDir(dirname: string, concurrent = false): Promise<unknown[]> {
  const files = scanDir(dirname, getModuleRegex());
  return loadFiles(files, concurrent);
}

export default {
  getModuleRegex,
  splitModuleName,
  loadFiles,
  scanDir,
  loadModule,
  loadDir,
  loadPackage,
  loadInContext,
};
