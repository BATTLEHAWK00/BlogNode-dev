import { BlogNode } from './global';

declare global{
  // eslint-disable-next-line vars-on-top,@typescript-eslint/naming-convention,no-var
  var __blognode: BlogNode;
}

global.__blognode = {
  dao: {},
  service: {},
};

require('./main');
