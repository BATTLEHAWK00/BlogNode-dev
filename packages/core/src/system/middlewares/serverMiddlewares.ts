import { ServerMiddleware } from '@src/system/middleware';
import bodyparser from './server/bodyparser';

import compress from './server/compress';
import logging from './server/logging';
import serverContext from './server/serverContext';
import serveStatic from './server/serveStatic';
import ssr from './server/ssr';
import theme from './server/theme';

const serverMiddlewares: ServerMiddleware[] = [
  theme,
  compress,
  logging,
  bodyparser,
  serveStatic,
  serverContext,
  ssr,
];

export default serverMiddlewares;
