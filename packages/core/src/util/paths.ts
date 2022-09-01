import config from '@src/system/config';
import path from 'path';
import lodash from 'lodash';
import { BlogNodeFatalError } from '@src/system/error';

const { memoize } = lodash;

export const removeFilePrefix = memoize((filePath: string) => filePath.replace('file:///', ''));
export const getImportDirname = memoize((meta: ImportMeta) => path.dirname(removeFilePrefix(meta.url)));

const srcPath = path.resolve(getImportDirname(import.meta), '../');
const distPath = path.resolve(getImportDirname(import.meta), '../../dist');

export const fromSrc = memoize((relativePath: string) => path.resolve(srcPath, relativePath));
export const fromDist = memoize((relativePath: string) => path.resolve(distPath, relativePath));
export const resolvePackage = async (name: string, withFilePrefix = false) => {
  if (!import.meta.resolve) throw new BlogNodeFatalError('Import resolve not enabled.');
  const url = await import.meta.resolve(name);
  return withFilePrefix ? url : removeFilePrefix(url);
};
export function getDatabaseUri(): string {
  const { dbConfig } = config;
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
}
