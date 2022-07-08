import { Setting } from '@src/interface/setting';

import { BlogNodeError } from './error';

const settingMap: Map<string, Setting> = new Map<string, Setting>();

export function registerSetting(setting: Setting): void {
  if (settingMap.has(setting.name)) throw new BlogNodeError(`Setting '${setting.name}' has already been registered.`);
  settingMap.set(setting.name, setting);
}

function getSettings(): Setting[] {
  return [...settingMap.values()];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  getSettings,
};

export default _default;
__blognode.settings = _default;
