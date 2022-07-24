import { buildPageContext } from '../util/page';
import { Asyncable } from '../util/common';
import { PageHandler, PageResult } from '../util/handler';

class HomePageHandler extends PageHandler {
  get(): Asyncable<PageResult> {
    return buildPageContext({
      test: 'asdasdas',
    }).setPageName('homepage');
  }
}

export default new HomePageHandler('HomePage', '/');
