import * as path from 'path';
import { ThemeRegisterer } from 'blognode';
import RegisterRoutes from './routes';

const register: ThemeRegisterer = () => ({
  themePath: path.resolve(__dirname, '../pages/'),
  themeName: 'default-theme',
  staticDir: path.resolve(__dirname, '../.next/static/'),
  staticPrefix: '/_next/static',
  ssrMiddleware: '@blognode/renderer-react',
  registerRoutes: RegisterRoutes,
});

export default register;
