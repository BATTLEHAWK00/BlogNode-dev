import { WaitFunction } from '@src/util/sequencer';
import { SystemLoader } from '../manager/loader';
import theme from '../manager/theme';

class ThemeLoader extends SystemLoader {
  async load(wait: WaitFunction): Promise<void> {
    await wait(['db']);
    await theme.loadTheme('@blognode/default-theme');
  }
}

export default new ThemeLoader('theme');
