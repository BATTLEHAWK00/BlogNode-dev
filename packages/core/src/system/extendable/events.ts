import { ThemeInfo } from '@blognode/types-theme';
import { User } from '@src/interface/interface';

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
  'routes/register': ()=> VoidRet
  'auth/login': (user: User)=> VoidRet
  'auth/register': (uid: number)=> VoidRet
  'auth/logout': (user: User)=> VoidRet
  'theme/loaded': (themeInfo: ThemeInfo)=> VoidRet
}
