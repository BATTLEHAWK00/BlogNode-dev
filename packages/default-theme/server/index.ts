import * as path from 'path';
// import RegisterRoutes from './routes';

const isDev = process.env.NODE_ENV === 'development';

async function prepare(): Promise<void> {
  logger.info('hello');
}

registerTheme({
  templatePath: path.resolve(__dirname, '../pages/'),
  themeName: 'default-theme',
  renderEngine: '@blognode/renderer-react',
  themeDescription: "BlogNode's default theme.",
  staticPath: path.resolve(__dirname, '../static'),
  staticPrefix: isDev ? undefined : '/static',
  prepare,
});
