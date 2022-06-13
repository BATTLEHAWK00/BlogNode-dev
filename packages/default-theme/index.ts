import { ThemeRegisterer, service } from 'blognode';
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
service.systemService.get('blogName').then((res: any) => {
  console.log(res);
});
export default register;
