import { Asyncable } from '@util/common';
import { buildPageContext } from '@util/page';
import { PageHandler, PageResult } from '@util/handler';
import { HandlerContext } from 'blognode/src/handler/handler';

class HomePageHandler extends PageHandler {
  post({ path, query, params }: HandlerContext, helper: HandlerHelpers): Asyncable<PageResult> {
    console.log({ path, query, params });

    return buildPageContext({
      test: 'asdasdas',
    })
      .setPageName('homepage')
      .setPageTitle('title');
  }

  get({ query, params }: HandlerContext): Asyncable<PageResult> {
    console.log({ query, params });

    return buildPageContext({
      test: 'asdasdas',
    })
      .setPageName('homepage')
      .setPageTitle('title');
  }
}

export default new HomePageHandler('HomePage', '/');
