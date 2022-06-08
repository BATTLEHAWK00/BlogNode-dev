import { ServerMiddleware } from '@src/system/middleware';

import compress from './server/compress';
import logging from './server/logging';
import ssr from './server/ssr';
import _static from './server/static';

const serverMiddlewares:ServerMiddleware[] = [
  compress,
  logging,
  ssr,
  _static,
];

export default serverMiddlewares;
