import { Connect } from './service/database';
import server from './service/server';

Connect();

server.start();
