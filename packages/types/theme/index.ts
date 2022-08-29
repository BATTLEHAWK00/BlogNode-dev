import type { Logger } from 'log4js';

export interface ThemeConfig{
  isDev: boolean
}
export interface ThemeInfo {
  themeName: string
  themeDescription: string
  templatePath: string
  renderEngine: string
  staticPrefix?: string
  staticPath?: string
  prepare(config: ThemeConfig): Promise<void>
}

declare global{
  function registerTheme(info: ThemeInfo): void;
  const logger: Logger;
  const isDev: boolean;
}
