/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable max-classes-per-file */
import type { Request, Response } from 'koa';
import { Asyncable } from './common';

export const pageMethod = ['get', 'post'] as const;
export const apiMethod = ['get', 'post', 'put', 'del'] as const;

export type PageMethod = typeof pageMethod[number];
export type ApiMethod = typeof apiMethod[number];

export interface PageResult{

}

export interface ApiResult{

}

export interface HandlerContext {
  path: string
  query: Record<string, unknown>
  params: Record<string, unknown>
  req: Request
  res: Response
}

export interface HandlerHelpers{
  redirect(url: string): void
}

type IPageHandlerMethods = {
  [key in ApiMethod]: (ctx: HandlerContext, helpers: HandlerHelpers)=> Asyncable<ApiResult>;
};

type IApiHandlerMethods = {
  [key in PageMethod]: (ctx: HandlerContext, helpers: HandlerHelpers)=> Asyncable<ApiResult>;
};

abstract class Handler {
  private name: string;

  private path: string;

  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }
}

export interface PageHandler extends IPageHandlerMethods{}

export interface ApiHandler extends IApiHandlerMethods{}

export abstract class PageHandler extends Handler {

}

export abstract class ApiHandler extends Handler {

}
