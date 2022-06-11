/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import type Bus from 'src/system/bus';

export type * from 'src/interface/interface';
interface BlogNodeCore{
  bus: typeof Bus
}
declare global{
  var blogNodeCore: BlogNodeCore;
}
