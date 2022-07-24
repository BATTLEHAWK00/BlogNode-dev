import { buildPageContext } from '../util/page';
import { Asyncable } from '../util/common';
import { PageContext, PageHandler } from '../util/handler';

class HomePageHandler extends PageHandler {
  get(): Asyncable<PageContext> {
    return buildPageContext({
      test: 'asdasdas',
    }).setPageName('homepage');
  }
}

export default new HomePageHandler('HomePage', '/');
