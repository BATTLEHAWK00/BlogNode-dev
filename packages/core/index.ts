import authService from '@src/orm/service/authService';
import { systemService } from '@src/orm/service/systemService';
import userService from '@src/orm/service/userService';
import routerRegistry from '@src/system/routerRegistry';

import type { BlogNode } from './src/global';
import type { ThemeInfo } from './src/system/theme';

export { postDao } from '@src/orm/dao/postDao';
export { systemDao } from '@src/orm/dao/systemDao';
export { userDao } from '@src/orm/dao/userDao';

export type { SsrMiddlewareInfo, SsrConfig } from './src/system/middlewares/server/ssr';

export type ThemeRegisterer = ()=> ThemeInfo;

export const RegisterApiRoute = routerRegistry.registerApiRoute;
export const RegisterPageRoute = routerRegistry.registerPageRoute;

declare global{
  // eslint-disable-next-line no-var,vars-on-top,@typescript-eslint/naming-convention
  var __blognode: BlogNode;
}

export {};
