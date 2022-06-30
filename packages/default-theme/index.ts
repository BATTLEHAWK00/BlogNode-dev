import * as path from 'path';
import { ThemeRegisterer } from '@blognode/theme-api-next';

const isDev = process.env.NODE_ENV === 'development';
const themePath = isDev ? path.resolve(__dirname, '../') : __dirname;
const themeName = 'default-theme';
const staticDir = undefined;

const register: ThemeRegisterer = () => ({
  themePath,
  themeName,
  staticDir,
});
export default register;
