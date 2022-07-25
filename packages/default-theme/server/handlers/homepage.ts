import { Asyncable } from '@util/common';
import { buildPageContext } from '@util/page';
import { PageHandler, PageResult } from '@util/handler';

class HomePageHandler extends PageHandler {
  get(): Asyncable<PageResult> {
    return buildPageContext({
      test: 'asdasdas',
    })
      .setPageName('homepage')
      .setPageTitle('title');
  }
}

export default new HomePageHandler('HomePage', '/');
