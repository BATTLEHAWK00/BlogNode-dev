/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import * as i18n from 'i18n';

function load(locale: string): void {
  i18n.configure({
    locales: ['en', 'zh'],
    register: global,
  });
  i18n.setLocale(locale);
}

const _default = {
  load,
  getLocales: i18n.getLocales.bind(i18n),
};

export default _default;
__blognode.i18n = _default;
