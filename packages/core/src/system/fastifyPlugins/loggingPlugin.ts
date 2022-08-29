import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Logger } from 'log4js';

interface ILoggerPluginOptions{
  logger: Logger
}

const logStyle = '{IP} - {METHOD} {URL} {STATUS} {TIME}ms';

const plugin: FastifyPluginCallback<ILoggerPluginOptions> = async (fastify, options) => {
  const { logger } = options;
  fastify.addHook('onResponse', async (req, res) => {
    const code = res.statusCode;
    const msg = logStyle.replace('{METHOD}', req.method)
      .replace('{STATUS}', res.statusCode.toString())
      .replace('{URL}', req.url)
      .replace('{TIME}', res.getResponseTime().toFixed(1).toString())
      .replace('{IP}', req.ip);

    if (code < 400) logger.info(msg);
    else if (code && code < 500) logger.warn(msg);
    else if (code >= 500) logger.error(msg);
  });
};

export default fastifyPlugin(plugin);
