/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable max-classes-per-file */
import { Asyncable } from './common';

export interface PageResult{

}

export interface ApiResult{

}

interface IPageHandlerMethods{
  get?(): Asyncable<PageResult>
  post?(): Asyncable<PageResult>
}

interface IApiHandlerMethods{
  get?(): Asyncable<ApiResult>
  post?(): Asyncable<ApiResult>
  put?(): Asyncable<ApiResult>
  del?(): Asyncable<ApiResult>
}

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
