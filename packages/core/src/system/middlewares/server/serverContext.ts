import { systemService } from '@src/orm/service/system';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';

interface BlogNodeServerContext{
  blogName: string
}

declare module 'http'{
  interface IncomingMessage{
    blogNodeCtx: BlogNodeServerContext
  }
}

class ContextMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware | Promise<KoaMiddleware> {
    return async (ctx, next) => {
      ctx.req.blogNodeCtx = {
        blogName: await systemService.get('blogName') || 'BlogNode',
      };
      await next();
    };
  }
}

export default new ContextMiddleware();
