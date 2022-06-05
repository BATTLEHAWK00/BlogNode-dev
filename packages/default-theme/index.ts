import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const themeDir = isDev ? path.resolve(__dirname, '../') : __dirname;
// const themeDir = __dirname;
const themeName = 'default-theme';

export default {
  themeDir,
  themeName,
};
