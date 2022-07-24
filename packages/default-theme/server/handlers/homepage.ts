import { Asyncable } from '../util/common';
import { buildPageContext, PageContext, PageHandler } from '../util/handler';

class HomePageHandler extends PageHandler {
  get(): Asyncable<PageContext> {
    return buildPageContext({
      test: 'asdasdas',
    }).setPageName('homepage')
      .addLinkTag({
        rel: 'stylesheet',
        type: 'text/css',
        href: 'static/main.css',
      })
      .addLinkTag({
        rel: 'stylesheet',
        type: 'text/css',
        href: 'static/components.css',
      })
      .addScriptTag({
        src: 'static/main.js',
        defer: true,
        async: true,
      })
      .addScriptTag({
        src: 'static/components.js',
        defer: true,
        async: true,
      });
  }
}

export default new HomePageHandler('HomePage', '/');
