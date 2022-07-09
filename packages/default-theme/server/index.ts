import * as path from 'path';
import { ThemeRegisterer } from 'blognode';
import RegisterRoutes from './routes';
// import App from '../components/dom/app';

const register: ThemeRegisterer = () => ({
  themePath: path.resolve(__dirname, '../pages/'),
  themeName: 'default-theme',
  staticDir: path.resolve(__dirname, '../static'),
  staticPrefix: '/static',
  ssrMiddleware: '@blognode/renderer-react',
  registerRoutes: RegisterRoutes,
});

export default register;
