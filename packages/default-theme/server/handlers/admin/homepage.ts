import { buildPageContext } from '@util/page';
import { Asyncable } from '@util/common';
import { PageHandler, PageResult } from '@util/handler';

class AdminHomePageHandler extends PageHandler {
  get(): Asyncable<PageResult> {
    return buildPageContext({
      test: 'asdasdas',
    }).setPageName('admin');
  }
}

export default new AdminHomePageHandler('AdminHomePage', '/admin/');
