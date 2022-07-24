/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable max-classes-per-file */
import { Asyncable } from './common';

export interface PageContext{

}

interface IPageHandlerMethods{
  get?(): Asyncable<PageContext>
  post?(): Asyncable<PageContext>
}

interface IApiHandlerMethods{
  get?(): Asyncable<PageContext>
  post?(): Asyncable<PageContext>
  put?(): Asyncable<PageContext>
  del?(): Asyncable<PageContext>
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

interface PageLink{
  rel: string
  type: string
  href: string
}

interface PageScript{
  src: string
  async: boolean
  defer: boolean
}

interface PageContextBuilder<T>{
  pageLinks: PageLink[]
  pageScripts: PageScript[]
  pageCtx: T
  pageName?: string
  addScriptTag(tag: PageScript): PageContextBuilder<T>
  addLinkTag(tag: PageLink): PageContextBuilder<T>
  setPageName(name: string): PageContextBuilder<T>
}

export function buildPageContext<T>(pageCtx: T): PageContextBuilder<T> {
  return {
    pageCtx,
    pageLinks: [],
    pageScripts: [],
    addLinkTag(tag: PageLink) {
      this.pageLinks.push(tag);
      return this;
    },
    addScriptTag(tag: PageScript) {
      this.pageScripts.push(tag);
      return this;
    },
    setPageName(name: string) {
      this.pageName = name;
      return this;
    },
  };
}
