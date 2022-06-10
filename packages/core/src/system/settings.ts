import { Setting } from '@src/interface/setting';

import { BlogNodeError } from './error';

const settingMap:Map<string, Setting> = new Map<string, Setting>();

function registerSetting(setting:Setting) {
  if (settingMap.has(setting.name)) throw new BlogNodeError(`Setting '${setting.name}' has already been registered.`);
  settingMap.set(setting.name, setting);
}

registerSetting({
  name: 'blogName',
  description: 'The global blog name that the server uses.',
  defaultValue: 'BlogNode',
  preload: true,
});
registerSetting({
  name: 'blogDescription',
  description: 'The global blog name that the server uses.',
  defaultValue: 'A BlogNode app',
  preload: true,
});
registerSetting({
  name: 'adminEmail',
  description: 'The global blog name that the server uses.',
  defaultValue: 'example@example.com',
  preload: true,
});
registerSetting({
  name: 'firstStartAt',
  description: 'The global blog name that the server uses.',
  defaultValue: new Date(),
  preload: false,
});
registerSetting({
  name: 'themePackage',
  description: 'The global blog name that the server uses.',
  defaultValue: '@blognode/default-theme',
  preload: true,
});

function getSettings() {
  return [...settingMap.values()];
}

export default {
  getSettings,
};
