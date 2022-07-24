import * as path from 'path';
import { ThemeRegisterer } from 'blognode';
import RegisterRoutes from './routes';
// import App from '../components/dom/app';

const isDev = process.env.NODE_ENV === 'development';

const register: ThemeRegisterer = () => ({
  themePath: path.resolve(__dirname, '../pages/'),
  themeName: 'default-theme',
  staticDir: path.resolve(__dirname, '../static'),
  staticPrefix: isDev ? undefined : '/static',
  ssrMiddleware: '@blognode/renderer-react',
  registerRoutes: RegisterRoutes,
});

export default register;
