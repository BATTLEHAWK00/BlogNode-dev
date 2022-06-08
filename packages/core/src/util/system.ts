import config from '@src/system/config';
import path from 'path';

const srcPath = path.resolve(__dirname, '../');

// eslint-disable-next-line import/prefer-default-export
export function getDatabaseUri() {
  const { dbConfig } = config;
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
}

export function fromSrc(relativePath:string) {
  return path.resolve(srcPath, relativePath);
}
