import config from '@src/system/config';
import path from 'path';

const srcPath = path.resolve(__dirname, '../');

export function getDatabaseUri(): string {
  const { dbConfig } = config;
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
}

export function fromSrc(relativePath: string): string {
  return path.resolve(srcPath, relativePath);
}
