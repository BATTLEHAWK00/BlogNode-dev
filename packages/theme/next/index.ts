import { CompoundTypes } from '@src/interface/entities/systemSetting';
import { systemService } from '@src/orm/service/system';
import bus from '@src/system/bus';
import { NextApiRequest } from 'next';
import { IncomingMessage } from 'http';

export interface ThemeInfo{
  themePath: string,
  themeName: string,
  staticDir?: string,
}

export type ThemeRegisterer = ()=> ThemeInfo;

async function getSetting<T extends CompoundTypes>(name: string): Promise<T | null> {
  const themeSetting = await systemService.get('themeSettings') as { [name: string]: CompoundTypes } | null;
  if (!themeSetting) await systemService.set('themeSettings', {});
  return (themeSetting && themeSetting[name]) as T || null;
}

export interface BlogNodeContext{
  blogName: string
}

export type BlogNodeRequest = NextApiRequest & {
  blogNodeCtx: BlogNodeContext
};

export function getContext(req: IncomingMessage): BlogNodeContext | null {
  if ('blogNodeCtx' in req) return req.blogNodeCtx;
  return null;
}

// eslint-disable-next-line import/prefer-default-export
export const theme = {
  getSetting,
  bus,
};

export const service = {
  systemService,
};
