import * as path from 'path';
import { ThemeRegisterer } from 'blognode';
import RegisterRoutes from './routes';

const isDev = process.env.NODE_ENV === 'development';

const register: ThemeRegisterer = () => ({
  themePath: isDev ? path.resolve(__dirname, '../') : path.resolve(__dirname, '../../'),
  themeName: 'default-theme',
  staticDir: path.resolve(__dirname, '../.next/static/'),
  staticPrefix: '/_next/static',
  ssrMiddleware: '@blognode/middleware-next',
  registerRoutes: RegisterRoutes,
});

export default register;
