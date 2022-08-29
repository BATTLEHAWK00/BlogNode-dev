import { RouteHandlerMethod } from 'fastify/types/route';
import LRUCache from 'lru-cache';
import { match as matchPath, MatchFunction } from 'path-to-regexp';

export interface BlogNodeRouteMeta{
  name?: string
  path: string
  method: string
  handler: RouteHandlerMethod[]
}

interface RouteMatchResult{
  routeMeta: BlogNodeRouteMeta
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pathParams: Record<string, any>
}

class BlogNodeRouter {
  private readonly routeNameMap: Map<string, BlogNodeRouteMeta> = new Map();
  private readonly routePathMap: Map<string, BlogNodeRouteMeta> = new Map();
  private readonly routeMatchList: { routeMeta: BlogNodeRouteMeta, match: MatchFunction }[] = [];
  private readonly routeMatchCache: LRUCache<string, RouteMatchResult> = new LRUCache({ max: 1000 });

  registerRoute(routeMeta: BlogNodeRouteMeta): void {
    if (routeMeta.name) this.routeNameMap.set(routeMeta.name, routeMeta);
    this.routePathMap.set(routeMeta.path, routeMeta);
    this.routeMatchList.push({
      routeMeta,
      match: matchPath(routeMeta.path),
    });
  }

  getRouteByName(name: string): BlogNodeRouteMeta | undefined {
    return this.routeNameMap.get(name);
  }

  matchRouteByPath(path: string): RouteMatchResult | undefined {
    let matchResult: RouteMatchResult | undefined = this.routeMatchCache.get(path);
    if (matchResult) return matchResult;
    this.routeMatchList.some((routeMatch) => {
      const res = routeMatch.match(path);
      if (!res) return false;
      matchResult = {
        routeMeta: routeMatch.routeMeta,
        pathParams: res.params,
      };
      return true;
    });
    return matchResult;
  }

  printRoutes(): string {
    return JSON.stringify(this.routeMatchList.map((m) => m.routeMeta));
  }
}

let router: BlogNodeRouter = new BlogNodeRouter();

function getRouter(): BlogNodeRouter {
  return router;
}

function clearRouter(): void {
  router = new BlogNodeRouter();
}

export default {
  getRouter,
  clearRouter,
};
