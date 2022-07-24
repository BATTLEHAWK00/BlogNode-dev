import { buildPageContext } from '../util/page';
import { PageHandler, PageResult } from '../util/handler';

class SearchPageHandler extends PageHandler {
  async get(): Promise<PageResult> {
    return buildPageContext({}).setPageName('search');
  }
}

export default new SearchPageHandler('SearchPage', '/search');
