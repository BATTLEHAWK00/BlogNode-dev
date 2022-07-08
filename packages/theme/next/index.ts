import { SsrMiddlewareInfo } from 'blognode';
import nextapp from './nextapp';

declare module 'http'{
  interface IncomingMessage{
    _blogNodeCtx: unknown
    _ssrCtx: unknown
  }
}

export { GetBlogNodeProps } from './props';

const { middleware } = nextapp;

const middlewareInfo: SsrMiddlewareInfo = {
  name: 'nextjs',
  prepare: middleware.prepare.bind(middleware),
  close: middleware.close.bind(middleware),
  render: middleware.render.bind(middleware),
  configure: nextapp.configure,
};

export default middlewareInfo;
