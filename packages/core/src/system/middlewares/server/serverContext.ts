import { systemService } from '@src/orm/service/systemService';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';

export interface BlogNodeServerContext{
  blogName: string
  blogDesc: string
  faviconPath: string
  firstStartAt: Date | null
}

class ContextMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware {
    return async (ctx, next) => {
      ctx._blogNodeCtx = {
        blogName: await systemService.get('blogName') || 'BlogNode',
        blogDesc: await systemService.get('blogDescription') || 'BlogNode',
        faviconPath: await systemService.get('faviconPath') || '/favicon.ico',
        firstStartAt: await systemService.get('firstStartAt') || null,
      };
      try {
        await next();
      } catch (error) {
        console.log(error);
      }
    };
  }
}

export default new ContextMiddleware();
