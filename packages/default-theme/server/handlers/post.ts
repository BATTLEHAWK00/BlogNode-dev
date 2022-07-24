import { PageHandler, PageResult } from '../util/handler';
import { buildPageContext } from '../util/page';

class PostHandler extends PageHandler {
  async get(): Promise<PageResult> {
    return buildPageContext({}).setPageName('post');
  }
}

export default new PostHandler('PostPage', '/post');
