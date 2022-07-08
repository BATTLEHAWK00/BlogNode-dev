import { systemService } from '@src/orm/service/system';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';

interface BlogNodeServerContext{
  blogName: string
  blogDesc: string
  faviconPath: string
  firstStartAt: Date | null
}

declare module 'http'{
  interface IncomingMessage{
    _blogNodeCtx: BlogNodeServerContext
  }
}

class ContextMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware {
    return async (ctx, next) => {
      ctx.req._blogNodeCtx = {
        blogName: await systemService.get('blogName') || 'BlogNode',
        blogDesc: await systemService.get('blogDescription') || 'BlogNode',
        faviconPath: await systemService.get('faviconPath') || '/favicon.ico',
        firstStartAt: await systemService.get('firstStartAt') || null,
      };
      await next();
    };
  }
}

export default new ContextMiddleware();
