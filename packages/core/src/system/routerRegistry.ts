import { ApiHandler, getHandlerMiddleware, PageHandler } from '@src/handler/handler';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginCallback = (fastify, options) => {

};

export default {
  plugin: fp(plugin),
};
