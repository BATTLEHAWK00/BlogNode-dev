import React from 'react';

type ReactComponent = React.Component | JSX.Element;
type RenderFunction<T extends ReactComponent> = (...args:any)=> T;

export interface IPage<T extends ReactComponent> extends RenderFunction<T>{
  pageTitle?:string
  pageLayout?:RenderFunction<T>
}

export default abstract class BasePage<T extends ReactComponent> {
  private page:IPage<T>;

  protected setPageTitle():string | void {}

  protected setPageLayout():RenderFunction<T> | void {}

  protected setPageRenderer():RenderFunction<T> {
    if (!this.page) throw new Error('No page renderer set!');
    return null;
  }

  constructor(page?:RenderFunction<T>) {
    if (page) this.page = page;
    else this.page = this.setPageRenderer();
  }

  public getFinalPage() {
    const { page } = this;
    page.pageLayout = this.setPageLayout() || null;
    page.pageTitle = this.setPageTitle() || null;
    return page;
  }
}
