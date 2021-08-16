import { Db, MongoClient } from 'mongodb';
import { Logger } from './logger';

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
const MONGODB_USER = process.env.MONGODB_USER || null;
const MONGODB_PASSWORD = process.env.PASSWORD || null;
const MONGODB_DBNAME = process.env.PASSWORD || 'BlogNode';

const logger = new Logger('service/database');
let connection:MongoClient | null = null;
let database:Db | null = null;

export async function Connect() {
  connection = await MongoClient.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DBNAME}`);
  database = connection.db();
  logger.success('Database Connected.');
}

export function getCollection(collName:string) {
  return database?.collection(collName);
}
