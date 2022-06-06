import config from '@src/config';

// eslint-disable-next-line import/prefer-default-export
export function getDatabaseUri() {
  const { dbConfig } = config;
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
}
