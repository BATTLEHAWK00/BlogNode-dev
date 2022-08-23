import vm = require('vm');
import logging from './logging';

const logger = logging.getLogger('ContextManager');

const ctxObj: Record<string, unknown> = {};

vm.createContext(ctxObj);

function registerContext(key: string, ctx: unknown): void {
  ctxObj[key] = ctx;
  logger.debug(`Registered Context: ${key}`);
}

function getContext(): typeof ctxObj {
  return ctxObj;
}

export default {
  registerContext,
  getContext,
};
