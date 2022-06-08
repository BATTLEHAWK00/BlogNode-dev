import { ServerMiddleware } from '@src/system/middleware';

import compress from './server/compress';
import logging from './server/logging';
import serveStatic from './server/serveStatic';
import ssr from './server/ssr';
import theme from './server/theme';

const serverMiddlewares:ServerMiddleware[] = [
  theme,
  compress,
  logging,
  serveStatic,
  ssr,
];

export default serverMiddlewares;
