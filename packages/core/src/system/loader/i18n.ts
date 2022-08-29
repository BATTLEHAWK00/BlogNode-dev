import { systemService } from '@src/orm/service/systemService';
import i18n from '@src/system/i18n';
import logging from '@src/system/logging';
import { SystemLoader } from '@src/system/manager/loader';

class I18nLoader extends SystemLoader {
  async load(): Promise<void> {
    const locale = await systemService.get('locale') as string;
    i18n.load(locale);
    logging.systemLogger.info('Loaded locale:', locale);
  }
}
export default new I18nLoader('i18n');
