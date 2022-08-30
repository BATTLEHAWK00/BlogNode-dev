import config from '@src/system/config';
import path from 'path';

const srcPath = path.resolve(__dirname, '../');
const distPath = path.resolve(__dirname, '../../dist');

export function getDatabaseUri(): string {
  const { dbConfig } = config;
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
}

export function fromSrc(relativePath: string): string {
  return path.resolve(srcPath, relativePath);
}

export function fromDist(relativePath: string): string {
  return path.resolve(distPath, relativePath);
}
