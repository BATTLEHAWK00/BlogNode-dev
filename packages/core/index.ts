import type { BlogNode } from './src/global';

declare global{
  // eslint-disable-next-line no-var,vars-on-top,@typescript-eslint/naming-convention
  var __blognode: BlogNode;
}

export {};
