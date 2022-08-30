import { FastifyPluginCallback, RouteHandlerMethod } from 'fastify';
import { glob } from 'glob';
import path from 'path';

export interface BlogNodeInternalHandler{
  get?: RouteHandlerMethod
  post?: RouteHandlerMethod
}

const plugin: FastifyPluginCallback = async (app) => {
  const routesDir = path.resolve(__dirname, 'routes').replaceAll('\\', '/');
  const globPath = path.resolve(__dirname, 'routes/**/*.{ts,js}').replaceAll('\\', '/');

  const filePaths = glob.sync(globPath);
  const routePaths = await Promise.all(filePaths.map(async (f) => {
    const file = f.replace(routesDir, '');
    return {
      routePath: file.substring(0, file.indexOf(path.extname(file))),
      routeDeclaration: (await import(`file://${f}`)).default.default as BlogNodeInternalHandler,
    };
  }));

  routePaths.forEach((r) => {
    if (r.routeDeclaration.get) app.get(r.routePath, r.routeDeclaration.get);
    if (r.routeDeclaration.post) app.post(r.routePath, r.routeDeclaration.post);
  });
};

export default plugin;
