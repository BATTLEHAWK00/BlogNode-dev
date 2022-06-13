import system from '@src/orm/service/system';
import i18n from '@src/system/i18n';
import logging from '@src/system/logging';
import { SystemMiddleware } from '@src/system/middleware';

class I18nMiddleware extends SystemMiddleware {
  async onInit(): Promise<void> {
    const locale = await system.get('locale') as string;
    i18n.load(locale);
    logging.systemLogger.info('Loaded locale:', locale);
  }
}
export default new I18nMiddleware();
