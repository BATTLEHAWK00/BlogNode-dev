import * as crypto from 'crypto';
import { registerSetting } from '../settings';

registerSetting({
  name: 'blogName',
  description: 'The global blog name that the server uses.',
  defaultValue: 'BlogNode',
  preload: true,
});
registerSetting({
  name: 'blogDescription',
  description: 'A brief description of your blog.',
  defaultValue: 'A BlogNode app',
  preload: true,
});
registerSetting({
  name: 'adminEmail',
  description: 'Email address to send system notifications.',
  defaultValue: 'example@example.com',
  preload: true,
});
registerSetting({
  name: 'firstStartAt',
  description: 'The time at the server first start.',
  defaultValue: () => new Date(),
  preload: false,
});
registerSetting({
  name: 'themePackage',
  description: 'The theme package that server uses when starting.',
  defaultValue: '@blognode/default-theme',
  preload: true,
});
registerSetting({
  name: 'faviconPath',
  description: 'Favicon path',
  defaultValue: '/favicon.ico',
  preload: true,
});
registerSetting({
  name: 'cookie',
  description: '',
  defaultValue: () => ({
    secret: crypto.randomBytes(16).toString('hex'),
  }),
  preload: true,
});
registerSetting({
  name: 'postLinkStyle',
  description: '',
  defaultValue: '{id}.html',
  preload: true,
});
registerSetting({
  name: 'locale',
  description: 'Set locale for BlogNode system.',
  defaultValue: 'en',
  preload: true,
});
registerSetting({
  name: 'jwt-secret',
  description: 'Set JWT secret.',
  defaultValue: crypto.randomBytes(16).toString('hex'),
  preload: true,
});
registerSetting({
  name: 'smtp.host',
  description: 'SMTP host for email sending.',
  defaultValue: 'localhost',
  preload: true,
});
registerSetting({
  name: 'smtp.port',
  description: 'SMTP port for email sending.',
  defaultValue: 123,
  preload: true,
});
registerSetting({
  name: 'smtp.secure',
  description: 'SMTP tls for email sending.',
  defaultValue: false,
  preload: true,
});
registerSetting({
  name: 'smtp.username',
  description: 'SMTP username for email sending.',
  defaultValue: 'username',
  preload: true,
});
registerSetting({
  name: 'smtp.password',
  description: 'SMTP password for email sending.',
  defaultValue: 'pass',
  preload: true,
});
