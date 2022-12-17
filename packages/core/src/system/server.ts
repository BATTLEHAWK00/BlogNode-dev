import Fastify from 'fastify';
import { createServer } from 'http';

const app = Fastify({
  logger: false,
  serverFactory: (handler, options) => {
    const server = createServer((req, res) => {
      handler(req, res);
    });
  },
});
