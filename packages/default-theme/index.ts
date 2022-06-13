import { ThemeRegisterer } from 'blognode';
import path from 'path';

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
