type VoidRet = void | Promise<void | void[]>;
export interface BlogNodeEvents extends Record<string, (...args: never[])=> VoidRet> {
  'system/beforeStart': ()=> VoidRet
  'system/started': ()=> VoidRet
  'system/beforeStop': (signal: string)=> VoidRet
  'system/gc': ()=> VoidRet
  'database/beforeConnecting': ()=> VoidRet
  'database/connected': ()=> VoidRet
  'task/started': ()=> VoidRet
  'settings/beforeInit': ()=> VoidRet
}
