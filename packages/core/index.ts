import type { BlogNode } from './src/global';
import type { ThemeInfo } from './src/system/theme';

export type { SsrMiddlewareInfo, SsrConfig } from './src/system/middlewares/server/ssr';
export type { BlogNodeServerContext } from './src/system/middlewares/server/serverContext';

export type ThemeRegisterer = ()=> ThemeInfo;

declare global{
  // eslint-disable-next-line no-var,vars-on-top,@typescript-eslint/naming-convention
  var __blognode: BlogNode;
}

export const test = {
  test: 'asd',
};
