import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const themeDir = isDev ? path.resolve(__dirname, '../') : __dirname;
const themeName = 'default-theme';
const staticDir = null;

export default {
  themeDir,
  themeName,
  staticDir,
};
