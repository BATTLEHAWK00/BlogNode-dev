import { CompoundTypes } from '@src/interface/entities/systemSetting';
import system from '@src/orm/service/system';
import bus from '@src/system/bus';

export interface ThemeInfo{
  themePath: string,
  themeName: string,
  staticDir?: string,
}

export type ThemeRegisterer = ()=> ThemeInfo;

async function getSetting<T extends CompoundTypes>(name: string): Promise<T | null> {
  const themeSetting = await system.get('themeSettings') as { [name: string]: CompoundTypes } | null;
  if (!themeSetting) await system.set('themeSettings', {});
  return (themeSetting && themeSetting[name]) as T || null;
}

// async function setSetting(name: string, value: CompoundTypes): Promise<void> {
//   const themeSetting = await system.get('themeSettings') as { [name: string]: CompoundTypes } | null;
//   if (!themeSetting) await system.set('themeSettings', {});
//   return (themeSetting && themeSetting[name]) as T || null;
// }

// eslint-disable-next-line import/prefer-default-export
export const theme = {
  getSetting,
  bus,
};
