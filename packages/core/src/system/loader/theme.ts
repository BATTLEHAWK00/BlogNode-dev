import { systemService } from '@src/orm/service/systemService';
import { WaitFunction } from '@src/util/sequencer';
import { SystemLoader } from '../manager/loader';
import theme from '../manager/theme';

class ThemeLoader extends SystemLoader {
  async load(wait: WaitFunction): Promise<void> {
    await wait(['db']);
    const themePackage = await systemService.get<string>('themePackage') || '@blognode/default-theme';
    await theme.loadTheme(themePackage);
  }
}

export default new ThemeLoader('theme', true);
