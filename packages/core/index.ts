/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { PageHandler as _PageHandler } from '@src/handler/handler';
import type { BlogNode } from './src/global';
import type { ThemeInfo } from './src/system/theme';

export type { SsrMiddlewareInfo, SsrConfig } from './src/system/middlewares/server/ssr';
export type { BlogNodeServerContext } from './src/system/middlewares/server/serverContext';

export type ThemeRegisterer = ()=> ThemeInfo;

declare global{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __blognode: BlogNode;
}
global.PageHandler = _PageHandler;
global.ApiHandler = _PageHandler;
